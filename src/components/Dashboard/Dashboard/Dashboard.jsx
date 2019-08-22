import React from 'react';
import { connect } from 'react-redux';
import { ChainStore } from 'peerplaysjs-lib';
import moment from 'moment';
import countdown from 'countdown';
import classNames from 'classnames';
import BigNumber from 'bignumber.js';
import Popup from 'reactjs-popup';
import { List } from 'immutable';
import Translate from 'react-translate-component';
import Slide from 'react-reveal/Slide';
import Fade from 'react-reveal/Fade';
import AccountHistoryActions from 'actions/AccountHistoryActions';
import LotteryActions from 'actions/LotteryActions';
import constants from 'constants/tables';
import Rodal from 'rodal';

import DashboardActions from 'actions/DashboardActions';
import BuyTicketsAsideActions from 'actions/BuyTicketsAsideActions';
import Helper from '../Draws/Helper';
import DrawDetails from './DrawDetails';
import ProgressBar from './ProgressBar';
import Countdown from '../../utilities/Countdown';
import PaginationComponent from 'components/elements/Pagination/PaginationComponent';

import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

require('moment-countdown');

function mapStateToProps(state) {
  // console.log("state argument passed to mapStateToProps in dashboard");
  // console.log(state);
    return {
        lotteriesByHash: state.dashboard.get('lotteriesByHash'),
        assetsByHash: state.dashboard.get('assetsByHash'),
        lotteriesIds: state.dashboard.get('lotteriesIds'),
        creatorsByHash: state.dashboard.get('creatorsByHash'),
        countRowsOnPage: state.dashboard.get('countRowsOnPage'),
        sortField: state.dashboard.get('sortField'),
        sortDirection: state.dashboard.get('sortDirection'),
        page: state.dashboard.get('page'),
        dateFilterEnd: state.dashboard.get('dateFilterEnd'),
        dateFilterStart: state.dashboard.get('dateFilterStart'),
        textFilter: state.dashboard.get('textFilter'),
        activeDraws: state.dashboard.get('activeDraws'),
        benefactorsById: state.buyTicketsAside.get('benefactorsById'),
        lotteryObject: state.buyTicketsAside.get('lotteryObject'),
        location: state.router.location.pathname.split('/')[2],
        fullLocation: state.router.location.pathname,
        currentPage: state.dashboard.get('page'),
        amountOfItems: state.dashboard.get('lotteriesIds').size,
        dateFilter: state.dashboard.get('dateFilter'),
        activeFilters: state.dashboard.get('filters'),
        currency: state.app.selectedCurrency
    };
}

function mapDispatchToProps(dispatch) {
    return {
        fetchLotteries: () => dispatch(DashboardActions.fetchLotteries()),
        sortBy: sortField => dispatch(DashboardActions.sortBy(sortField)),
        openBuyTicketsAside: id => dispatch(BuyTicketsAsideActions.openAside(id)),
        closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
        updateInfo: () =>
      dispatch(
        BuyTicketsAsideActions.updateInfo(DashboardActions.setFilters(List()))
      ),
        resetFilters: () => dispatch(DashboardActions.setFilters(List())),
        setPage: page => dispatch(DashboardActions.setPage(page)),
        setFilters: filters => dispatch(DashboardActions.setFilters(filters)),
        setDateFilterEnd: page => dispatch(DashboardActions.setDateFilterEnd(page)),
        setDateFilter: page => dispatch(DashboardActions.setDateFilterStart(page)),
        setTextFilter: page => dispatch(DashboardActions.setTextFilter(page))
    };
}

