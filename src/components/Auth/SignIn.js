import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import SignInActions from '../../actions/SignInActions';
import NavigateActions from '../../actions/NavigateActions';

import SignInForm from './SignInForm';
import Logo from './Logo';

@connect(
  state => {
    return {
      status: state.signInPage.status,
      errors: state.signInPage.errors
      //     locale: state.settings.locale
    };
  },
  {
    signIn: SignInActions.signIn,
    setLoginStatus: SignInActions.setLoginStatus,
    navigateToSignUp: NavigateActions.navigateToSignUp,
    navigateToLanding: NavigateActions.navigateToLanding,
    navigateToBTSClaim: NavigateActions.navigateToBTSClaim
    // navigateToForgotPassword: AuthActions.navigateToForgotPassword,
    // navigateToClaim: AuthActions.navigateToClaim
  }
)
class SignIn extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit(values) {
    let next;

    // if (this.props.location.query && this.props.location.query.next) {
    //   next = this.props.location.query.next;
    // }

    this.props.setLoginStatus('loading');

    setTimeout(() => {
      this.props.signIn(values.accountName, values.password, next);
    }, 0);
  }

  navigateToBTSClaim(e) {
    this.props.navigateToBTSClaim();
    e.preventDefault();
  }

  navigateToSignUp() {
    this.props.navigateToSignUp();
  }

  render() {
    return (
      <div className="dialog-login">
        <div className="text-center text-uppercase text-bold pt-3 darkGrey">
          <h3 className="text-golden">Sign In</h3>
        </div>
        
        <div className="signinContainer black">
          <SignInForm
            visible={this.props.visible}
            errors={this.props.errors}
            btnStatus={this.props.status}
            onSubmit={this.handleSubmit.bind(this)}
          />

        </div>
      </div>
    );
  }
}

export default SignIn;
