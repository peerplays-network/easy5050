import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter, Switch } from 'react-router-dom';
import Loader from './utilities/Loader';

import { requireAuthentication } from './Auth/AuthenticatedComponent';
import DashboardContainer from './Dashboard/DashboardContainer';
import LogInPage from './Auth/LogInPage';
import ClaimBts from './Auth/ClaimBts';
import Landing from '../components/Landing/Landing';
import Footer from '../components/Footer/Footer';
import ModalActions from 'actions/ModalActions';
import AsideActions from 'actions/AsideActions';
import TermsContainer from './Dashboard/Terms/TermsContainer';
import Modals from 'components/Modals/ModalsContainer';
import Notifications from './Dashboard/Dashboard/Notifications';
import FAQ from './Dashboard/FAQ/FAQContainer';
import StorageService from '../services/StorageService';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.unsubscribeFromHistory;
  }

  componentWillMount() {
    //console.log("notifyChecks");
    //console.log(this.notifyChecks);
    const rates = {usd: 1, cad: 1, ppy: 1};
    StorageService.set('rates', rates);
    this.unsubscribeFromHistory = this.props.history.listen(location => {
      this.props.dispatch(ModalActions.hideAll());
      this.props.dispatch(AsideActions.hideAside());
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromHistory();
  }

  componentWillReceiveProps(nextProps) {
    let pathname = nextProps.location.pathname;

    if (
      /\/sign-in/.test(pathname) ||
      /\/claims/.test(pathname) ||
      /\/sign-up/.test(pathname)
    ) {
      document.body.classList.add('page__login');
    } else {
      document.body.classList.remove('page__login');
    }

    if (this.props.location.pathname !== nextProps.location.pathname) {
      document.documentElement.scrollTop = 0;
    }
  }

  render() {
    if (!this.props.dbIsInit || !this.props.chainIsInit) {
      return [
        <div key="1">
          <Loader />
        </div>,
        <Modals key="2" />
      ];
    }

    return [
      <Switch key="1">
        <Route path="/home" component={Landing} />
        <Route
          path="/dashboard"
          component={requireAuthentication(DashboardContainer)}
        />
        <Route
          path="/draws/create"
          component={requireAuthentication(DashboardContainer)}
        />
        <Route
          path="/draws/mydraws"
          component={requireAuthentication(DashboardContainer)}
        />
        <Route
          path="/history"
          component={requireAuthentication(DashboardContainer)}
        />
        <Route
          path="/terms"
          component={requireAuthentication(DashboardContainer)}
        />
        <Route
          path="/faq"
          component={FAQ}
        />
        <Route path="/sign-in" component={LogInPage} />
        <Route component={requireAuthentication(DashboardContainer)} />
      </Switch>,
      <Modals key="2" />,
      <Switch key="3">
        <Route path="/sign-in" component={null} />
        {/*<Route path="/" component={Notifications} ref={(child) => { this.notifyChecks = child; }} />*/}
        <Route path="/" component={Notifications} />
      </Switch>,
      <Footer key="4" />
    ];
  }
}

App.propTypes = {};

export default withRouter(
  connect(state => ({
    dbIsInit: state.app.dbIsInit,
    chainIsInit: state.app.chainIsInit
  }))(App)
);
