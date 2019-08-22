import React from 'react';
import Rodal from 'rodal';
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import 'rodal/lib/rodal.css';
import SignIn from './SignIn';
import SignUp from './SignUp';
import SignUpConfirmation from './SignUpConfirmation';
import NavigateActions from '../../actions/NavigateActions';

class LogInPage extends React.Component {

    constructor() {
        super();

        this.state = { visible: false, section: 'login' };

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.switchSection = this.switchSection.bind(this);
    }

    componentWillMount() {
      if(this.props.openLoginOnNewWindow)
        this.setState({ visible: true });
    }

    show(e) {

        if (this.props.isLogin) {
          // navigate to dashboard, user is already logged in
            this.props.navigateToDashboard();

        }
        e.preventDefault()
        this.setState({ visible: true });
        localStorage.setItem('login', '#login');
    }

    hide() {
        if(this.state.section == 'signup')
          this.setState({section: 'login'})
        else {
          this.setState({ visible: false }, this.setState({section: 'login'}));
          localStorage.setItem('login', null);
        }
    }

    switchSection(e) {
        e.preventDefault()
        if (this.state.section == 'login') {
            this.setState({
                section: 'signup'
            });
        } else {
            this.setState({
                section: 'login'
            });
        }

    }

    render() {
        const authStyle = {
            height: 'auto',
            top: '3%',
            bottom: 'auto',
            padding: 2,
            width: 800,
            borderRadius: 0,
        };

        let modalContent = (<p>Loading. . . </p>);

        if (this.state.section == 'login') {
            modalContent = (<span><SignIn visible={this.state.visible}/>
              
              <div className="login__footer text-center darkGreyUp pb-3">
                <Translate
                    component="div"
                    className="login__footerTitle text-white"
                    content="sign_in.login_form_sign_up_label"
                />
                <br />
                <button
                    className="btn-forward"
                    id="button_signup"
                    onClick={this.switchSection}
                >
                  <Translate className="btnText" content="auth.sign_up_btn" />
                </button>
              </div></span>);
        } else {
            modalContent = (<span><SignUp decline={this.switchSection} />
              <div className="loginCreate__note4 text-white text-uppercase blackbg-landing">
                <Translate
                    component="span"
                    content="sign_up.already_have_account"
                />
                <b>
                  <a
                      href="#login"
                      onClick={this.switchSection}
                      className="link-landing"
                  >
                    <Translate
                        component="span"
                        content="sign_up.login_link"
                    />
                  </a>
                </b>
              </div></span>);
        }


        let modalAccess = (<div className="d-flex align-items-center justify-content-center">
          <a
              className="no-decoration"
              href="javascript:void(0)"
              onClick={this.show}
          >
            <i className="fas fa-user" />
            {status}
          </a>
          <div className="rodalDialog">
            <Rodal
                customStyles={authStyle}
                visible={this.state.visible}
                onClose={this.hide.bind(this)}
                animation="slideDown"
            >
              {modalContent}
            </Rodal>
          </div>
        </div>);

        if (this.props.button && !this.props.isLogin) {
            modalAccess = (<div>
              <button
                  className="signup-btn-landing"
                  data-after="PLAY NOW"
                  data-before="SIGN UP"
                  onClick={this.show}
              >
    <Translate content="auth.play-now_btn" />
              </button>
              <Rodal
                  customStyles={authStyle}
                  visible={this.state.visible}
                  onClose={this.hide.bind(this)}
                  animation="slideDown"
              >
                {modalContent}
              </Rodal>
            </div>);
        }
        if(this.props.button && this.props.isLogin) {
          modalAccess = null
        }

        return (
          <div>{modalAccess}</div>
        );

    }
  }

const mapStateToProps = state => ({
    isLogin: state.app.isLogin
});

const mapDispatchToProps = dispatch => ({
    navigateToDashboard: () => {
        dispatch(NavigateActions.navigateToDashboard());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LogInPage);

