import React from 'react';
import { connect } from 'react-redux';
import { ChainStore } from 'peerplaysjs-lib';
import { List } from 'immutable';
import BigNumber from 'bignumber.js';
import ScrollAnimation from 'react-animate-on-scroll';
import Fade from 'react-reveal';
import Rodal from 'rodal';
import { NotificationManager } from 'react-notifications';
import { Tooltip } from 'react-tippy';


import moment from 'moment';
import AppActions from 'actions/AppActions';
import DashboardActions from 'actions/DashboardActions';
import BuyTicketsAsideActions from 'actions/BuyTicketsAsideActions';
import AccountChainRepository from '../../repositories/AccountChainRepository';
import Helper from '../../components/Dashboard/Draws/Helper';
import FetchService from '../../services/FetchService';
import ChainService from '../../services/ChainService';


import globalimage from '../../../assets/images/landing/global-1900.png';
import arrowleft from '../../../assets/images/landing/arrowLeft.png';
import arrowright from '../../../assets/images/landing/arrowRight.png';
import getyourticket from '../../../assets/images/landing/getYourTicket.png';
import playnow from '../../../assets/images/landing/playNow.png';
import ticketimage from '../../../assets/images/landing/donorWinBig-1900.png';
import '../../../assets/scss/landing.scss';

import RenderInBrowser from 'react-render-in-browser';
import BrowserSupportModal from './BrowserSupportModal';
import RecentWinnersTable from './RecentWinnersTable';
import Countdown from '../utilities/Countdown';
import Loader from '../../components/utilities/Loader';
import LandingHeader from './LandingHeader';
import LogInPage from '../Auth/LogInPage';
import CurrencyBar from 'components/elements/CurrencyBar';
import DrawDetails from '../Dashboard/Dashboard/DrawDetails';
import Translate from 'react-translate-component';


require('moment-countdown');


@connect(
    state => ({
        lotteriesByHash: state.dashboard.get('lotteriesByHash'),
        assetsByHash: state.dashboard.get('assetsByHash'),
        lotteriesIds: state.dashboard.get('lotteriesIds'),
        creatorsByHash: state.dashboard.get('creatorsByHash'),
        countRowsOnPage: state.dashboard.get('countRowsOnPage'),
        sortField: state.dashboard.get('sortField'),
        sortDirection: state.dashboard.get('sortDirection'),
        page: state.dashboard.get('page'),
        dateFilterEnd: state.dashboard.get('dateFilterEnd'),
        dateFilterStart: state.dashboard.get('dateFilterStart'),
        textFilter: state.dashboard.get('textFilter'),
        activeDraws: state.dashboard.get('activeDraws'),
        benefactorsById: state.buyTicketsAside.get('benefactorsById'),
        lotteryObject: state.buyTicketsAside.get('lotteryObject'),
        location: state.router.location.pathname.split('/')[2],
        isLogin: state.app.isLogin,
        currency: state.app.selectedCurrency,
        exchangeRates: state.app.exchangeRates,
        precision: state.app.coreAsset.get('precision')

    }),
    dispatch => ({
        fetchLotteries: () => dispatch(DashboardActions.fetchLotteries()),
        sortBy: sortField => dispatch(DashboardActions.sortBy(sortField)),
        openBuyTicketsAside: id => dispatch(BuyTicketsAsideActions.openAside(id)),
        closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
        updateInfo: () => dispatch(BuyTicketsAsideActions.updateInfo(DashboardActions.setFilters(List()))),
        selectCurrency: currency => dispatch(AppActions.selectCurrency(currency)),
        setExchangeRates: rates => dispatch(AppActions.setExchangeRates(rates)),
        openBuyTicketsAside: id => dispatch(BuyTicketsAsideActions.openAside(id)),
    })
)
class Landing extends React.Component {