@connect(mapStateToProps, mapDispatchToProps)

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.subscribe = this.subscribe.bind(this);
        this.IsJsonString = this.IsJsonString.bind(this);

        this.state = {
            loading: true,
            open: false,
            convertedTicketPrice: 0,
            showPostPurchase: false,
        };

        this.sortBy = this.sortBy.bind(this);
        this.onSetNextPage = this.onSetNextPage.bind(this);
        this.onSetPreviousPage = this.onSetPreviousPage.bind(this);
    }

    componentWillMount() {
        this.props.resetFilters();
        this.props.fetchLotteries().then(() =>
      this.setState({
          loading: false
      })
    );
    }

    componentDidMount() {
        ChainStore.subscribe(this.subscribe);

        if (this.props.location) {
            this.openModalAsync(this.props.location);
        }
    }

    componentWillUnmount() {
        ChainStore.unsubscribe(this.subscribe);
    // //this.props.closeBuyTicketsAside();
    }

    getLotteryDataAsync(id) {
        this.openInfoOnLoad(id);

        return new Promise(resolve => {
            const check = setInterval(() => {
        // console.warn(this.props.lotteriesByHash.get(id))
                if (this.props.lotteriesByHash.get(id)) {
                    clearInterval(check);
                    resolve();
                }
            }, 60);
        });
    }

    async openModalAsync(id) {
        const formattedId = `1.3.${id}`;
        await this.getLotteryDataAsync(formattedId);
        this.openModal();
    }

    openInfo(id, e) {
        e.preventDefault();
        this.props.openBuyTicketsAside(id);
    }

    openInfoOnLoad(id) {
        return new Promise(() => {
            this.props.openBuyTicketsAside(id);
        });
    }

    IsJsonString(str) {
        if (str.length <= 15) {
            return false;
        }

        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    sortBy(field, e) {
        const { sortBy } = this.props;
        e.preventDefault();
        sortBy(field);
    }

    subscribe() {
        this.props.fetchLotteries();
        this.props.updateInfo();
    }

    openModal = () => {
        this.setState({ showPostPurchase: true, open: true });
    };

    closeModal = () => {
        this.setState({ showPostPurchase: false, open: false });
        this.props.closeBuyTicketsAside();
    };

    showModal() {
        this.refs.modal.getDOMNode().modal();
    }

    onSetNextPage() {
        this.props.currentPage * constants.LIMIT < this.props.amountOfItems
      ? this.props.setPage(this.props.currentPage + 1)
      : null;
    }

    onSetPreviousPage() {
        this.props.currentPage > 1
      ? this.props.setPage(this.props.currentPage - 1)
      : null;
    }

    _sortIds(
    lotteriesIds,
    sortField,
    sortDirection,
    lotteriesByHash,
    creatorsByHash
  ) {
        let sortPath = [];

        if (sortField === 'id') {
            return lotteriesIds.sortBy(item => {
                const intId = parseInt(item.split('.')[2]);
                if (sortDirection === 'asc') {
                    return intId;
                }
                return -intId;
            });
        }
        switch (sortField) {
        case 'symbol':
            sortPath = ['options', 'description'];
            break;
        case 'current_supply':
            sortPath = ['dynamic', 'current_supply'];
            break;
        case 'max_supply':
            sortPath = ['options', 'max_supply'];
            break;
        case 'ticket_price':
            sortPath = ['lottery_options', 'ticket_price', 'amount'];
            break;
        case 'end_date':
            sortPath = ['lottery_options', 'end_date'];
            break;
        case 'creator':
            sortPath = [];
            break;
        case 'jackpot_amount':
            sortPath = ['dynamic', 'current_supply'];
            break;
        }

        return lotteriesIds.sort((a, b) => {
            let itemA;
            let itemB;

            switch (sortField) {
            case 'creator': {
                const lotteryA = lotteriesByHash.get(a);
                const lotteryB = lotteriesByHash.get(b);


                if (!lotteryA || !lotteryB) {
                    return 0;
                }

                itemA = creatorsByHash.get(lotteryA.get('issuer'));
                itemB = creatorsByHash.get(lotteryB.get('issuer'));

                sortPath = ['name'];

                break;
            }
            default:
                itemA = lotteriesByHash.get(a);
                itemB = lotteriesByHash.get(b);
            }

            if (!itemA || !itemB) {
                return 0;
            }

            if (sortDirection === 'asc') {
        // ASCENDING
                if (sortField === 'jackpot_amount') {
          // sort for jackpot amount
                    const ticketPricePath = ['lottery_options', 'ticket_price', 'amount'];
                    const numSoldPath = ['dynamic', 'current_supply'];
                    const maxSupplyPath = ['options', 'max_supply'];
                    if (
            (itemA.getIn(ticketPricePath) * itemA.getIn(numSoldPath)) >
            (itemB.getIn(ticketPricePath) * itemB.getIn(numSoldPath))
          ) {
                        return 1;
                    } else if (
            (itemA.getIn(ticketPricePath) * itemA.getIn(numSoldPath)) <
            (itemB.getIn(ticketPricePath) * itemB.getIn(numSoldPath))
          ) {
                        return -1;
                    } 
                    return 0;
                    
                } else if (sortField == 'symbol') {
                    let a = itemA.getIn(sortPath);
                    let b = itemB.getIn(sortPath);

                    if (Helper.IsJsonString(a) && Helper.IsJsonString(b)) {
                        a = JSON.parse(a).lottoName.toUpperCase();
                        b = JSON.parse(b).lottoName.toUpperCase();
                    }

                    return a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});

                } else if (sortField == 'ticket_price') {
                    const ticketPricePath = ['lottery_options', 'ticket_price', 'amount'];
                    const priceA = Number(itemA.getIn(ticketPricePath));
                    const priceB = Number(itemB.getIn(ticketPricePath));

                    if (priceA > priceB) {
                        return -1;
                    }
                    if (priceA < priceB) {
                        return 1;
                    }

                    if (priceA == priceB) {
                        return 0;
                    }

                } else {

                    if (itemA.getIn(sortPath) > itemB.getIn(sortPath)) {
                        return 1;
                    }

                    if (itemA.getIn(sortPath) < itemB.getIn(sortPath)) {
                        return -1;
                    }

                    if (itemA.getIn(sortPath) === itemB.getIn(sortPath)) {
                        return 0;
                    }
                }
            } else if (sortField == 'symbol') {
              let a = itemA.getIn(sortPath);
              let b = itemB.getIn(sortPath);

              if (Helper.IsJsonString(a) && Helper.IsJsonString(b)) {
                  a = JSON.parse(a).lottoName.toUpperCase();
                  b = JSON.parse(b).lottoName.toUpperCase();
              }
              
              return (-1 * a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'}));


          } else if (sortField == 'ticket_price') {
                const ticketPricePath = ['lottery_options', 'ticket_price', 'amount'];
                const priceA = Number(itemA.getIn(ticketPricePath));
                const priceB = Number(itemB.getIn(ticketPricePath));

                if (priceA < priceB) {
            // console.warn(itemA.getIn(ticketPricePath)/10000 + ' is less than ' + itemB.getIn(ticketPricePath)/10000);
                    return -1;
                }
                if (priceA > priceB) {
                    return 1;
                }

                if (priceA == priceB) {
                    return 0;
                }

            } else if (sortField === 'jackpot_amount') {
              const ticketPricePath = ['lottery_options', 'ticket_price', 'amount'];
              const maxSupplyPath = ['options', 'max_supply'];
              const numSoldPath = ['dynamic', 'current_supply'];

              if (
      itemA.getIn(ticketPricePath) * itemA.getIn(numSoldPath) >
      itemB.getIn(ticketPricePath) * itemB.getIn(numSoldPath)
    ) {
                  return -1;
              } else if (
      itemA.getIn(ticketPricePath) * itemA.getIn(numSoldPath) <
      itemB.getIn(ticketPricePath) * itemB.getIn(numSoldPath)
    ) {
                  return 1;
              }
              return 0;
          } else {
                if (itemA.getIn(sortPath) > itemB.getIn(sortPath)) {
                    return -1;
                }

                if (itemA.getIn(sortPath) < itemB.getIn(sortPath)) {
                    return 1;
                }

                if (itemA.getIn(sortPath) === itemB.getIn(sortPath)) {
                    return 0;
                }

            }
        });
    }

    render() {
        const me = this;
        const modalStyle = {
            border: '0',
            padding: '0',
            width: '600px',
            maxWidth: '100%',
            height: '540px',
            maxHeight: '100%',
            borderRadius: '5px'
        };

        const colorGold = {
            color: 'rgb(192, 163, 81)'
        };

        const drawButton = {
            background: '#000000',
            color: '#ffffff',
            fontFamily: 'Oxygen, sans-serif',
            fontSize: '1em',
            borderStyle: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
        };

        let { lotteriesIds } = this.props;
        const {
      page,
      lotteriesByHash,
      assetsByHash,
      creatorsByHash,
      countRowsOnPage,
      sortField,
      sortDirection
    } = this.props;
        const { loading } = this.state;

        lotteriesIds = this._sortIds(
      lotteriesIds,
      sortField,
      sortDirection,
      lotteriesByHash,
      creatorsByHash
    );

        lotteriesIds = lotteriesIds.slice(
      countRowsOnPage * (page - 1),
      Math.min(
        countRowsOnPage * (page - 1) + countRowsOnPage,
        lotteriesIds.size
      )
    );
        let lottery = '';
        if (lotteriesIds && lotteriesIds.size) {
            lotteriesIds.map(lotteryId => {
                lottery = lotteriesByHash.get(lotteryId);

                if (!lottery) {
                    return null;
                }
            });
        }

        const detailsRodalStyle = {
        background: 'black',
        color: 'white'
    };

        const detailsModal = (<div className="rodalDialog"><Rodal visible={this.state.open} onClose={this.closeModal.bind(this)} width={1000} height={500} customStyles={detailsRodalStyle} reset={false} >
      <DrawDetails open={this.state.open} showPostPurchase={this.state.showPostPurchase} onClose={this.closeModal.bind(this)}  />
    </Rodal></div>);


        console.log(this.props.fullLocation);
        return (
      <section className="content content-db">
        {detailsModal}
        <div className="table-responsive">
          <div className="borderTop-landing100"  /><table className="table table-striped "><div className="borderTop-landing600"  />
          <thead>
              <tr>
                <th scope="col">
                  {/* <!--Possible classes dor div.table__sortingTrigger: asc or desc--> */}
                  <a
href=""
                      className={classNames('table__sortingTrigger', {
                        asc: sortField === 'symbol' && sortDirection === 'asc',
                        desc: sortField === 'symbol' && sortDirection === 'desc'
                    })}
                      onClick={this.sortBy.bind(this, 'symbol')}
                  >
                    <div className="table-head-container">
                      <div className="Col-Header">
                        <Translate content="dashboard.draw_name" />
                      </div>
                      <div className="small-frame">
                        <div
                            className={

                            sortField === 'symbol' && sortDirection === 'asc'
                              ? 'up-arrow selected'
                              : 'up-arrow unselected'
                          }
                        >
                          &#9650;
                        </div>
                        <div
                              className={
                            sortField === 'symbol' && sortDirection === 'desc'
                              ? 'down-arrow selected'
                              : 'down-arrow unselected'
                          }
                          >
                          &#9660;
                          </div>
                      </div>
                    </div>
                  </a>
                </th>
                <th scope="col">
                      <a
                          href=""
                          className={classNames('table__sortingTrigger', {
                              asc: sortField === 'creator' && sortDirection === 'asc',
                              desc: sortField === 'creator' && sortDirection === 'desc'
                          })}
                          onClick={this.sortBy.bind(this, 'creator')}
                      >
                        <div className="table-head-container">
                          <div className="Col-Header">
                            <Translate content="dashboard.creator" />
                          </div>
                          <div className="small-frame">
                            <div
                              className={
                            sortField === 'creator' && sortDirection === 'asc'
                              ? 'up-arrow selected'
                              : 'up-arrow unselected'
                          }
                          >
                          &#9650;
                          </div>
                            <div
                              className={
                            sortField === 'creator' && sortDirection === 'desc'
                              ? 'down-arrow selected'
                              : 'down-arrow unselected'
                          }
                          >
                          &#9660;
                          </div>
                          </div>
                        </div>
                      </a>
                    </th>
                <th scope="col">
                      <a
                          href=""
                          className={classNames('table__sortingTrigger', {
                              asc: sortField === 'end_date' && sortDirection === 'asc',
                              desc: sortField === 'end_date' && sortDirection === 'desc'
                          })}
                          onClick={this.sortBy.bind(this, 'end_date')}
                      >
                        <div className="table-head-container">
                          <div className="Col-Header">
                            <Translate content="dashboard.resolution_type" />
                          </div>
                          <div className="small-frame">
                            <div
                              className={
                            sortField === 'end_date' && sortDirection === 'asc'
                              ? 'up-arrow selected'
                              : 'up-arrow unselected'
                          }
                          >
                          &#9650;
                          </div>
                            <div
                              className={
                            sortField === 'end_date' && sortDirection === 'desc'
                              ? 'down-arrow selected'
                              : 'down-arrow unselected'
                          }
                          >
                          &#9660;
                          </div>
                          </div>
                        </div>
                      </a>
                    </th>
                <th className="th">
                      <a
                          href=""
                          className={classNames('table__sortingTrigger', {
                              asc:
                        sortField === 'ticket_price' && sortDirection === 'asc',
                              desc:
                        sortField === 'ticket_price' && sortDirection === 'desc'
                          })}
                          onClick={this.sortBy.bind(this, 'ticket_price')}
                      >
                        <div className="table-head-container">
                          <div className="Col-Header">
                            <Translate content="dashboard.ticket_price" />
                          </div>
                          <div className="small-frame">
                            <div
                              className={
                            sortField === 'ticket_price' &&
                            sortDirection === 'asc'
                              ? 'up-arrow selected'
                              : 'up-arrow unselected'
                          }
                          >
                          &#9650;
                          </div>
                            <div
                              className={
                            sortField === 'ticket_price' &&
                            sortDirection === 'desc'
                              ? 'down-arrow selected'
                              : 'down-arrow unselected'
                          }
                          >
                          &#9660;
                          </div>
                          </div>
                        </div>
                      </a>
                    </th>
                <th scope="col">
                      <a
                          href=""
                          className={classNames('table__sortingTrigger', {
                              asc:
                        sortField === 'jackpot_amount' &&
                        sortDirection === 'asc',
                              desc:
                        sortField === 'jackpot_amount' &&
                        sortDirection === 'desc'
                          })}
                          onClick={this.sortBy.bind(this, 'jackpot_amount')}
                      >
                        <div className="table-head-container">
                          <div className="Col-Header">
                            <Translate content="dashboard.jackpot_amount" />
                          </div>
                          <div className="small-frame">
                            <div
                              className={
                            sortField === 'jackpot_amount' &&
                            sortDirection === 'asc'
                              ? 'up-arrow selected'
                              : 'up-arrow unselected'
                          }
                          >
                          &#9650;
                          </div>
                            <div
                              className={
                            sortField === 'jackpot_amount' &&
                            sortDirection === 'desc'
                              ? 'down-arrow selected'
                              : 'down-arrow unselected'
                          }
                          >
                          &#9660;
                          </div>
                          </div>
                        </div>
                      </a>
                    </th>

                <th className="th">
                      <PaginationComponent
                          currentPage={this.props.currentPage}
                          onSetPreviousPage={this.onSetPreviousPage}
                          amountOfItems={this.props.amountOfItems}
                          onSetNextPage={this.onSetNextPage}
                      />
                    </th>
              </tr>
            </thead>
          <tbody>
                  {lotteriesIds && lotteriesIds.size ? (
                lotteriesIds.map(lotteryId => {
                    const lottery = lotteriesByHash.get(lotteryId);
                  //    let thing = lottery.getIn(['lottery_options', 'benefactors']);
                  //    let benefactorId = thing._tail.array[0]._root.entries[0][1]; // the id..
                  //    let benefactorUsername = benefactorId;

                    if (!lottery) {
                        return null;
                    }

                    const momentObject = moment
                    .utc(lottery.getIn(['lottery_options', 'end_date']))
                    .local();
                    const creator = creatorsByHash.get(lottery.get('issuer'));
                    const assetId = lottery.getIn([
                        'lottery_options',
                        'ticket_price',
                        'asset_id'
                    ]);
                    const asset = assetId ? assetsByHash.get(assetId) : null;
                    const endingOnSoldout = lottery.getIn([
                        'lottery_options',
                        'ending_on_soldout'
                    ]);

                    const openModalButton = (
                      <Tooltip
                      // options
                          title="Click to show more details about this draw"
                          position="right"
                          arrow="true"
                      >
                        <button
                            className="drawDetailsBtn"
                            onClick={this.openModal}
                        >
                          <Translate content="dashboard.details_btn" />
                        </button>
                      </Tooltip>
                  );

                    const isDateNull = !(
                    Date.parse(lottery.getIn(['lottery_options', 'end_date'])) +
                    momentObject.utcOffset() * 60 * 1000
                  );

                    let percentValue =
                    lottery.getIn(['dynamic', 'current_supply']) /
                    lottery.getIn(['options', 'max_supply']) *
                    100;

                    switch (true) {
                    case percentValue < 10:
                        percentValue = percentValue.toFixed(2);
                        break;
                    case percentValue < 100:
                        percentValue = percentValue.toFixed(1);
                        break;
                    }

                    const resolutionTime =
                    Date.parse(lottery.getIn(['lottery_options', 'end_date'])) +
                    momentObject.utcOffset() * 60 * 1000 -
                    Date.now();

                  /* Get draw type */
                    let drawType = Helper.getDrawType(
                    lottery.getIn(['options', 'description'])
                  );
                    const ticketsRemaining =
                    lottery.getIn(['options', 'max_supply']) -
                    lottery.getIn(['dynamic', 'current_supply']);
                    const endDate = moment
                    .utc(lottery.getIn(['lottery_options', 'end_date']))
                    .local();

                    let ticketsPrice =
                    lottery.getIn([
                        'lottery_options',
                        'ticket_price',
                        'amount'
                    ]) && asset
                      ? new BigNumber(
                          lottery.getIn([
                              'lottery_options',
                              'ticket_price',
                              'amount'
                          ])
                        )
                          .div(Math.pow(10, 9))
                          .toFixed(10)
                      : 0;
                    const ticketsTotal = lottery.getIn(['options', 'max_supply']);
                    const jackpot = ticketsPrice * lottery.getIn(['dynamic', 'current_supply']) * 0.5;
                    ticketsPrice = Helper.currencyConvert(ticketsPrice);

                    let drawTypeContent;

                    if (!drawType) {
                    // description.drawType not found -> legacy support
                        if (endingOnSoldout && !isDateNull) {
                      //   both
                            drawTypeContent = (
                              <span className="td__cell">
                                <span className="muted">
                                  <i className="fas fa-ticket-alt" />{' '}
                                  {ticketsRemaining}{' '}
                                  <i className="fas fa-hourglass-half" /> {endDate}
                                </span>
                              </span>
                      );
                        } else if (endingOnSoldout && isDateNull) {
                      // ticket
                            drawTypeContent = (
                              <span>
                                <i className="fas fa-ticket-alt" /> {ticketsRemaining}
                              </span>
                      );
                        } else {
                      //    time
                            drawTypeContent = (
                              <span className="td__cell">
                                <span className="">
                                  <i className="fas fa-hourglass-half" /> {endDate}
                                </span>
                          &nbsp;
                              </span>
                      );
                        }
                    } else {
                        switch (drawType) {
                        case 'Ticket Based':
                            drawType = (
                              <span>
                                <i className="fas fa-ticket-alt" />{' '}
                                {ticketsRemaining}
                              </span>
                        );
                            break;
                        case 'Time Based':
                            drawType = (
                              <span>
                                <i className="fas fa-hourglass-half" />{' '}
                                <Countdown dateTo={endDate} />{' '}
                              </span>
                        );
                            break;
                        case 'Ticket & Time Based':
                            drawType = (
                              <span>
                                <i className="fas fa-ticket-alt" />{' '}
                                {ticketsRemaining}{' '}
                                <i className="fas fa-hourglass-half" />{' '}
                                <Countdown dateTo={endDate} now={moment()} />{' '}
                              </span>
                        );
                            break;
                        }
                        drawTypeContent = (
                          <span className="td__cell">
                            <span className="muted">{drawType}</span>
                          </span>
                    );
                    }

                    return (
                      <tr
                          key={lotteryId}
                          className="tr js-show-aside"
                          onClick={this.openInfo.bind(this, lottery.get('id'))}
                      >
                        <Fade>
                          <td id="tableCustom" className="td">
                            <span
                                className="td__cell"
                                data-id={lottery.get('id')}
                            >
                              {lottery.getIn(['options', 'description']) ==
                              'desc' ||
                            !this.IsJsonString(
                              lottery.getIn(['options', 'description'])
                            ) ||
                            lottery.getIn(['options', 'description']) == ''
                              ? lottery.get('symbol')
                              : JSON.parse(
                                  lottery.getIn(['options', 'description'])
                                ).lottoName}
                            </span>
                          </td>

                          <td id="tableCustom" className="td">
                            <span className="td__cell">
                              {creator ? creator.get('name') : ''}
                            </span>
                          </td>

                          <td id="tableCustom" className="td">
                            {drawTypeContent}
                          </td>

                          <td id="tableCustom" className="td">
                            <span className="td__cell">
                              {ticketsPrice}{' '}
                              {asset ? '' : ''}
                            </span>
                          </td>
                          {/* change BTC to asset.get('symbol') */}
                          <td id="tableCustom" className="td">
                            {Helper.currencyConvert(jackpot)}
                          </td>
                        </Fade>
                        <td id="tableCustom" className="td text-center">
                          <span className="td__cell">{openModalButton}</span>
                        </td>
                      </tr>
                    );
                })
              ) : loading ? (
                <tr className="tr tr-no-cursor">
                  <td id="tableCustom" className="td td-full" colSpan="6">
                    <div className="table__empty">
                      <p>
                        <Translate content="dashboard.loading" />
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="tr tr-no-cursor">
                  <td id="tableCustom" className="td td-full" colSpan="6">
                    <div className="table__empty">
                      <p>
                        <Translate content="dashboard.no_draws_yet" />
                      </p>
                    </div>
                  </td>
                </tr>
              )}
                </tbody>
        </table>
        </div>
      </section>
    );
    }
}

export default Dashboard;
