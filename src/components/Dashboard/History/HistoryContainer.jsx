import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fromJS } from 'immutable';
import AccountHistoryActions from 'actions/AccountHistoryActions';
import constants from 'constants/tables';
import chainTypes from 'constants/chainTypes';
import counterpart from 'counterpart';
import BigNumber from 'bignumber.js';

import HistoryRow from './HistoryRow';
import HistoryThead from './HistoryThead';
import PaginationComponent from '../../elements/Pagination/PaginationComponent';

import Helper from '../Draws/Helper';

import '../../../../assets/scss/stylesHistory.css';
import Translate from 'react-translate-component';

@connect(
  state => {
      const { page, path, direction, field } = state.accountHistory
      .get('accountHistoryTableParams')
      .toJS();
      const start = page * constants.LIMIT - constants.LIMIT;
    //  const operations = Object.entries(chainTypes.operations);
      const filters = state.accountHistory.get('filters');

      let accountHistory = state.accountHistory.get('accountHistory');

      let filterDate = false;
      let eDate;
      let sDate;

      if (filters !== undefined && filters.size > 0) {
          filterDate = true;
          sDate = filters.toJS()[filters.size - 1].val.start_date;
          eDate = filters.toJS()[filters.size - 1].val.end_date;
      }

      accountHistory = accountHistory
      .toJS()
      .map((tx, index) => {
          tx = {
              ...tx,
              ...state.accountHistory.getIn(['accountHistoryBlocksTime', index])
          };
          tx.op[1].symbol =
          tx.op[1].symbol ||
          state.accountHistory.getIn(['accountHistoryLotterySymbols', index]) ||
          'BTC';
          tx.op[1].typeName = Object.entries(chainTypes.operations).find(
          operation => operation[1] === tx.op[0]
        )[0];
          tx.op[1].assetPrice = state.accountHistory.getIn([
              'accountHistoryLotteryPrices',
              index
          ]);

          return tx;
      })
      .sort((a, b) => {
        // if (a.typeName == 'asset_create')

          let pathA = path;
          let pathB = path;

          let symbolA = '';
          let symbolB = '';

          if (a) {
              if (a.op[1].common_options && Helper.IsJsonString(a.op[1].common_options.description)) {
                  symbolA = JSON.parse(a.op[1].common_options.description).lottoName;
              } else {
                  symbolA = a.op[1].symbol;
              }
          }

          if (b) {
              if (b.op[1].common_options && Helper.IsJsonString(b.op[1].common_options.description)) {
                  symbolB = JSON.parse(b.op[1].common_options.description).lottoName;
              } else {
                  symbolB = b.op[1].symbol;
              }
          }

          if (!(path instanceof Array)) {
              pathA = path[a.op[0]];
              pathB = path[b.op[0]];
          }

          if (
          path[path.length - 1] === 'blockTime' ||
          path[path.length - 1] === 'typeName'
        ) {
          // sort for the first two columns
              for (let i = 0; i < pathA.length; i += 1) {
            // console.warn(pathA);
                  a = a[pathA[i]];
                  a = a || 0;

              }


              for (let j = 0; j < pathB.length; j += 1) {
                  b = b[pathB[j]];
                  b = b || 0;
              }

              if (path[path.length - 1] === 'typeName') {
                  a += symbolA;
                  b += symbolB;
              }

              a = a.toString().replace('asset_create', 'new draw');
              b = b.toString().replace('asset_create', 'new draw');

              a = Helper.replaceLotteryTypes(a);
              b = Helper.replaceLotteryTypes(b);

              return direction === 'asc' ? (a >= b ? 1 : -1) : a >= b ? -1 : 1;
          }

          if (
          a.op[1].typeName == 'lottery_asset_create' ||
          a.op[1].typeName == 'lottery_end' ||
          a.op[1].typeName == 'account_create'
        ) {
              a = Number.MIN_VALUE;
          } else if (a.op[1].typeName == 'ticket_purchase') {
              a =
            new BigNumber(a.op[1].assetPrice || 0)
              .dividedBy(Math.pow(10, 5))
              .toNumber() * a.op[1].tickets_to_buy;
          } else if (
          a.op[1].typeName == 'lottery_reward' ||
          a.op[1].typeName == 'transfer'
        ) {
              a = new BigNumber(a.op[1].amount.amount || 0)
            .dividedBy(Math.pow(10, 5))
            .toNumber();
          }

          if (
          b.op[1].typeName == 'lottery_asset_create' ||
          b.op[1].typeName == 'lottery_end' ||
          b.op[1].typeName == 'account_create'
        ) {
              b = Number.MIN_VALUE;
          } else if (b.op[1].typeName == 'ticket_purchase') {
              b =
            new BigNumber(b.op[1].assetPrice || 0)
              .dividedBy(Math.pow(10, 5))
              .toNumber() * b.op[1].tickets_to_buy;
          } else if (
          b.op[1].typeName == 'lottery_reward' ||
          b.op[1].typeName == 'transfer'
        ) {
              b = new BigNumber(b.op[1].amount.amount || 0)
            .dividedBy(Math.pow(10, 5))
            .toNumber();
          }

          return direction === 'asc' ? (a >= b ? 1 : -1) : a >= b ? -1 : 1;
      })
      .filter(lottery => {

          switch (lottery.op[1].typeName) { // build searchable event type parameter
          case 'lottery_asset_create':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.new_draw')});
              break;
          case 'lottery_reward':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.lottery_reward')});
              break;
          case 'lottery_end':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.lottery_end')});
              break;
          case 'ticket_purchase':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.ticket_purchase')});
              break;
          case 'account_create':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.account_create')});
              break;
          case 'transfer':
              Object.assign(lottery.op[1], {formattedType: counterpart('history.transfer')});
              break;
          default:
          }

          let passed = true;
          if (filters) {
              filters.map(f => {
                  switch (f.key) {
                  case 'textFilter':
                      if (lottery && Object.prototype.hasOwnProperty.call(lottery.op[1], 'common_options') && Helper.IsJsonString(lottery.op[1].common_options.description)) {
                          passed = passed && JSON.parse(lottery.op[1].common_options.description).lottoName.toUpperCase().includes(f.val.toUpperCase());
                      } else {
                          passed = passed && lottery.op[1].symbol.toUpperCase().includes(f.val.toUpperCase());
                      }

                      if (!passed && lottery.op[1].formattedType) {
                          passed = lottery.op[1].formattedType.toUpperCase().includes(f.val.toUpperCase());
                      }

                      break;
                  }
              });

              return passed;
          }
          return passed;

      });

      if (filterDate) {
          accountHistory = accountHistory.filter(tx => {

              const blockTime = moment(tx.blockTime);
              let endTime = moment(`${eDate } 23:59:59`);
              let startTime = moment(sDate);

              if (sDate === undefined) {
                  startTime = moment(0);
              }

              if (eDate === undefined) {
                  endTime = moment('3000-12-12');
              }

              return endTime.isAfter(blockTime) && blockTime.isAfter(startTime);
          });
      }

      return {
          accountHistory:
        accountHistory.length > constants.LIMIT
          ? accountHistory.slice(start, start + constants.LIMIT)
          : accountHistory,
          accountHistoryFilteredLength: accountHistory.length,
          amountOfItems: state.accountHistory.getIn([
              'accountHistoryTableParams',
              'filteredHistoryLength'
          ]),
          currentPage: state.accountHistory.getIn([
              'accountHistoryTableParams',
              'page'
          ]),
          precision: state.app.coreAsset.get('precision'),
          coreAsset: state.app.coreAsset,
          accountHistoryTableParams: {
              direction,
              sortedField: field,
              page,
              path,
              filteredArrayLength: accountHistory.length
          }
      };
  },
  dispatch => ({
      sortAccountHistory: (field, direction, path) =>
      dispatch(
        AccountHistoryActions.sortAccountHistory(field, direction, path)
      ),
      resetFilters: () => dispatch(AccountHistoryActions.resetFilters({})),
      subscribeHistory: () => dispatch(AccountHistoryActions.subscribeHistory()),
      unsubscribeHistory: () =>
      dispatch(AccountHistoryActions.unsubscribeHistory()),
      setFilteredHistoryLength: size =>
      dispatch(AccountHistoryActions.setFilteredHistoryLength(size)),
      setPage: page => dispatch(AccountHistoryActions.setPage(page)),
  })
)
class History extends React.Component {
    constructor(props) {
        super(props);

        this.headColumns = [
            {
                name: 'type',
                path: ['op', 1, 'typeName'],
                label: 'description'
            },
            {
                name: 'blockTime',
                path: ['blockTime'],
                label: 'date'
            },
            {
                name: 'asset_price',
                path: {
                    10: ['op', 1, 'extensions', 1, 'ticket_price', 'amount'],
                    5: ['op', 1, 'assetPrice'],
                    78: ['op', 1, 'assetPrice'],
                    79: ['op', 1, 'assetPrice'],
                    80: ['op', 1, 'assetPrice'],
                    0: ['op', 1, 'amount', 'amount']
          // '52': ['op', 1, 'assetPrice'],
          // '54': ['op', 1, 'participants', 1, 0],
          // '53': ['op', 1, 'amount', 'amount']
                },
                label: 'amount'
            }
        ];

        this.onSetNextPage = this.onSetNextPage.bind(this);
        this.onSetPreviousPage = this.onSetPreviousPage.bind(this);

    }