    constructor(props) {
        super(props);

        this.subscribe = this.subscribe.bind(this);
        this.getActiveLotterySum = this.getActiveLotterySum.bind(this);
        this.sortByCurrentJP = this.sortByCurrentJP.bind(this);
        this.showDetails = this.showDetails.bind(this);
        this.hideDetails = this.hideDetails.bind(this);
        this.openInfoAndShowDetails = this.openInfoAndShowDetails.bind(this);
        this.loadFeaturedDraws = this.loadFeaturedDraws.bind(this);
        // this.showPostPurchase = this.showPostPurchase.bind(this);

        this.state = {
            loading: true,
            lotteries: null,
            lotteryWins: [],
            modalVisible: false,
            detailsVisible: false,
            showPostPurchase: false,
            newWindowLogin: false,
            showBrowserSupportMessage: false,
            featuredDraws: false,
            jackpotAry: [null, null, null],
            highlightedDraws: []

        };

        // Helper.fetchConversionRates().then((rates) => {
        //   this.props.setExchangeRates(rates);
        // });

        Promise.resolve(FetchService.fetchExchangeRates()).then(response => {
            this.props.setExchangeRates(response);
        });
    }

    componentWillMount() {
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        const isFirefox = typeof InstallTrigger !== 'undefined';
        // let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

        if (!isChrome && !isFirefox && !localStorage.getItem('browserSupport')) {
            localStorage.setItem('browserSupport', true);
            this.setState({showBrowserSupportMessage: true});
        }

        if (localStorage.getItem('login') === '#login') {
            this.setState({newWindowLogin: true});
        } else {
            this.setState({newWindowLogin: false});
        }
    }

    componentDidMount() {
            const lotteriesByHash = this.props.lotteriesByHash;
            let highlightedDraws = [];

            if (lotteriesByHash.size > 0) {
                highlightedDraws = this.sortByCurrentJP(lotteriesByHash.filter(lotto => (lotto.getIn(['lottery_options', 'is_active']))));
    
                let bId;
                let bId2;
                let bId3;
    
                let p1;
                let p2;
                let p3;
    
                let benefactorObj;
                let benefactorObj2;
                let benefactorObj3;
    
    
                if (typeof highlightedDraws[0] !== 'undefined' && !this.state.benefactorObj) {
                    bId = highlightedDraws[0].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    p1 = ChainService.getBenefactors(bId).then((response) => {
                        benefactorObj = response;
                    });
                }
    
                if (typeof highlightedDraws[1] !== 'undefined' && !this.state.benefactorObj2) {
                    bId2 = highlightedDraws[1].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    
                    p2 = ChainService.getBenefactors(bId2).then((response) => {
                        benefactorObj2 = response;
                    });
    
                }
    
                if (typeof highlightedDraws[2] !== 'undefined' && !this.state.benefactorObj3) {
                    bId3 = highlightedDraws[2].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    
                    p3 = ChainService.getBenefactors(bId3).then((response) => {
                        benefactorObj3 = response;
                    });
                }
    
                Promise.all([p1, p2, p3]).then(() => {
                    this.setState({
                        benefactorObj,
                        benefactorObj2,
                        benefactorObj3
                    });
        
                });
    
                let jackpotAry = [null, null, null];
                switch (highlightedDraws.length) {
                case 0:
                    jackpotAry = [null, null, null];
                    break;
                case 1:
                    jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
                    break;
                case 2:
                    jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[1].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[1].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
                    break;
                default:
                    jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[1].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[1].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[2].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[2].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
                    break;
                }
    
                this.setState({
                    jackpotAry,
                    highlightedDraws,
                });
            }
        
        
        const p1 = this.props.fetchLotteries().then(lotteries => {

            this.setState({
                lotteries: lotteries.payload.lotteriesByHash,
                jackpotSum: this.getActiveLotterySum(lotteries.payload.lotteriesByHash),
                totalRaised: 0
            });
        });

        const p2 = AccountChainRepository.fetchLotteryWinsRecursive().then(response => {
            this.setState({
                lotteryWins: response
            });

            const total = response.reduce((a, b) => a + b.amount, 0);

            this.setState({
                totalRaised: this.getPrecision(total)
            });

        });

        Promise.all([p1, p2]).then(() => {
            this.setState({
                loading: false,
            });

        });


        ChainStore.subscribe(this.subscribe);
    }


