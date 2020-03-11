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

import AccountChainRepository from '../../../repositories/AccountChainRepository';
import PreviousTicketSweepRow from './PreviousTicketSweepRow';
import SweepThead from './SweepThead';
import Helper from '../../Dashboard/Draws/Helper';
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
  const textFilter = state.sweeps.get('previousTicketsTextFilter');
  const test = state.sweeps.get('userTicketsBlocksTime');
  const ticketAmount = state.sweeps.get('userTicketsAmountPurchased');
  //console.warn('block time',test);
  const userTickets = state.sweeps.get('previousUserTickets')
    .merge(state.sweeps.get('????'))
    .map((lottery, index) => {
      return {
        ...lottery,
        ...state.sweeps.getIn(['userTicketsBlocksTime', index])
      };
    })
    .filter(lottery => {
      let passed = true;
      if (List.isList(lottery)) {
        if (JSON.parse(lottery.getIn(['options','description'])).lottoName) {
          passed = JSON.parse(lottery.getIn(['options','description'])).lottoName.toUpperCase().includes(textFilter.toUpperCase());
        } else {
          passed = lottery.get('symbol').includes(textFilter.toUpperCase());
        }
      } else if (JSON.parse(lottery.options.description).lottoName) {
        passed = JSON.parse(lottery.options.description).lottoName.toUpperCase().includes(textFilter.toUpperCase());
      } else {
        passed = lottery.symbol.includes(textFilter.toUpperCase());
      }
       
      return passed;
    })
    .sort(Helper.universalTableSort(lotteriesByHash, path, direction))
    .filter(lottery => {
      let passed = true;


        let lStart = new Date(lottery.blockTime).toISOString();
        let lottoEnd = lottery.lottery_options.end_date;



      if (!JSON.parse(lottery.options.description).lottoName) {
        return false;
      }
      passed = passed && JSON.parse(lottery.options.description).lottoName.toUpperCase().includes(textFilter.toUpperCase());

      if (passed) {
        filters.map((f) => {
          if (f.key == 'dateRange') {
            let sDate = f.val.start_date;
            let eDate = f.val.end_date;
            const momentObject = moment.utc(lottoEnd).local();

              passed =
                passed &&
                ((eDate === undefined ||
                  moment(momentObject).isBefore(`${eDate  } 23:59:59`)) &&
                  (sDate === undefined || moment(momentObject).isAfter(sDate)));
          }
        });
      }

      return passed;
    });

  // accountHistory = accountHistory
  //     .toJS()
  //     .map((tx, index) => {
  //         tx = {
  //             ...tx,
  //             ...state.accountHistory.getIn(['accountHistoryBlocksTime', index])
  //         };

  //         tx.op[1].symbol =
  //         tx.op[1].symbol ||
  //         state.accountHistory.getIn(['accountHistoryLotterySymbols', index]) ||
  //         'BTC';
  //         tx.op[1].typeName = Object.entries(chainTypes.operations).find(
  //         operation => operation[1] === tx.op[0]
  //       )[0];
  //         tx.op[1].assetPrice = state.accountHistory.getIn([
  //             'accountHistoryLotteryPrices',
  //             index
  //         ]);

  //         return tx;
  //     }).filter(lottery => {
  //       return lottery.op[0] === 52
  //     })

  return {
    accountHistorySize: state.accountHistory.get('accountHistory').size,
    accountHistory: state.accountHistory.get('accountHistory'),
    userTickets,
    field,
    direction,
    path,
    page,
    countRowsOnPage,
    filteredLength: userTickets.size,
    assetsByHash: state.dashboard.get('assetsByHash'),
    lotteriesByHash: state.dashboard.get('lotteriesByHash'),
    coreAsset: state.app.coreAsset,
    ticketAmount: state.sweeps.get('userTicketsAmountPurchased'),
    userLotteriesTableParams: {
      direction: state.sweeps.getIn(['userLotteriesTableParams', 'direction']),
      sortedField: state.sweeps.getIn(['userLotteriesTableParams', 'field']),
      path: state.sweeps.getIn(['userLotteriesTableParams', 'path'])
    },
    currentPage: state.sweeps.get('previousPage'),
    amountOfItems: state.sweeps.get('previousCount'),
    activeFilters: state.sweeps.get('filters'),
    currency: state.app.selectedCurrency
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
    setTicketAdditionalInfo: id =>
      dispatch(AsideActions.setTicketAdditionalInfo(id)),
    fetchLotteries: cb => dispatch(DashboardActions.fetchLotteries(cb)),
    resetFilters: () => dispatch(LotteryActions.filterUserLotteries(List())),
    resetActiveDraws: () => dispatch(LotteryActions.setActiveDraws(true)),
    setFilteredCount: count => dispatch(LotteryActions.setPreviousCount(count)),
    openBuyTicketsAside: id => dispatch(BuyTicketsAsideActions.openAside(id)),
    closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
    setPage: page => dispatch(LotteryActions.setPreviousPage(page)),
    setFilters: filters =>
      dispatch(LotteryActions.filterUserLotteries(filters)),
    setActiveDraws: page => dispatch(LotteryActions.setActiveDraws(page)),
    updateInfo: () => dispatch(BuyTicketsAsideActions.updateInfo()),
    filterChange: text => dispatch(LotteryActions.filterPreviousUserTickets(text))
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PreviousTickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      lotteryWinners: []
    };

    this.headColumns = [
      {
        name: 'symbol',
        path: ['options', 'description'],
        label: 'draw_name'
      },
      {
        name: 'draw_date',
        path: ['blockTime'],
        label: 'draw_date'
      },
      {
        name: 'amount',
        path: ['lottery_options', 'ticket_price', 'amount'],
        label: 'tickets_price'
      },
      {
        name: 'jackpot_amount',
        path: ['lottery_options', 'jackpot_amount'],
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
    this.props.subscribeUserTickets();

    AccountChainRepository.fetchLotteryWinsRecursive().then(response => {
      this.setState({
        loading: false,
        lotteryWinners: response
      });
    });
  }

  componentDidMount() {
    ChainStore.subscribe(this.subscribe);
    this.props.setFilteredCount(this.props.userTickets.size);
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
      newState.loading !== this.state.loading || !(newProps.currency == this.props.currency) || this.props.lotteriesByHash.size === 0 || newProps.currentPage != this.props.currentPage
    );
  }

  componentWillUnmount() {
    ChainStore.unsubscribe(this.subscribe);
    this.props.unsubscribeUserTickets();
    this.props.closeBuyTicketsAside();
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
      border: '0',
      padding: '0',
      width: '600px',
      maxWidth: '100%',
      height: '540px',
      maxHeight: '100%',
      borderRadius: '5px'
    };
    const {
      assetsByHash,
      lotteriesByHash,
      coreAsset,
      userTickets,
      setTicketAdditionalInfo,
      sortUserLotteries,
      countRowsOnPage,
      page,
      accountHistory,
      ticketAmount,
      userLotteriesTableParams: { direction, sortedField, path }
    } = this.props;
    const { loading, lotteryWinners } = this.state;
    return (
      <section className="content content-mySweeps">
        <div className="table__box">
        <div className="borderTop-landing100Silver"/><table className="table table-striped-inactive-my-tickets"><div className="borderTop-landing500Silver"/>
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
                    countRowsOnPage * (this.props.currentPage - 1),
                    Math.min(
                      countRowsOnPage * (this.props.currentPage - 1) + countRowsOnPage,
                      userTickets.size
                    )
                  )
                  .map(lottery => (
                    <PreviousTicketSweepRow
                      lotteryInfo={lottery}
                      key={List.isList(lottery) ? lottery.get("id") : lottery.id}
                      coreAssetPrecision={coreAsset.get('precision')}
                      setTicketAdditionalInfo={setTicketAdditionalInfo}
                      assetsByHash={assetsByHash}
                      lotteriesByHash={lotteriesByHash}
                      lotteryWinners={lotteryWinners}
                      accountHistory={accountHistory}
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

    setTicketAdditionalInfo: PropTypes.func.isRequired,
    sortUserLotteries: PropTypes.func.isRequired,
    subscribeUserTickets: PropTypes.func.isRequired,
    unsubscribeUserTickets: PropTypes.func.isRequired
  };
}
