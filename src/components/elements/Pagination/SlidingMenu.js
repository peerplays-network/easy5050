import React, { Component } from 'react';
import Translate from 'react-translate-component';
import { NavLink } from 'react-router-dom';
import imgLogo from '../../../../assets/images/Easy5050.png';
import NavLinkText from './NavLinkText';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

class SlidingMenu extends Component {
    closeMenu() {
        document.querySelector('.sliding-menu').style.right = '-50%';
    }

    render() {
        return (
          <div className="sliding-menu ">
              <div className="container padding-top-bottom-fix">
                  <div className="row d-flex justify-content-center">
                      <img className="easy5050" src={imgLogo} />
                    </div>
                </div>
              <div className="underline-golden" />
              <div className="container mt-3 text-white">
                  <a
                        href="javascript:void(0)"
                        onClick={this.closeMenu.bind(this)}
                        className="d-flex align-items-center"
                    >
                      <i className="fas fa-chevron-left mr-2" />
                      <span className="text-uppercase text-bold text-small">Close</span>
                    </a>
                </div>
              <div className="container mt-4">
                  <NavLink
                        id="dashboard"
                        to={'/dashboard'}
                        className="nav__item"
                        activeClassName="activeMenu"
                    >
                      <Tooltip
                            // options
                            title="Displays a table of currently active draws"
                            position="left"
                            arrow="true"
                        >
                          <NavLinkText
                                icon="fas fa-list-ul"
                                text="navigation.dashboard"
                                padding="mb-2"
                                textTransform="side-menu-text"
                            />
                        </Tooltip>
                    </NavLink>

                  <NavLink
                        id="myDraws"
                        to={'/draws/mytickets'}
                        className="nav__item"
                        activeClassName="activeMenu"
                    >
                      <Tooltip
                            // options
                            title="Displays a list of all your tickets"
                            position="left"
                            arrow="true"
                        >
                          <NavLinkText
                                icon="fas fa-ticket-alt"
                                text="navigation.my_draws"
                                padding="mb-2"
                                textTransform="side-menu-text"
                            />
                        </Tooltip>
                    </NavLink>

                  <NavLink
                        id="history"
                        to={'/history'}
                        className="nav__item"
                        activeClassName="activeMenu"
                    >
                      <Tooltip
                            // options
                            title="Displays the list of transactions performed on this account"
                            position="left"
                            arrow="true"
                        >
                          <NavLinkText
                                icon="fas fa-history"
                                text="navigation.history"
                                padding="mb-2"
                                textTransform="side-menu-text"
                            />
                        </Tooltip>
                    </NavLink>

                  <NavLink
                        id="fifty"
                        to={'/draws/mydraws'} // to={`/draws/create`}
                        className="nav__item"
                        activeClassName="activeMenu"
                    >
                      <Tooltip
                            // options
                            title="Displays a table of draws you've created"
                            position="left"
                            arrow="true"
                        >
                          <NavLinkText
                                icon="fab fa-bitcoin"
                                text="navigation.fifty_fifty"
                                padding="mb-2"
                                textTransform="side-menu-text"
                            />
                        </Tooltip>
                    </NavLink>
                  <NavLink
                        id="terms"
                        to={'/terms/purchase'}
                        className="nav__item"
                        activeClassName="activeMenu"
                    >
                      <Tooltip
                            // options
                            title="Read our terms and conditions"
                            position="left"
                            arrow="true"
                        >
                          <NavLinkText
                                icon="fas fa-file-alt"
                                text="navigation.terms"
                                padding="mb-2"
                                textTransform="side-menu-text"
                            />
                        </Tooltip>
                    </NavLink>
                </div>
              <div className="slider-footer">
                  <div className="mt-5 underline-golden" />
                  <div className="container text-center pt-3 pb-3">
                      <a
                            href=""
                            className="text-uppercase text-bold text-small"
                            onClick={this.props.signOut}
                        >
                          <i className="fas fa-user mr-3" />
                          <Translate content="dashboard.sign_out" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}

export default SlidingMenu;