    componentWillReceiveProps(nextProps) { // Ensure lotteriesByHash has loaded before we load benefactor data.
        let highlightedDraws = this.state.highlightedDraws;
        const lotteriesByHash = nextProps.lotteriesByHash;

        if (this.props.lotteriesByHash.size !== nextProps.lotteriesByHash.size) {
           
            if (lotteriesByHash.size > 0) {
                highlightedDraws = this.sortByCurrentJP(lotteriesByHash.filter(lotto => (lotto.getIn(['lottery_options', 'is_active']))));
    
                let bId;
                let bId2;
                let bId3;
    
                let p1;
                let p2;
                let p3;
    
                let benefactorObj;
                let benefactorObj2;
                let benefactorObj3;
    
    
                if (typeof highlightedDraws[0] !== 'undefined' && !this.state.benefactorObj) {
                    bId = highlightedDraws[0].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    p1 = ChainService.getBenefactors(bId).then((response) => {
                        benefactorObj = response;
                    });
                }
    
                if (typeof highlightedDraws[1] !== 'undefined' && !this.state.benefactorObj2) {
                    bId2 = highlightedDraws[1].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    
                    p2 = ChainService.getBenefactors(bId2).then((response) => {
                        benefactorObj2 = response;
                    });
    
                }
    
                if (typeof highlightedDraws[2] !== 'undefined' && !this.state.benefactorObj3) {
                    bId3 = highlightedDraws[2].getIn(['lottery_options', 'benefactors']).toJS()[0].id;
                    
                    p3 = ChainService.getBenefactors(bId3).then((response) => {
                        benefactorObj3 = response;
                    });
                }
    
                Promise.all([p1, p2, p3]).then(() => {
                    this.setState({
                        benefactorObj,
                        benefactorObj2,
                        benefactorObj3
                    });
        
                });
    
            }
        }

        let jackpotAry = [null, null, null];
        switch (highlightedDraws.length) {
        case 0:
            jackpotAry = [null, null, null];
            break;
        case 1:
            jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
            break;
        case 2:
            jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[1].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[1].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
            break;
        default:
            jackpotAry = [lotteriesByHash.get(highlightedDraws[0].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[0].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[1].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[1].getIn(['lottery_options', 'ticket_price', 'amount']) / 2, lotteriesByHash.get(highlightedDraws[2].get('id')).getIn(['dynamic', 'current_supply']) * highlightedDraws[2].getIn(['lottery_options', 'ticket_price', 'amount']) / 2];
            break;
        }

        this.setState({
            jackpotAry,
            highlightedDraws,
        });

    }

    componentWillUnmount() {
        ChainStore.unsubscribe(this.subscribe);
    }

    subscribe() {
        this.props.fetchLotteries();
        this.props.updateInfo();
    }

    getActiveLotterySum(lotteries) {
        return this.getPrecision((lotteries.filter(lotto => lotto.get('lottery_options').get('is_active')).reduce((sum, x) => sum + x.get('lottery_options').get('ticket_price').get('amount') * x.getIn(['options', 'max_supply']), 0) / 2));
    }

    sortByCurrentJP(lotteries) {
        return lotteries.sort((a, b) => {
            const jackpotA = a.getIn(['lottery_options', 'ticket_price', 'amount']) * a.getIn(['dynamic', 'current_supply']);
            const jackpotB = b.getIn(['lottery_options', 'ticket_price', 'amount']) * b.getIn(['dynamic', 'current_supply']);

            if (jackpotA < jackpotB) { return -1; }
            if (jackpotA > jackpotB) { return 1; }
            return 0;
        }).reverse().toArray();
    }

    goToDrawOnDash(id) {

        if (this.props.isLogin) {
            id = parseInt(id.split('.')[2]);
            let url;

    // construct URL
            (window.location.port == 80 || window.location.port == 8080) ? url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/dashboard/${id}` : url = `${window.location.protocol}//${window.location.hostname}/dashboard/${id}`;
            window.location.href = url;
        } else {
            NotificationManager.error('You must be signed in to purchase tickets');
        }
    }

    openInfoAndShowDetails(id, e) {
        e.preventDefault();
        this.props.openBuyTicketsAside(id);
        this.setState({ showPostPurchase: true, detailsVisible: true });
    }

    openInfo(id, e) {
        e.preventDefault();
        this.props.openBuyTicketsAside(id);
    }

    showDetails() {
        this.setState({ showPostPurchase: true, detailsVisible: true });
    }

    hideDetails() {
        this.setState({ showPostPurchase: false, detailsVisible: false });
    }

    closeBrowserSupportMessage() {
        this.setState({ showBrowserSupportMessage: false});
    }

    loadFeaturedDraws() {
        if (this.state.featuredDraws == false) {
            this.setState({featuredDraws: true});

        }
    }

    getPrecision(amount) {
      //get precision from blockchain and apply
      return Number(new BigNumber(amount).div(Math.pow(10, this.props.precision)).toFixed(this.props.precision))
    }

    render() {
        if (this.state.loading) {
            return <Loader />;
        }

        const { lotteriesIds, lotteriesByHash, assetsByHash, benefactorsById } = this.props;

        const jackpotAry = this.state.jackpotAry;
        const highlightedDraws = this.state.highlightedDraws;

        const detailsRodalStyle = {
            background: 'black',
            color: 'white'
        };

        const browserSupportRodalStyle = {
            width: '500px',
            height: 'auto',
            bottom: 'auto',
            top: '30%',
            padding: '2px'

        };

        let benefactorObj = this.state.benefactorObj;
        let benefactorObj2 = this.state.benefactorObj2;
        let benefactorObj3 = this.state.benefactorObj3;

        // this.props.openBuyTicketsAside(highlightedDraws[0].get('id'));

        if (this.state.benefactorObj || this.state.benefactorObj2 || this.state.benefactorObj3) {
            this.loadFeaturedDraws();
        }


        let drawFrames;
        if (this.state.featuredDraws == true) {
            switch (highlightedDraws.length) { // When there are 0-2 total draws in the system
            case 0:
                drawFrames = (<div className="section2-landing" />);
                break;

            case 1:
                drawFrames = (
                  <div className="section2-landing">
                    <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[0].get('id'))}><span className="drawTxt-landing">{highlightedDraws.length > 0 && benefactorObj ? <Tooltip title={benefactorObj.get('name')}>{benefactorObj.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[0] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[0])) : null}</span></div>
                  </div>);
                break;

            case 2:
                drawFrames = (<div className="section2-landing">
                  <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[0].get('id'))}><span className="drawTxt-landing">{highlightedDraws.length > 0 && benefactorObj ? <Tooltip title={benefactorObj.get('name')}>{benefactorObj.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[0] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[0])) : null}</span></div>
                  <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[1].get('id'))}><span className="drawTxt-landing">{highlightedDraws.length > 1 && benefactorObj2 ? <Tooltip title={benefactorObj2.get('name')}>{benefactorObj2.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[1] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[1])) : null}</span></div>
                </div>);
                break;

            default:
                drawFrames = (
                  <div className="section2-landing">
                    <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[0].get('id'))}><span className="drawTxt-landing">{highlightedDraws.length > 0 && benefactorObj ? <Tooltip title={benefactorObj.get('name')}>{benefactorObj.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[0] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[0])) : null}</span></div>
                    <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[1].get('id'))}><span className="drawTxt-landing">{highlightedDraws.length > 1 && benefactorObj2 ? <Tooltip title={benefactorObj2.get('name')}>{benefactorObj2.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[1] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[1])) : null}</span></div>
                    <div className="frameImg-landing" onClick={this.openInfoAndShowDetails.bind(this, highlightedDraws[2].get('id'))}><span className="drawTxt-landing" >{highlightedDraws.length > 2 && benefactorObj3 ? <Tooltip title={benefactorObj3.get('name')}>{benefactorObj3.get('name')}</Tooltip> : ''}</span><span className="featuredJackpot-landing">{jackpotAry[2] != null ? Helper.formattedCurrencyConvert(this.getPrecision(jackpotAry[2])) : null}</span></div>
                  </div>);
                break;

            }
        }


        const DetailsModal = (<div className="rodalDialog"><Rodal visible={this.state.detailsVisible} onClose={this.hideDetails} width={1000} height={500} customStyles={detailsRodalStyle} reset={false} >
          <DrawDetails open={this.state.showPostPurchase} showPostPurchase={this.state.showPostPurchase} onClose={this.hideDetails} />
        </Rodal></div>);
        return (
          <div>
            <LandingHeader isLogin={this.props.isLogin} />

            <div className="landing-gutter">
              <div>
                <Fade>
                  <img className="globalImage-landing" src={globalimage} />
                </Fade>
              </div>


              <div className="section-landing">
                <ScrollAnimation animateIn="fadeIn">
                  <h1><span className="silverTxt-landing"><Translate content="landing.donors" /></span> <span className="goldTxt-landing"><Translate content="landing.fundraisers" /></span></h1>
                  <h2 className="subText-landing"> <Translate content="landing.donors-tag" /> </h2>
                </ScrollAnimation>
              </div>


              <ScrollAnimation animateIn="fadeIn">
                <img className="globalImage-landing" src={ticketimage} />
              </ScrollAnimation>

              <ScrollAnimation animateIn="fadeIn">
                <div className="section-landing" >
                  <table className="section-landing-table">
                    <tr>
                      <td className="section-landing-image-left"><img src={arrowright} /></td>
                      <td><h1 className="displayInline-landing"><span className="silverTxt-landing"><Translate content="landing.current" /></span><span className="goldTxt-landing"><Translate content="landing.jackpots" /></span></h1></td>
                      <td className="section-landing-image-right"><img src={arrowleft} /></td>
                    </tr>
                    <tr>

                      <td colSpan="3">
                        <h2 className="subText-landing"><Translate content="landing.support-favourite" /></h2>
                        <h2 className="subText-landing"><Translate content="landing.split-jackpots" /></h2>
                      </td>

                    </tr>
                  </table>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animateIn="fadeIn">

                {drawFrames}
              </ScrollAnimation>

              <ScrollAnimation animateIn="fadeIn">
                <div className="section2-landing">
                  <h2 className="subText-landing"><Translate content="landing.current-total" /> <span className="yellow-landing">{Helper.formattedCurrencyConvert(this.state.jackpotSum)}</span></h2>
                </div>
              </ScrollAnimation>
              {DetailsModal}

              <ScrollAnimation animateIn="fadeIn">
                <div className="section2-landing"><span className="silverTxt-landing"><Translate content="landing.recently-created" /></span><span className="goldTxt-landing"><Translate content="landing.recently-created-draws" /></span></div>
                <CurrencyBar selectCurrency={this.props.selectCurrency} selected={this.props.currency} />
                <div className="borderTop-landing100" /><table className="table table-striped table-landing"><div className="borderTop-landing" />
                  <thead>
                    <tr>
                      <th scope="col">
                        <span className="Col-Header"><Translate content="landing.drawname" /></span>
                      </th>
                      <th scope="col">
                        <span className="Col-Header"><Translate content="landing.tilldraw" /></span>
                      </th>
                      <th className="th">
                        <span className="Col-Header"><Translate content="landing.ticket-price" /></span>
                      </th>
                      <th scope="col">
                        <span className="Col-Header"><Translate content="landing.jackpot-amount" /></span>
                      </th>

                      <th className="th">
                        <span className="Col-Header"><Translate content="landing.purchase" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>

                    {lotteriesIds.take(5).map(lotteryId => {
                    // build data
                        const lottery = lotteriesByHash.get(lotteryId);
                        const assetId = lottery.getIn(['lottery_options', 'ticket_price', 'asset_id']);
                        const asset = assetId ? assetsByHash.get(assetId) : null;
                        let drawName = lottery.get('symbol');
                        if (Helper.IsJsonString(lottery.getIn(['options', 'description']))) {
                            drawName = JSON.parse(lottery.getIn(['options', 'description'])).lottoName;
                        }
                        let drawType = Helper.getDrawType(lottery.getIn(['options', 'description']));
                        const ticketsRemaining = (lottery.getIn(['options', 'max_supply']) - lottery.getIn(['dynamic', 'current_supply']));
                        const endDate = moment.utc(lottery.getIn(['lottery_options', 'end_date'])).local();
                        const endingOnSoldout = lottery.getIn(['lottery_options', 'ending_on_soldout']);
                        const momentObject = moment.utc(lottery.getIn(['lottery_options', 'end_date'])).local();
                        const isDateNull = !(Date.parse(lottery.getIn(['lottery_options', 'end_date'])) + (momentObject.utcOffset() * 60 * 1000));


                        let drawTypeContent;

                        if (!drawType) { // description.drawType not found -> legacy support
                            if (endingOnSoldout && !isDateNull) { //   both
                                drawTypeContent = (<span className="td__cell">
                                  <span className="muted">
                                    <i className="fas fa-ticket-alt" /> {ticketsRemaining} <i className="fas fa-hourglass-half" /> {endDate}
                                  </span>
                                </span>);
                            } else if (endingOnSoldout && isDateNull) {   // ticket
                                drawTypeContent = (
                                  <span><i className="fas fa-ticket-alt" /> {ticketsRemaining}</span>);
                            } else {  //    time
                                drawTypeContent = (
                                  <span className="td__cell">
                                    <span className="">
                                      <i className="fas fa-hourglass-half" /> {endDate}
                                    </span>
                                                &nbsp;
                                  </span>
                                        );
                            }
                        } else {
                            switch (drawType) {
                            case 'Ticket Based':
                                drawType = (<span> <i className="fas fa-ticket-alt" /> {ticketsRemaining} </span>);
                                break;
                            case 'Time Based':
                                drawType = (<span><i className="fas fa-hourglass-half" /> <Countdown dateTo={endDate} /> </span>);
                                break;
                            case 'Ticket & Time Based':
                                drawType = (<span><i className="fas fa-ticket-alt" /> {ticketsRemaining} <i className="fas fa-hourglass-half" /> <Countdown dateTo={endDate} now={moment()} /> </span>);
                                break;
                            }
                            drawTypeContent = (<span className="td__cell"><span className="muted">{drawType}</span></span>);
                        }

                        const ticketPrice =
                    lottery.getIn(['lottery_options', 'ticket_price', 'amount']) &&
                    asset
                      ? new BigNumber(
                          lottery.getIn(['lottery_options', 'ticket_price', 'amount'])
                        )
                          .div(Math.pow(10, this.props.precision))
                          .toFixed(this.props.precision)
                      : 0;

                        const ticketsTotal = lottery.getIn(['options', 'max_supply']);
                        let jackpot = ticketPrice * ticketsTotal * 0.5;

                        if (lottery) {
                            jackpot = ticketPrice * lottery.getIn(['dynamic', 'current_supply']) * 0.5;
                        }

                        return (
                          <tr key={lotteryId} className="tr js-show-aside" onClick={this.openInfo.bind(this, lottery.get('id'))}>
                            <td id="tableCustom" className="td">
                              <span className="td__cell" data-id={lottery.get('id')}>
                                {drawName}
                              </span>
                            </td>

                            <td id="tableCustom" className="td"><span className="td__cell">{drawTypeContent}</span></td>

                            <td id="tableCustom" className="td">
                              {Helper.currencyConvert(ticketPrice)}
                            </td>


                            <td id="tableCustom" className="td"><span className="td__cell">{Helper.currencyConvert(jackpot)}</span></td>
                            <td id="tableCustom" className="td">
                              <button className="drawDetailsBtn" onClick={this.showDetails}><Translate content="landing.get-ticket-btn" /></button>
                            </td>

                          </tr>);


                    })}


                  </tbody>
                </table><div className="borderTop-landing100" />
                <img src={getyourticket} className="width100-landing" />
              </ScrollAnimation>

              <ScrollAnimation animateIn="fadeIn">
                <div className="section3-landing" >
                  <h1 className="displayInline-landing"><span className="silverTxt-landing"><Translate content="landing.recent" /></span><span className="goldTxt-landing"><Translate content="landing.recent-winners" /></span></h1>
                  <h2 className="subText-landing"><Translate content="landing.recent-winners-total" /> <span className="yellow-landing">{Helper.formattedCurrencyConvert(this.state.totalRaised)}</span></h2>
                </div>
              </ScrollAnimation>

              <ScrollAnimation animateIn="fadeIn">
                <CurrencyBar selectCurrency={this.props.selectCurrency} selected={this.props.currency} />
                <RecentWinnersTable
                    data={this.state.lotteryWins}
                />
                <img src={playnow} className="width100-landing" />
              </ScrollAnimation>

            </div>

            <div className="section2-landing">
              <LogInPage button isLogin={this.props.isLogin} openLoginOnNewWindow={this.state.newWindowLogin} />
            </div>
            <div>
              <RenderInBrowser except chrome firefox>
                <Rodal
                    visible={this.state.showBrowserSupportMessage}
                    onClose={this.closeBrowserSupportMessage.bind(this)}
                    closeOnEsc
                    animation="fade"
                    duration={500}
                    customStyles={browserSupportRodalStyle}
                    reset={false}
                >
                  <BrowserSupportModal closeBrowserSupportMessage={this.closeBrowserSupportMessage.bind(this)} />
                </Rodal>
              </RenderInBrowser>
            </div>
          </div>
        );


    }

}

export default Landing;
