import React from 'react'
import { NavLink } from 'react-router-dom'

class NavigationMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isTermsOpened: ~props.pathname.indexOf('terms'),
            isTermsActive: ~props.pathname.indexOf('terms')
        };
    }

    onToggleTerms() {
        this.setState({
            isTermsOpened: !this.state.isTermsOpened
        });
    }

    render() {

        const { isTermsOpened, isTermsActive } = this.state;
        const { pathname } = this.props;

        return (
            <div className="nav__root">
                <nav className="nav">
                   
                    <NavLink to={`/dashboard`} className="nav__item" activeClassName="active">
                        <i className="icon-nav_dashboard" />
                        <span className="nav__itemText">Dashboard</span>
                    </NavLink>

                    <NavLink to={`/draws/create`} className="nav__item" activeClassName="active">
                        <i className="icon-nav_create" />
                        <span className="nav__itemText">Create New Draw</span>
                    </NavLink>

                    <NavLink to={`/draws/mydraws`} className="nav__item" activeClassName="active">
                        <i className="icon-nav_sweeps" />
                        <span className="nav__itemText">My Draws</span>
                    </NavLink>

                    <NavLink to={`/history`} className="nav__item" activeClassName="active">
                        <i className="icon-nav_history" />
                        <span className="nav__itemText">History</span>
                    </NavLink>

                    <div className={`nav__itemList ${ 
                        isTermsOpened ? 'open' : '' 
                    } ${ 
                        isTermsActive ? 'active' : '' 
                    }`} onClick={ this.onToggleTerms.bind(this) }>
                        <div className={ `nav__item pointer ${ isTermsActive ? 'active' : '' }`}>
                            <i className="icon-terms"></i>
                            <span className="nav__itemText">Terms &amp; Conditions</span>
                        </div>
                        <div className="nav__itemMenu">
                            <NavLink
                                to="/terms/creation"
                                className="nav__item"
                                activeClassName="active"
                            >
                                <i className="icon-circle"></i>
                                <span className="nav__itemText">On Draw Creation</span>
                            </NavLink>
                            <NavLink
                                to="/terms/purchase"
                                className="nav__item"
                                activeClassName="active"
                            >
                                <i className="icon-circle"></i>
                                <span className="nav__itemText">On Ticket Purchase</span>
                            </NavLink>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

export default NavigationMenu;