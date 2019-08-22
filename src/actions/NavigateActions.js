import { push, replace } from 'react-router-redux';

class NavigateActions {
  static navigateTo(path) {
    return dispatch => {
      if (path) {
        dispatch(push(path));
      } else {
        console.error('Unimplemented path', path);
      }
    };
  }

  static navigateToSignUp() {
    return dispatch => {
      dispatch(push('/sign-up'));
    };
  }

  static navigateToSignIn() {
    return dispatch => {
      dispatch(push('/sign-in'));
    };
  }

  static navigateToLanding() {
    return dispatch => {
      // window.location.pathname = '/home'

       dispatch(push('/home'));
    };
  }

  static navigateToDashboard() {
    return dispatch => {
      dispatch(push('/dashboard'));
    };
  }

  static navigateToBTSClaim() {
    return dispatch => {
      dispatch(push('/claims/bts'));
    };
  }
}

export default NavigateActions;
