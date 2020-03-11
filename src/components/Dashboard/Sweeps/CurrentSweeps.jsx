import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';

import LotteryActions from 'actions/LotteryActions';
import AsideActions from 'actions/AsideActions';
import DashboardActions from 'actions/DashboardActions';
import BuyTicketsAsideActions from 'actions/BuyTicketsAsideActions';

import Rodal from 'rodal';
import Popup from 'reactjs-popup';
import SweepRow from './SweepRow';
import SweepThead from './SweepThead';
import Helper from '../../Dashboard/Draws/Helper';
import DrawDetails from '../../Dashboard/Dashboard/DrawDetails';
import constants from 'constants/tables';
import PaginationComponent from 'components/elements/Pagination/PaginationComponent';
import { ChainStore } from 'peerplaysjs-lib';

function mapStateToProps(state) {
    const field = state.sweeps.getIn(['userLotteriesTableParams', 'field']);
    const direction = state.sweeps.getIn([
        'userLotteriesTableParams',
        'direction'
    ]);
    const path = state.sweeps.getIn(['userLotteriesTableParams', 'path']);
    const filters = state.sweeps.get('filters');
    const activeDraws = state.sweeps.get('activeDraws');
    const page = state.sweeps.get('page');
    const countRowsOnPage = state.sweeps.get('countRowsOnPage');
    const lotteriesByHash = state.dashboard.get('lotteriesByHash');
    const assetsByHash = state.dashboard.get('assetsByHash');
    const userLotteries = state.sweeps.get('userLotteries').merge(state.sweeps.get('userLotteriesBlockTime'))
  .map((lottery, index) => ({
      ...lottery,
      ...state.sweeps.getIn(['userLotteriesBlocksTime', index])
  })).sort(Helper.universalTableSort(lotteriesByHash, path, direction))
      .filter(lottery => {
          let passed = true;
          let lStart = 0;
          if (lottery.blockTime) {
            lStart = new Date(lottery.blockTime).toISOString();
        }

          const lottoEnd = lottery.lottery_options.end_date;


          if (activeDraws && !lottery.lottery_options.is_active) {
            return false;
        }

          filters.map(f => {
            switch (f.key) {
          case 'textFilter':
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
        userLotteries,
        field,
        direction,
        path,
        page,
        countRowsOnPage,
        filteredLength: userLotteries.size,
        assetsByHash: state.dashboard.get('assetsByHash'),
        lotteriesByHash: state.dashboard.get('lotteriesByHash'),
        coreAsset: state.app.coreAsset,
        userLotteriesTableParams: {
          direction: state.sweeps.getIn(['userLotteriesTableParams', 'direction']),
          sortedField: state.sweeps.getIn(['userLotteriesTableParams', 'field']),
          path: state.sweeps.getIn(['userLotteriesTableParams', 'path'])
      },
        currentPage: state.sweeps.get('page'),
        amountOfItems: state.sweeps.get('filteredCount'),
        activeFilters: state.sweeps.get('filters')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        subscribeUserLotteries: cb =>
      dispatch(LotteryActions.subscribeUserLotteries(cb)),
        unsubscribeUserLotteries: cb =>
      dispatch(LotteryActions.unsubscribeUserLotteries(cb)),
        sortUserLotteries: (field, direction, path) =>
      dispatch(LotteryActions.sortUserLotteries(field, direction, path)),
        setSweepAdditionalInfo: id =>
      dispatch(AsideActions.setSweepAdditionalInfo(id)),
        fetchLotteries: cb => dispatch(DashboardActions.fetchLotteries(cb)),
        resetFilters: () => dispatch(LotteryActions.filterUserLotteries(List())),
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
export default class CurrentSweeps extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
        openModal: false
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
      this.props.resetActiveDraws();
      this.props.fetchLotteries();
      this.props.subscribeUserLotteries();
  }

    componentDidMount() {
      ChainStore.subscribe(this.subscribe);
      this.props.setFilteredCount(this.props.userLotteries.size);
      if (this.props.location) {
          this.openModalAsync(this.props.location);
      }
  }

    componentWillReceiveProps(newProps) {
        if (
      (!newProps.userLotteries.size &&
        newProps.userLotteries.size === this.props.userLotteries.size) ||
      newProps.userLotteries.size
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
      !newProps.userLotteries.equals(this.props.userLotteries) ||
      newState.loading !== this.state.loading || newState.openModal !== this.state.openModal
      );
    }

    subscribe() {
      this.props.fetchLotteries();
      this.props.updateInfo();
  }


    componentWillUnmount() {
        ChainStore.unsubscribe(this.subscribe);
        this.props.unsubscribeUserLotteries();
    }

    openModal = lottery => {
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

    render() {
      const modalStyle = {
        background: 'black',
        color: 'white'
    };
      const {
      assetsByHash,
      lotteriesByHash,
      coreAsset,
      userLotteries,
      setSweepAdditionalInfo,
      sortUserLotteries,
      countRowsOnPage,
      page,
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
          <div className="borderTop-landing100"  /><table className="table table-striped"><div className="borderTop-landing500"  />
          <thead>
              <tr>
                {this.headColumns.map(field => (
                  <SweepThead
                      key={field.label}
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
              {userLotteries.size ? (
                userLotteries
                  .slice(
                    countRowsOnPage * (page - 1),
                    Math.min(
                      countRowsOnPage * (page - 1) + countRowsOnPage,
                      userLotteries.size
                    )
                  )
                  .map(lottery => (
                    <SweepRow
                        lotteryInfo={lottery}
                        key={lottery.id}
                        coreAssetPrecision={coreAsset.get('precision')}
                        setSweepAdditionalInfo={setSweepAdditionalInfo}
                        assetsByHash={assetsByHash}
                        lotteriesByHash={lotteriesByHash}
                        modalVisible={this.openModal.bind(this, lottery)}
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
        userLotteries: PropTypes.instanceOf(List).isRequired,
        userLotteriesTableParams: PropTypes.shape({
          direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
          sortedField: PropTypes.string.isRequired,
      }),

        setSweepAdditionalInfo: PropTypes.func.isRequired,
        sortUserLotteries: PropTypes.func.isRequired,
        subscribeUserLotteries: PropTypes.func.isRequired,
        unsubscribeUserLotteries: PropTypes.func.isRequired
    };
}
