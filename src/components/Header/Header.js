import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ModalActions from 'actions/ModalActions';
import AccountHistoryActions from 'actions/AccountHistoryActions';
import DashboardActions from 'actions/DashboardActions';
import LotteryActions from 'actions/LotteryActions';
import BigNumber from 'bignumber.js';
import StorageService from 'services/StorageService';
import SignInService from 'services/SignInService';
import AccountChainRepository from 'repositories/AccountChainRepository';
import AppActions from 'actions/AppActions';
import { List } from 'immutable';
import Translate from 'react-translate-component';
import TermsBar from '../Dashboard/Terms/TermsBar.jsx';
import counterpart from 'counterpart';
import chainTypes from 'constants/chainTypes';
import moment from 'moment';
import {
  NotificationContainer,
  NotificationManager
} from 'react-notifications';
import { Tooltip } from 'react-tippy';
import Balance from './Balance';

import Pagination from 'components/elements/Pagination/PaginationContainer';

import imgLogo from '../../../assets/images/marine-corps-nh.png';

function mapStateToProps(state) {
  return {
    showSignOutModal: state.app.showSignOutModal,
    location: state.router.location.pathname.split('/')[1],
    fullLocation: state.router.location.pathname,
    userName: state.app.account.get('name'),
    balance: state.app.balance,
    precision: state.app.coreAsset.get('precision'),
    state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSignOutModal: () => dispatch(ModalActions.showModal('signOut')),
    selectCurrency: currency => dispatch(AppActions.selectCurrency(currency)),
    setDisplayedBalance: bal => dispatch(AppActions.setDisplayedBalance(bal)),
    subscribeHistory: () => dispatch(AccountHistoryActions.subscribeHistory()),
	unsubscribeHistory: () => dispatch(AccountHistoryActions.unsubscribeHistory()),
	dispatch
  };
}

