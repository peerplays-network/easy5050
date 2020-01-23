import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';

import LotteryActions from 'actions/LotteryActions';
import AsideActions from 'actions/AsideActions';
import DashboardActions from 'actions/DashboardActions';
import AccountHistoryActions from 'actions/AccountHistoryActions';

import AccountChainRepository from '../../../repositories/AccountChainRepository';
import PreviousSweepRow from './PreviousSweepRow';
import SweepThead from './SweepThead';
import ChainService from '../../../services/ChainService';
import Helper from '../../Dashboard/Draws/Helper';
import constants from 'constants/tables';
import PaginationComponent from 'components/elements/Pagination/PaginationComponent';

function mapStateToProps(state) {
  const field = state.sweeps.getIn(['userLotteriesTableParams', 'field']);
  const direction = state.sweeps.getIn([
    'userLotteriesTableParams',
    'direction'
  ]);
  const path = state.sweeps.getIn(['userLotteriesTableParams', 'path']);
  const filters = state.sweeps.get('filters');
  const activeDraws = state.sweeps.get('activeDraws');
  const page = state.sweeps.get('previousPage');
  const countRowsOnPage = state.sweeps.get('countRowsOnPage');
  const lotteriesByHash = state.dashboard.get('lotteriesByHash');
  const assetsByHash = state.dashboard.get('assetsByHash');
  const textFilter = state.sweeps.get('previousLotteriesTextFilter');
  const previousUserLotteries = state.sweeps
    .get('previousUserLotteries')
    .merge(state.sweeps.get('userLotteriesBlockTime'))
    .map((lottery, index) => {

      let dataArray = state.sweeps.getIn(['userLotteriesBlocksTime']).toArray();
      let location = dataArray.findIndex(x => x.tid == lottery.id);

      if (location == -1) {
        return {
          ...lottery,
          ...Date.now()
        };
      }


      return {
        ...lottery,
        ...state.sweeps.getIn(['userLotteriesBlocksTime', location])
      };
    })
    .filter(lottery => {

      return !lottery.lottery_options.is_active;
    })
    .sort(Helper.universalTableSort(lotteriesByHash, path, direction))
    .filter(lottery => {
      // console.warn(moment.utc(lottery.blockTime).local().format('MMMM Do YYYY, h:mm:ss a'));
      let passed = true;

      let lStart = new Date(0).toISOString();
      let lottoEnd = lottery.lottery_options.end_date;
      if (lottery.blockTime) {
        lStart = new Date(lottery.blockTime).toISOString();
        lottoEnd = lottery.lottery_options.end_date;
      }


      if (!JSON.parse(lottery.options.description).lottoName) {
        return false;
      }
      passed = passed && JSON.parse(lottery.options.description).lottoName.toUpperCase().includes(textFilter.toUpperCase());

      if (passed) {
        filters.map((f) => {
          if (f.key == 'dateRange') {
            let sDate = f.val.start_date,
                  eDate = f.val.end_date;
            const momentObject = moment.utc(lottoEnd).local();
  
              passed =
                passed &&
                ((eDate === undefined ||
                  moment(momentObject).isBefore(`${eDate  } 23:59:59`)) &&
                  (sDate === undefined || moment(momentObject).isAfter(sDate)));
          }
        })
      }

      return passed;
    });

  return {
    accountHistorySize: state.accountHistory.get('accountHistory').size,
    previousUserLotteries,
    field,
    direction,
    path,
    page,
    countRowsOnPage,
    filteredLength: previousUserLotteries.size,
    assetsByHash: state.dashboard.get('assetsByHash'),
    lotteriesByHash: state.dashboard.get('lotteriesByHash'),
    coreAsset: state.app.coreAsset,
    userLotteriesTableParams: {
      direction: state.sweeps.getIn(['userLotteriesTableParams', 'direction']),
      sortedField: state.sweeps.getIn(['userLotteriesTableParams', 'field']),
      path: state.sweeps.getIn(['userLotteriesTableParams', 'path'])
    },
    currentPage: state.sweeps.get('previousPage'),
    
    amountOfItems: state.sweeps.get('previousCount'),

    dateFilter: state.accountHistory.getIn([
      'accountHistoryTableParams',
      'dateFilter'
    ]),
    activeFilters: state.accountHistory.get('filters')
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
    resetPrevFilters: () => dispatch(LotteryActions.filterPreviousUserLotteries('')),
    resetActiveDraws: () => dispatch(LotteryActions.setActiveDraws(true)),
    setFilteredCount: count => dispatch(LotteryActions.setPreviousCount(count)),
    setPage: page =>
      dispatch(LotteryActions.setPreviousPage(page)),
    setDateFilter: date => dispatch(AccountHistoryActions.filterByDate(date)),
    setFilters: filters => dispatch(AccountHistoryActions.setFilters(filters))
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class PreviousSweeps extends React.Component {
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
  }

  componentWillMount() {
    this.props.resetFilters();
    this.props.resetPrevFilters();
    this.props.resetActiveDraws();
    this.props.fetchLotteries();
    this.props.subscribeUserLotteries();

    AccountChainRepository.fetchLotteryWinsRecursive().then(response => {
      this.setState({
        loading: false,
        lotteryWinners: response
      });
    });
  }

  componentDidMount() {
    this.props.setFilteredCount(this.props.previousUserLotteries.size);

  }

  componentWillReceiveProps(newProps) {

    if (
      (!newProps.previousUserLotteries.size &&
        newProps.previousUserLotteries.size ===
          this.props.previousUserLotteries.size) ||
      newProps.previousUserLotteries.size
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
      !newProps.previousUserLotteries.equals(
        this.props.previousUserLotteries
      ) || newState.loading !== this.state.loading
    );
  }

  componentWillUnmount() {
    this.props.unsubscribeUserLotteries();
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
    //Moving to componentWillMount
    //this.props.fetchLotteries();
    const {
      assetsByHash,
      lotteriesByHash,
      coreAsset,
      userLotteries,
      previousUserLotteries,
      setSweepAdditionalInfo,
      sortUserLotteries,
      countRowsOnPage,
      page,
      userLotteriesTableParams: { direction, sortedField, path }
    } = this.props;
    const { loading, lotteryWinners } = this.state;

    return (
      <section className="content content-mySweeps">
        <div className="table__box">
        <div className="borderTop-landing100Silver"/><table className="table table-striped-inactive-my-tickets"><div className="borderTop-landing500Silver"/>
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
              {previousUserLotteries.size ? (
                previousUserLotteries
                  .slice(
                    countRowsOnPage * (this.props.currentPage - 1),
                    Math.min(
                      countRowsOnPage * (this.props.currentPage - 1) + countRowsOnPage,
                      previousUserLotteries.size
                    )
                  )
                  .map(lottery => (
                    <PreviousSweepRow
                      lotteryInfo={lottery}
                      key={lottery.id}
                      coreAssetPrecision={coreAsset.get('precision')}
                      setSweepAdditionalInfo={setSweepAdditionalInfo}
                      assetsByHash={assetsByHash}
                      lotteriesByHash={lotteriesByHash}
                      lotteryWinners={lotteryWinners}
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
    previousUserLotteries: PropTypes.instanceOf(List).isRequired,
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
