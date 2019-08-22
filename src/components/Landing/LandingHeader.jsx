import React from 'react';
import { connect } from 'react-redux';
import imgLogo from '../../../assets/images/5050Logo-70.png';
import LogInPage from '../Auth/LogInPage';
import { NavLink } from 'react-router-dom';
import SlidingMenu from '../elements/Pagination/SlidingMenu';
import AppActions from '../../actions/AppActions';

@connect(
  state => ({
    isLogin: state.app.isLogin
  }),
  dispatch => ({
    logout: () => dispatch(AppActions.logout()),
  })
)

class LandingHeader extends React.Component {
    constructor(props) {
        super(props);

        this.gotoFAQ = this.gotoFAQ.bind(this);
        this.slideMenu = this.slideMenu.bind(this);
    }

    slideMenu() {
      const menu = document.querySelector('.sliding-menu');
      menu.style.right = '0';
  }
    gotoFAQ(e) {
      e.preventDefault();
    }

    render() {
      let userButton = <LogInPage/>

      if (this.props.isLogin) {
        userButton = ( <a
        className="no-decoration"
        href="javascript:void(0)"
        onClick={this.slideMenu}
    ><i className="fas fa-user" /><span className="status-green" /><span className="status-green-glow" /></a>
  
  );
      }
        return (
            <div className="header-landing filters">
            <div className="container padding-zero">
              <div className="row m-0">
                <div className="col-md-5 d-flex justify-content-left margin-zero">
                <div className="logo col-md-3">
                <NavLink to={`/home`} activeClassName="active">
                <img src={imgLogo} />
          </NavLink>
            </div>
                </div>
                <div className="col-md-4 d-flex align-items-center margin-zero">
                </div>
                  <div className="col-md-3 d-flex align-items-center justify-content-end margin-zero">
                  {//<NavLink to={`/faq`} activeClassName="active">}
                  //<i className="fas fa-info"></i>
                  //</NavLink>
                }


                    <div className="divider-left ml-4 pl-4">
                    {userButton}
                    </div>
                  </div>
              </div>
            </div>
            <SlidingMenu
            signOut={this.props.logout}
        />
          </div> 
        );
    }
}
export default LandingHeader;