function mergeProps(stateProps, dispatchProps) {

  switch (stateProps.fullLocation) {
    case '/history': {
      return {
        ...stateProps,
        ...dispatchProps,
        currentPage: stateProps.state.accountHistory.getIn([
          'accountHistoryTableParams',
          'page'
        ]),
        amountOfItems: stateProps.state.accountHistory.getIn([
          'accountHistoryTableParams',
          'filteredHistoryLength'
        ]),
        dateFilter: stateProps.state.accountHistory.getIn([
          'accountHistoryTableParams',
          'dateFilter'
        ]),
        activeFilters: stateProps.state.accountHistory.get('filters'),

        setPage: page =>
          dispatchProps.dispatch(AccountHistoryActions.setPage(page)),
        setDateFilter: date =>
          dispatchProps.dispatch(AccountHistoryActions.filterByDate(date)),
        setFilters: filters =>
          dispatchProps.dispatch(AccountHistoryActions.setFilters(filters))
      };

      break;
    }

    case (stateProps.fullLocation.match(/dashboard/) || {}).input: {
      return {
        ...stateProps,
        ...dispatchProps,
        currentPage: stateProps.state.dashboard.get('page'),
        amountOfItems: stateProps.state.dashboard.get('lotteriesIds').size,
        dateFilter: stateProps.state.dashboard.get('dateFilter'),
        activeFilters: stateProps.state.dashboard.get('filters'),
        setPage: page => dispatchProps.dispatch(DashboardActions.setPage(page)),
        setFilters: filters =>
          dispatchProps.dispatch(DashboardActions.setFilters(filters)),
        setDateFilterEnd: page =>
          dispatchProps.dispatch(DashboardActions.setDateFilterEnd(page)),
        setDateFilterStart: page =>
          dispatchProps.dispatch(DashboardActions.setDateFilterStart(page)),
        setTextFilter: page =>
          dispatchProps.dispatch(DashboardActions.setTextFilter(page)),
      };
      break;
    }

    case '/draws/mydraws': {
      return {
        ...stateProps,
        ...dispatchProps,
        //TODO - fix all the dashboard specific calls/data here
        //as features are implemented in My Draws
        currentPage: stateProps.state.sweeps.get('page'),
        //amountOfItems: stateProps.state.sweeps.get('userLotteries').size,
        amountOfItems: stateProps.state.sweeps.get('filteredCount'),
        //dateFilter: stateProps.state.dashboard.get("dateFilter"),
        activeFilters: stateProps.state.sweeps.get('filters'),
        setPage: page => dispatchProps.dispatch(LotteryActions.setPage(page)),
        setFilters: filters =>
          dispatchProps.dispatch(LotteryActions.filterUserLotteries(filters)),
        setActiveDraws: page =>
          dispatchProps.dispatch(LotteryActions.setActiveDraws(page))
      };
      break;
    }

    case '/draws/mytickets': {
      return {
        ...stateProps,
        ...dispatchProps,
        //TODO - fix all the dashboard specific calls/data here
        //as features are implemented in My Draws
        currentPage: stateProps.state.sweeps.get('page'),
        //amountOfItems: stateProps.state.sweeps.get('userLotteries').size,
        amountOfItems: stateProps.state.sweeps.get('filteredCount'),
        //dateFilter: stateProps.state.dashboard.get("dateFilter"),
        activeFilters: stateProps.state.sweeps.get('filtersTickets'),
        setPage: page => dispatchProps.dispatch(LotteryActions.setPage(page)),
        setFilters: filters =>
          dispatchProps.dispatch(LotteryActions.filterUserTickets(filters)),
        setActiveDraws: page =>
          dispatchProps.dispatch(LotteryActions.setActiveDraws(page))
      };
      break;
    }

    default: {
      return {
        ...stateProps,
        ...dispatchProps
      };
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps, mergeProps)
class Header extends React.Component {
  constructor(props) {
    super(props);

    if (StorageService.get('displayedBalance') >= 0) {
      this.state = {
        balance: StorageService.get('displayedBalance')
      };
    } else {
      this.state = {
        balance: 0
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      balance: StorageService.get('displayedBalance')
    });
  }

  signOut(e) {
    e.preventDefault();
    this.props.toggleSignOutModal();
  }

  getLanguagefromLocale(locale) {
    switch (locale) {
      case 'en':
        return 'Francais';
      case 'fr':
        return 'English';
    }
  }

  changeLocale(e) {
    switch (counterpart.getLocale()) {
      case 'en':
        counterpart.setLocale('fr');
        break;
      case 'fr':
        counterpart.setLocale('en');
        break;
    }
  }

  highlightTerms = (match, location) => {
    if (!location || !location.pathname) {
      return false;
    }
    if (
      location.pathname == '/terms/purchase' ||
      location.pathname == '/terms/creation'
    ) {
      return true;
    }
  };

  render() {
    const {
      currentPage,
      amountOfItems,
      setPage,
      setDateFilterEnd,
      setDateFilterStart,
      setTextFilter,
      setActiveDraws,
      userName,
      balance,
      precision,
      dateFilterEnd,
      dateFilterStart,
      textFilter,
      setFilters,
      activeDraws,
      activeFilters
    } = this.props;

    let userBalance =
      this.state.balance >= 0
        ? new BigNumber(this.state.balance)/(Math.pow(10, precision))
        : 0;

    return (
      <div className="headerContainer">
        <div className="container ">
          <div
            className="w-100 d-flex align-items-center bg-black row"
            id="wrapper_header"
          >
            <div className="logo col-md-3">
              <Link to="/home">
                <img className="easy5050" src={imgLogo} />
              </Link>
            </div>
            <div className="col-md-2 offset-md-7 d-flex flex-column">
              <span className="d-flex justify-content-between margin-zero">
                <span className="user-text">{'USER: '}</span>
                
                  <span className="username truncate"><Tooltip
                  title={this.props.userName}
                  position="bottom"
                  arrow
                >{this.props.userName}</Tooltip></span>
                
              </span>
              <Balance balance={userBalance} selectCurrency={this.props.selectCurrency} />
            </div>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          amountOfItems={amountOfItems}
          dateFilterStart={dateFilterStart}
          dateFilterEnd={dateFilterEnd}
          setPage={setPage}
          setDateFilterEnd={setDateFilterEnd}
          setDateFilterStart={setDateFilterStart}
          setTextFilter={setTextFilter}
          textFilter={textFilter}
          setFilters={setFilters}
          setActiveDraws={setActiveDraws}
          activeDraws={activeDraws}
          activeFilters={activeFilters}
          balance={userBalance}
          location={location}
          signOutFunc={this.signOut.bind(this)}
        />
        {!setPage ? <TermsBar /> : null}
      </div>
    );
  }
}

export default Header;
