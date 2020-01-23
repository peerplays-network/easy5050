import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';

import chainTypes from 'constants/chainTypes';
import LotteryActions from 'actions/LotteryActions';
import AsideActions from 'actions/AsideActions';
import DashboardActions from 'actions/DashboardActions';
import BuyTicketsAsideActions from 'actions/BuyTicketsAsideActions';
import { ChainStore } from 'peerplaysjs-lib';

import Rodal from 'rodal';
import Popup from 'reactjs-popup';
import TicketSweepRow from './TicketSweepRow';
import SweepThead from './SweepThead';
import Helper from '../../Dashboard/Draws/Helper';
import DrawDetails from '../../Dashboard/Dashboard/DrawDetails';
import constants from 'constants/tables';
import PaginationComponent from 'components/elements/Pagination/PaginationComponent';

function mapStateToProps(state) {
  let accountHistory = state.accountHistory.get('accountHistory');
  const field = state.sweeps.getIn(['userLotteriesTableParams', 'field']);
  const direction = state.sweeps.getIn([
    'userLotteriesTableParams',
    'direction'
  ]);
  const path = state.sweeps.getIn(['userLotteriesTableParams', 'path']);
  const filters = state.sweeps.get('filtersTickets');
  const activeDraws = state.sweeps.get('activeDraws');
  const page = state.sweeps.get('page');
  const countRowsOnPage = state.sweeps.get('countRowsOnPage');
  const lotteriesByHash = state.dashboard.get('lotteriesByHash');
  const assetsByHash = state.dashboard.get('assetsByHash');
  const time =state.sweeps.get('userTicketsBlocksTime');
  const ticketAmount = state.sweeps.get('userTicketsAmountPurchased');
  const userTickets = state.sweeps.get('userTickets').merge(state.sweeps.get('????????'))
    .map((lottery, index) => {    
  
      return {
        ...lottery,
        ...state.sweeps.getIn(['userTicketsBlocksTime', index])
      };
    })
    .sort(Helper.universalTableSort(lotteriesByHash, path, direction))
    .filter(lottery => {
      let passed = true;

      const lStart = new Date(lottery.blockTime).toISOString();

      const lottoEnd = lottery.lottery_options.end_date;
      if (activeDraws && !lottery.lottery_options.is_active) {
        return false;
      }
  
      filters.map(f => {
        switch (f.key) {
          case 'textFilter':
          if (lottery.options) {
            if (Helper.IsJsonString(lottery.options.description)) {
              passed =
                passed &&
                JSON.parse(lottery.options.description)
                  .lottoName.toUpperCase()
                  .includes(f.val.toUpperCase());
            } else {
              passed =
                passed &&
                lottery.symbol.toUpperCase().includes(f.val.toUpperCase());
            }
          }
            break;
            case 'dateRange':
              let sDate = f.val.start_date,
                eDate = f.val.end_date;
                const momentObject = moment.utc(lottoEnd).local();

              passed =
              passed &&
              ((eDate === undefined ||
                moment(momentObject).isBefore(`${eDate } 23:59:59`)) &&
                (sDate === undefined || moment(momentObject).isAfter(sDate)));

              break;
        }
      });
      return passed;
    });
  

  return {
    accountHistorySize: state.accountHistory.get('accountHistory').size,
    userTickets,
    field,
    direction,
    path,
    page,
    countRowsOnPage,
    filteredLength: userTickets.size,
    assetsByHash: state.dashboard.get('assetsByHash'),
    lotteriesByHash: state.dashboard.get('lotteriesByHash'),
    ticketAmount: state.sweeps.get('userTicketsAmountPurchased'),
    coreAsset: state.app.coreAsset,
    userLotteriesTableParams: {
      direction: state.sweeps.getIn(['userLotteriesTableParams', 'direction']),
      sortedField: state.sweeps.getIn(['userLotteriesTableParams', 'field']),
      path: state.sweeps.getIn(['userLotteriesTableParams', 'path'])
    },
    currentPage: state.sweeps.get('page'),
    amountOfItems: state.sweeps.get('filteredCount'),
    activeFilters: state.sweeps.get('filtersTickets'),
    currency: state.app.selectedCurrency,
    textFilter: state.sweeps.get('filtersTickets')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    subscribeUserTickets: cb =>
      dispatch(LotteryActions.subscribeUserTickets(cb)),
    unsubscribeUserTickets: cb =>
      dispatch(LotteryActions.unsubscribeUserTickets(cb)),
    sortUserLotteries: (field, direction, path) =>
      dispatch(LotteryActions.sortUserLotteries(field, direction, path)),
    setSweepAdditionalInfo: id =>
      dispatch(AsideActions.setSweepAdditionalInfo(id)),
    fetchLotteries: cb => dispatch(DashboardActions.fetchLotteries(cb)),
    resetFilters: () => dispatch(LotteryActions.filterUserTickets(List())),
    resetPrevFilters: () => dispatch(LotteryActions.filterPreviousUserTickets('')),
    resetActiveDraws: () => dispatch(LotteryActions.setActiveDraws(true)),
    setFilteredCount: count => dispatch(LotteryActions.setFilteredCount(count)),
    openBuyTicketsAside: id => dispatch(BuyTicketsAsideActions.openAside(id)),
    closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
    setPage: page => dispatch(LotteryActions.setPage(page)),
    setFilters: filters =>
      dispatch(LotteryActions.filterUserLotteries(filters)),
    setActiveDraws: page => dispatch(LotteryActions.setActiveDraws(page)),
    updateInfo: () => dispatch(BuyTicketsAsideActions.updateInfo()),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class CurrentTickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      openModal: false,
    };

    this.headColumns = [
      {
        name: 'symbol',
        path: ['options', 'description'],
        label: 'draw_name'
      },
      {
        name: 'resolution',
        path: ['lottery_options', 'end_date'],
        label: 'resolution'
      },
      {
        name: 'amount',
        path: ['lottery_options', 'ticket_price', 'amount'],
        label: 'tickets_price'
      },
      {
        name: 'jackpot_amount',
        path: ['dynamic', 'current_supply'],
        label: 'jackpot_amount'
      }
    ];

    this.onSetNextPage = this.onSetNextPage.bind(this);
    this.onSetPreviousPage = this.onSetPreviousPage.bind(this);
    this.subscribe = this.subscribe.bind(this);
  }

  componentWillMount() {
    this.props.resetFilters();
    this.props.resetPrevFilters();
    this.props.resetActiveDraws();
    this.props.fetchLotteries();
    this.props.subscribeUserTickets();
  }

  componentDidMount() {
    ChainStore.subscribe(this.subscribe);
    this.props.setFilteredCount(this.props.userTickets.size);
    if (this.props.location) {
      this.openModalAsync(this.props.location);
    }
  }

  componentWillReceiveProps(newProps) {
    if (
      (!newProps.userTickets.size &&
        newProps.userTickets.size === this.props.userTickets.size) ||
      newProps.userTickets.size
    ) {
      this.setState({
        loading: false
      });
    }

    if (newProps.filteredLength !== this.props.filteredLength) {
      this.props.setFilteredCount(newProps.filteredLength);
    }
  }

  shouldComponentUpdate(newProps, newState) {
    return (
      !newProps.userTickets.equals(this.props.userTickets) ||
      newState.loading !== this.state.loading || !(newProps.currency == this.props.currency) || this.props.lotteriesByHash.size === 0
      || newState.openModal !== this.state.openModal
    );
  }

  componentWillUnmount() {
    ChainStore.unsubscribe(this.subscribe);
    this.props.unsubscribeUserTickets();
  }

  openModal = (lottery) => {
    this.setState({ openModal: true });
    this.openInfo(lottery.id);
  }

  closeModal = () => {
    this.setState({ openModal: false });
    this.props.closeBuyTicketsAside();
  };

  openInfo(id) {
    this.props.openBuyTicketsAside(id);
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

  subscribe() {
        this.props.fetchLotteries();
        this.props.updateInfo();
    }

  render() {

    //console.log('%c CurrentSweeps Rendered','background: #222; color: #ef9637');
    const modalStyle = {
      background: 'black',
      color: 'white'
    };
    const {
      assetsByHash,
      lotteriesByHash,
      coreAsset,
      userTickets,
      setSweepAdditionalInfo,
      sortUserLotteries,
      countRowsOnPage,
      page,
      ticketAmount,
      userLotteriesTableParams: { direction, sortedField, path }
    } = this.props;
    const { loading } = this.state;

    const detailsModal = (
      <div className="rodalDialog">
        <Rodal
          visible={this.state.openModal}
          onClose={this.closeModal}
          customStyles={modalStyle}
          width={1000} 
          height={500}
        >
            <DrawDetails
              showPostPurchase={this.state.openModal}
              onClose={this.closeModal.bind(this)}
              open={this.state.openModal}
              // benefactor={benefactorUsername}
            />
        </Rodal>
      </div>
    );

    return (
      <section className="content content-mySweeps">
        {detailsModal}
        <div className="table__box">
        <div className="borderTop-landing100"/><table className="table table-striped"><div className="borderTop-landing500"/>
            <thead>
              <tr>
                {this.headColumns.map((field, index) => (
                  <SweepThead
                    key={index}
                    field={field}
                    path={path}
                    sortUserLotteries={sortUserLotteries.bind(this)}
                    direction={direction}
                    sortedField={sortedField}
                  />
                ))}
                <th scope="col">
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
              {userTickets.size ? (
                userTickets
                  .slice(
                    countRowsOnPage * (page - 1),
                    Math.min(
                      countRowsOnPage * (page - 1) + countRowsOnPage,
                      userTickets.size
                    )
                  )
                  .map((lottery, index) => (
                    <TicketSweepRow
                      lotteryInfo={lottery}
                      key={index}
                      coreAssetPrecision={coreAsset.get('precision')}
                      setSweepAdditionalInfo={setSweepAdditionalInfo}
                      assetsByHash={assetsByHash}
                      lotteriesByHash={lotteriesByHash}
                      modalVisible={this.openModal.bind(this, lottery)}
                      ticketAmount={ticketAmount}
                    />
                  ))
              ) : loading ? (
                <tr className="tr tr-no-cursor">
                  <td className="td td-full" colSpan="5">
                    <div className="table__empty">
                      <Translate content="sweeps.loading" component="p" />
                    </div>
                  </td>
                </tr>
              ) : (
                <tr className="tr tr-no-cursor">
                  <td className="td td-full" colSpan="5">
                    <div className="table__empty">
                      <Translate
                        content="sweeps.no_transactions_yet"
                        component="p"
                      />
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

  static propTypes = {
    coreAsset: PropTypes.shape().isRequired,
    userTickets: PropTypes.instanceOf(List).isRequired,
    userLotteriesTableParams: PropTypes.shape({
      direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
      sortedField: PropTypes.string.isRequired,
    }),

    setSweepAdditionalInfo: PropTypes.func.isRequired,
    sortUserLotteries: PropTypes.func.isRequired,
    subscribeUserTickets: PropTypes.func.isRequired,
    unsubscribeUserTickets: PropTypes.func.isRequired
  };
}