    componentWillMount() {
        this.props.resetFilters();
        this.props.subscribeHistory();
    }

    componentDidMount() {
        this.props.setFilteredHistoryLength(
      this.props.accountHistoryTableParams.filteredArrayLength
    );
    }

    componentWillReceiveProps(newProps) {
        if (
      newProps.accountHistoryFilteredLength !==
      this.props.accountHistoryFilteredLength
    ) {
            this.props.setFilteredHistoryLength(
        newProps.accountHistoryFilteredLength
      );
        }
    }

    shouldComponentUpdate(newProps) {
        return !fromJS(newProps.accountHistory).equals(
      fromJS(this.props.accountHistory)
    );
    }

    componentWillUnmount() {
        this.props.unsubscribeHistory();
    }

    onSetNextPage() {
        this.props.currentPage * constants.LIMIT < this.props.accountHistoryFilteredLength
          ? this.props.setPage(this.props.currentPage + 1)
          : null;
    }

    onSetPreviousPage() {
        this.props.currentPage > 1
          ? this.props.setPage(this.props.currentPage - 1)
          : null;
    }

    render() {
        const {
      accountHistory,
      precision,
      accountHistoryTableParams: { direction, sortedField }
    } = this.props;
        console.log('%c History Rendered', 'background: #222; color: #fff');
        
        return (
          <section className="content content-history">
            <div className="table__box">

              <div className="borderTop-history100Silver" />
              <table id="historyTable" className="table table-history">
                <div className="borderTop-history300Silver" ></div>
                <thead>
                  <tr>
                    {this.headColumns.map(field => (
                      <th scope="col">
                        <div className="table-head-container">
                          {<HistoryThead
                                key={field.label}
                                field={field}
                                sortedField={sortedField}
                                direction={direction}
                                sortAccountHistory={this.props.sortAccountHistory.bind(this)}
                              />
                            }
                          </div>
                      </th>
                    ))}
                    <th scope="col">
                    <PaginationComponent
                                  currentPage={this.props.currentPage}
                                  onSetPreviousPage={this.onSetPreviousPage}
                                  amountOfItems={this.props.accountHistoryFilteredLength}
                                  onSetNextPage={this.onSetNextPage}
                                />
                    </th>

                  </tr>

                </thead>

                <tbody>
                  {accountHistory.length ? (
                accountHistory.map((tx, index) => (
                  <HistoryRow
                      key={index}
                      tx={tx.op}
                      blockTime={tx.blockTime}
                      precision={precision}
                  />
                ))
              ) : (
                <tr className="tr tr-no-cursor">
                  <td className="td td-full" colSpan="5">
                    <div className="table__empty">
                      <p><Translate content="history.no-records" /></p>
                    </div>
                  </td>
                </tr>
              )}
                </tbody>
              </table>
              <div className="greyGradientSpacerBottom" id="greyGradientSpacerBottom" />

            </div>

          </section>
        );
    }
}

export default History;
