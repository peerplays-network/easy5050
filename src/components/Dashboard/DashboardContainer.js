import React from 'react'
import {connect} from 'react-redux';
import Translate from 'react-translate-component';
import { Route, Switch } from 'react-router-dom';

import Header from '../Header/Header';
import NavigationMenu from '../NavigationMenu/NavigationMenu';
import SignOutModal from '../Modals/SignOutModal';
import Sweeps from './Sweeps/SweepsContainer';
import Tickets from './Sweeps/TicketsContainer';
import Dashboard from './Dashboard/Dashboard';
import History from './History/HistoryContainer';
import Create from './Draws/CreateContainer';
import Modals from 'components/Modals/ModalsContainer';
import Aside from 'components/elements/Aside/AsideContainer';
import BuyTicketsAside from './Dashboard/BuyTicketsAside';
import ConfirmationModal from '../Modals/ConfirmationModal';
import SuccessModal from '../Modals/SuccessModal';
import Terms from './Terms/TermsContainer';

@connect(
    (state) => {
        return {
            showBuyTicketsAside: state.buyTicketsAside.get('showAside'),
            showConfirmationModal: state.confirmationModal.get('showModal'),
            showSuccessModal: state.successModal.get('showModal'),
            pathname: state.router.location.pathname
        };
    }
)
class DashboardContainer extends React.Component {

    render() {
        return (
            <div className="wrapper">

                <Header />

                <Switch>
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/draws/mydraws" component={Sweeps} />
                    <Route path="/draws/mytickets" component={Tickets} />
                    <Route path="/history" component={History} />
                    <Route path="/draws/create" component={Create} />
                    <Route path="/terms" component={Terms} />
                    <Route component={Dashboard} />
                </Switch>

                {/*<!--possible class .active-->*/}
                {/* <aside className="aside">
                    <div className="aside__backdrop js-hide-aside"></div>
                    <div className="">
                        <div className="aside__header">
                            <a href="" className="aside__close js-hide-aside"><i className="icon-close"></i></a>
                            <div className="aside__title">Sweep 6</div>
                            <button className="btn btn-primary fluid">Buy tickets</button>
                        </div>
                        <div className="aside__body aside__scroll">
                            <div className="aside__section">
                                <div className="aside__sectionTitle">Info</div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Tickets Sold</div>
                                    <div className="aside__sectionLabeled">54</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Tickets Total</div>
                                    <div className="aside__sectionLabeled">67</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Tickets Price</div>
                                    <div className="aside__sectionLabeled">1.78 ETH</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Launch Date</div>
                                    <div className="aside__sectionLabeled"><span>12.07.2017</span><span>09:54</span></div>
                                </div>
                            </div>
                            <div className="aside__section">
                                <div className="aside__sectionTitle">Creator</div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Ernest S. New</div>
                                    <div className="aside__sectionLabeled"></div>
                                </div>
                            </div>
                            <div className="aside__section">
                                <div className="aside__sectionTitle">Benefactors</div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Benefactor 1</div>
                                    <div className="aside__sectionLabeled">10%</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Benefactor 2</div>
                                    <div className="aside__sectionLabeled">15%</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">Benefactor 3</div>
                                    <div className="aside__sectionLabeled">5%</div>
                                </div>
                            </div>
                            <div className="aside__section">
                                <div className="aside__sectionTitle">Winnings Distribution</div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">1-st Winner</div>
                                    <div className="aside__sectionLabeled">30%</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">2-nd Winner</div>
                                    <div className="aside__sectionLabeled">20%</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">3-rd Winner</div>
                                    <div className="aside__sectionLabeled">15%</div>
                                </div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">4-th Winner</div>
                                    <div className="aside__sectionLabeled">5%</div>
                                </div>
                            </div>
                            <div className="aside__section">
                                <div className="aside__sectionTitle">Current Jackpot</div>
                                <div className="aside__sectionRow">
                                    <div className="aside__sectionLabel">5 PPY</div>
                                    <div className="aside__sectionLabeled"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                </aside>

                <Aside /> */}
                {this.props.showBuyTicketsAside ? <BuyTicketsAside /> : null}
                {this.props.showConfirmationModal ? <ConfirmationModal /> : null}
                {this.props.showSuccessModal ? <SuccessModal /> : null}
            </div>
        );
    }
}

export default DashboardContainer;