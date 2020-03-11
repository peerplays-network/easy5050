import React from 'react';
import counterpart from "counterpart";
import { connect } from "react-redux";
import constants from 'constants/createDraw';
import chainTypes from 'constants/chainTypes';

import HistoryRowData from './HistoryRowData';


@connect(
  state => {
    let { page, path, direction, field } = state.accountHistory
      .get("accountHistoryTableParams")
      .toJS();
    const start = page * constants.LIMIT - constants.LIMIT;


    let accountHistory = state.accountHistory.get("accountHistory");

    return {
      accountHistory:
        accountHistory.length > constants.LIMIT
          ? accountHistory.slice(start, start + constants.LIMIT)
          : accountHistory,
      accountHistoryFilteredLength: accountHistory.length,
      precision: state.app.coreAsset.get("precision"),
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
      dispatch(AccountHistoryActions.setFilteredHistoryLength(size))
  })
)
class HistoryRow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        loading: true,
    };

  }

  render() {
    return (
      <HistoryRowData
      data = {this.props.tx}
      blockTime = {this.props.blockTime}
      precision = {this.props.precision}
      />
    )
  }
}

export default HistoryRow;
