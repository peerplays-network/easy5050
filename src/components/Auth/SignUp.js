import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Logo from './Logo';
import SignUpForm from './SignUpForm';
import SignUpActions from '../../actions/SignUpActions';
import NavigateActions from '../../actions/NavigateActions';
import BetaMessageContent from './BetaMessageContent';

@connect(
  state => {
    return {
      registerStatus: state.signUpPage.status,
      errors: state.signUpPage.errors,
      fValues: state.form
    };
  },
  {
    setRegisterStatus: SignUpActions.setRegisterStatus,
    signUp: SignUpActions.signUp,
    navigateToSignIn: NavigateActions.navigateToSignIn,
    navigateToLanding: NavigateActions.navigateToLanding
  }
)
class SignUp extends React.Component {

  constructor(props) {
    super(props);
}
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSubmit(values) {
    localStorage.setItem('login', null);
    this.props.setRegisterStatus('loading');
    setTimeout(() => {
      this.props.signUp(values.accountName, values.password);
    }, 0);
  }

  onClickLogin() {
    localStorage.setItem('login', null);
    this.props.navigateToLanding(null, false);
  }

  render() {
    return (
      <div className="black">
      <BetaMessageContent/>
        <SignUpForm
          errors={this.props.errors}
          fValues={this.props.fValues}
          registerStatus={this.props.registerStatus}
          onClickLogin={this.onClickLogin.bind(this)}
          onSubmit={this.handleSubmit.bind(this)}
          declineTerms={this.props.decline}
        />
      </div>
    );
  }
}

export default SignUp;
