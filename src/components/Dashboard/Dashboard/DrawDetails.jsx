import React from 'react';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Tooltip } from 'react-tippy';
import RenderInBrowser from 'react-render-in-browser';
import Marquee from 'react-marquee';
import '../../../../assets/scss/drawdetails.scss';
import BuyTicketsAsideActions from 'actions/BuyTicketsAsideActions';
import Helper from '../Draws/Helper';
import LogInPage from '../../Auth/LogInPage';
import ModalActions from '../../../actions/ModalActions';
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-minimal.css';

import ConfirmationModalActions from '../../../actions/ConfirmationModalActions';
import SuccessModalActions from '../../../actions/SuccessModalActions';
import Countdown from '../../utilities/Countdown';
import arrowleft from '../../../../assets/images/landing/arrowLeft-small.png';
import arrowright from '../../../../assets/images/landing/arrowRight-small.png';
const translate = require('counterpart');

import StorageService from '../../../services/StorageService';
import { isNull } from 'util';


@connect(
  state => ({
      lotteriesByHash: state.dashboard.get('lotteriesByHash'),
      showAside: state.buyTicketsAside.get('showAside'),
      lotteryObject: state.buyTicketsAside.get('lotteryObject'),
      asset: state.buyTicketsAside.get('asset'),
      benefactorsById: state.buyTicketsAside.get('benefactorsById'),
      creatorsByHash: state.dashboard.get('creatorsByHash'),
      isLogin: state.app.isLogin,
      precision: state.app.coreAsset.get('precision')

  }),
  dispatch => ({
      closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
      updateInfo: () => dispatch(BuyTicketsAsideActions.updateInfo()),
      openTicketSuccessConfirmationModal: () =>
      dispatch(ModalActions.showModal('ticketCreatingSuccess')),
      showModal: (showModal, acceptCallback, cancelCallback) =>
      dispatch(
        ConfirmationModalActions.showModal(
          showModal,
          acceptCallback,
          cancelCallback
        )
      ),
      showSuccessModal: showModal =>
      dispatch(SuccessModalActions.showModal(showModal)),
      buyTickets: (lotteryId, quantity, amount) =>
      dispatch(BuyTicketsAsideActions.buyTickets(lotteryId, quantity, amount)),
      ticketsPurchased: (amount) => dispatch(BuyTicketsAsideActions.setTicketAmountPurchased(amount))
  })
)

class DrawDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          quantity: '',
          error: '',
          inProcess: false,
          termsAccepted: 0, // 0 => init, 1 => accepted terms
          showPostPurchase: false,
        };
        this.changeQuantity = this.changeQuantity.bind(this);
        this.openQuantityOrBuyTickets = this.openQuantityOrBuyTickets.bind(this);

    }

    componentWillReceiveProps(nextProps) {
      this.setState({showPostPurchase: false});

      (this.props.open === false ? this.resetToDefaultState() : null);
    }

    openQuantityOrBuyTickets() {

            if (!this.state.quantity) {
    
                this.setState({
                    error: counterpart.translate('errors.field_is_required')
                });
    
            } else if ((this.props.lotteryObject.getIn(['options', 'max_supply']) - this.props.lotteryObject.getIn(['dynamic', 'current_supply'])) < this.state.quantity) {
                this.setState({
                    error: counterpart.translate('errors.trying_to_buy_X_tickets_only_Y_left', {quantity: this.state.quantity, tickets_left: this.props.lotteryObject.getIn(['options', 'max_supply']) - this.props.lotteryObject.getIn(['dynamic', 'current_supply'])})
                });
                console.log(this.state.error);
            } else {
                this.setState({
                    inProcess: true
                }, () => {
                    this.props.ticketsPurchased(this.state.quantity);
                    this.props.buyTickets(this.props.lotteryObject.get('id'), this.state.quantity, this.state.quantity * this.props.lotteryObject.getIn(['lottery_options', 'ticket_price', 'amount'])).then(() => {
                        this.resetToDefaultState();
                          // this.props.showSuccessModal(true);
                        console.warn('Purchase SUCCESS');
    
                        this.setState({
                            showPostPurchase: true
                        });

                        this.props.onClose();
                        this.props.openTicketSuccessConfirmationModal();
    
                    }).catch(err => {
                        console.log('[ERROR]', err);
    
                        let errStr = err.toString().substring(0, 150);
    
                        if (/lottery_options.is_active/.test(errStr)) {
                            errStr = counterpart.translate('errors.max_supply');
                        } else if (/current_supply < lottery->options.max_supply/.test(errStr)) {
                            errStr = counterpart.translate('errors.tickets_left_for_sale');
                        } else if (/Insufficient Balance/.test(errStr)) {
                            const amount = new BigNumber(this.state.quantity * this.props.lotteryObject.getIn(['lottery_options', 'ticket_price', 'amount'])).div(Math.pow(10, this.props.precision));
                            errStr = counterpart.translate('errors.dont_have_enough_funds', {amount, symbol: StorageService.get('currency') === 'BTC'|| StorageService.get('currency') === 'PPY' ? '' : StorageService.get('currency')}); // replace 'BTC' -> symbol
                        } else if (/tickets_to_buy/.test(errStr)) {
    
                            errStr = counterpart.translate(
                                  'errors.trying_to_buy_X_tickets_only_Y_left',
                                {
                                    quantity: this.state.quantity,
                                    tickets_left: this.props.lotteryObject.getIn(['options', 'max_supply']) - this.props.lotteryObject.getIn(['dynamic', 'current_supply'])}
                              );
                        }
    
                        this.setState({
                            error: errStr,
                            inProcess: false
                        });
    
                    });
    
                });
    
            }
      // }
    
        }
    changeQuantity(e) {
      const value = e.target.value;
      let isValid = /^\d+$/.test(value);

      const lotteryObject = this.props.lotteryObject;
      const ticketsSold = lotteryObject.getIn(['dynamic', 'sweeps_tickets_sold'])
      ? lotteryObject.getIn(['dynamic', 'sweeps_tickets_sold'])
      : lotteryObject.getIn(['dynamic', 'current_supply']);
      const maxSupply = lotteryObject.getIn(['options', 'max_supply']);

      if (isValid && value != '') {
          isValid = value <= (maxSupply - ticketsSold);
          isValid = isValid && value > 0;
      }

      if (isValid || value === '') {
          this.setState({
              quantity: value,
              error: '',
              inProcess: false,
              showPostPurchase: false
          });
      }
  }

  addMantissaZeros(num) {
    let zeros = -Math.floor( Math.log(num) / Math.log(10) + 1);
    if(zeros < 8 && zeros > 0) {
      return "0".repeat(zeros)
    }
  }

  resetToDefaultState() {

    this.setState({
        quantity: '',
        error: '',
        inProcess: false,
        showPostPurchase: false
    });
}

  normalizeTicketField = (value, previousValue) => {
    if (!value) {
        return value;
    }
    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 3) {
        return onlyNums;
    }
    return onlyNums;
}

getLastDigit = (num)=>{
  if(num) {
    return (num.toString().slice(-1) === "0");
  }

  return false;
};

  displayPriceFeature = (number, mantissa, jackpot, units) => {
    let usdJackpot = jackpot.toFixed(2);

    return (<span className="pricefeature-dd" >
              <Odometer value={number} duration={ 3000 } format="d"/>
              {usdJackpot !== 0 ? <React.Fragment>
                <span className="" style={{verticalAlign: "middle"}}>.</span>
                <span>{this.addMantissaZeros(usdJackpot)}</span>
                <Odometer value={mantissa} duration={ 3000 } format="d"/>
                {this.getLastDigit(usdJackpot) ? <span>0</span> : null}
              </React.Fragment> : null}
              <span style={{color: "#edcb61",marginLeft: "10px","verticalAlign": "-2px"}}>{units}</span>
            </span>
          );
  }

    render() {
        let buyTicketsContent = ( <span>
            <input
                ref={input => { this.quantityInput = input; }}
                type="text"
                className="quantbox-dd"
                value={this.state.quantity}
                //normalize={this.normalizeTicketField} // used incorrectly and throws an error
                onChange={this.changeQuantity}
                placeholder="Quantity"
            />

            <button className="drawDetailsBtn2" onClick={this.openQuantityOrBuyTickets}>{this.state.inProcess ? 'Processing...' : <Translate content="draw_details.purchase_btn" />}</button>
            {this.state.error && <p className="error__hint m-2">{this.state.error}</p>}
        </span> );
      // We need to get all of our important data to populate the details page

        // Draw Name, Description, Type
        let drawName = 'Not Found',
            drawDesc = '',
            drawType,
            blankDrawTypeStr,
            endingOnSoldout,
            ticketsRemaining,
            ticketsSold,
            endDate,
            ticketsPrice,
            ticketsPriceStr,
            benefactorObj,
            bName,
            drawTypeContent,
            totalTickets,
            creatorName,
            jackpot;


      // The lottery object -- all the data we display will be an offset of this data :)
        const { lotteryObject, benefactorsById, creatorsByHash } = this.props;

        if(lotteryObject != null){
            // Creator, we only have an ID so we need to look it up in Redux
            const creator = lotteryObject.get('issuer');
            
            if (creatorsByHash.has(creator)) {
                creatorName = creatorsByHash.get(creator).get('name');
            }

            // Ticket Price
            ticketsPrice =
            lotteryObject.getIn(['lottery_options', 'ticket_price', 'amount']);
            
            ticketsPrice = Number(ticketsPrice/(Math.pow(10, this.props.precision)).toFixed(2))

            if (lotteryObject.getIn(['options', 'description'])) { // Check for null first, because that will crash the app
                drawName = lotteryObject.getIn(['options', 'description']) == 'desc' || !Helper.IsJsonString(lotteryObject.getIn(['options', 'description'])) || lotteryObject.getIn(['options', 'description']) == '' ? drawName = lotteryObject.get('symbol') : drawName = JSON.parse(lotteryObject.getIn(['options', 'description'])).lottoName;
                drawType = Helper.getDrawType(lotteryObject.getIn(['options', 'description']));
                endingOnSoldout = lotteryObject.getIn(['lottery_options', 'ending_on_soldout']);
                ticketsSold = lotteryObject.getIn(['dynamic', 'sweeps_tickets_sold'])
                ? lotteryObject.getIn(['dynamic', 'sweeps_tickets_sold'])
                : lotteryObject.getIn(['dynamic', 'current_supply']);
                ticketsRemaining = lotteryObject.getIn(['options', 'max_supply']) - ticketsSold;
                totalTickets = lotteryObject.getIn(['options', 'max_supply']);
                endDate = moment.utc(lotteryObject.getIn(['lottery_options', 'end_date'])).local();


                if (lotteryObject.getIn(['options', 'description']) !== '' && Helper.IsJsonString(lotteryObject.getIn(['options', 'description']))) {
                    drawDesc = JSON.parse(lotteryObject.getIn(['options', 'description'])).description;
                    
                    // if the draw description is blank, this populates the default draw description to be displayed on the draw details page.
                    if (!drawDesc){
                        switch (drawType) {
                            case 'Ticket Based':   
                                blankDrawTypeStr = ticketsRemaining > 0 ? counterpart.translate("draw_details.default_description_ticket", {ticketRem: ticketsRemaining}) : '';
                                break;
                            case 'Time Based':
                                blankDrawTypeStr = counterpart.translate("draw_details.default_description_time", {timeRem:Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: '2-digit'}).format(endDate)});
                                break;
                            case 'Ticket & Time Based':
                                blankDrawTypeStr = counterpart.translate("draw_details.default_description_ticket-time", {ticketRem: ticketsRemaining > 0 ? ticketsRemaining : '', timeRem:Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long', day: '2-digit'}).format(endDate)});
                                break;
                            }

                        drawDesc = counterpart.translate("draw_details.default_description", {price: ticketsPrice, benefactor: bName, drawTypeStr: blankDrawTypeStr});
                    }
  
                }

                
                
            }
            jackpot = totalTickets * ticketsPrice * 0.5;

            if (lotteryObject) {
               jackpot = ticketsPrice * lotteryObject.getIn(['dynamic', 'current_supply']) * 0.5;
            }

            // Benefactor
            lotteryObject.getIn(['lottery_options', 'benefactors']) &&
            lotteryObject
            .getIn(['lottery_options', 'benefactors'])
            .map(benefactor => {
                benefactorObj = benefactorsById.get(benefactor.get('id'));
            })

            if (benefactorObj) {
            bName = benefactorObj.get('name');
            }

            //Draw Type Logic
            if (endDate) {
            switch (drawType) {
                case 'Ticket Based':
                    drawType = (<div><span className="colorYellow ticketRoller"> <i className="fas fa-ticket-alt" /> <span className='ticketAmount'><Odometer value={ticketsRemaining} duration={3000} format="d"/></span> <Translate content="dashboard.tickets-remaining" /></span></div>);
                    break;//<RenderInBrowser firefox only><span className="colorYellow"> <i className="fas fa-ticket-alt" /> <span>{ticketsRemaining}</span>  Tickets Remaining</span></RenderInBrowser>
                case 'Time Based':
                    drawType = (<span className="colorYellow ticketRoller"><i className="fas fa-ticket-alt" /> {ticketsRemaining} <i className="fas fa-hourglass-half" /> <Countdown dateTo={endDate} now={moment()} shortHand /> </span>);
                    break;
                case 'Ticket & Time Based':
                    drawType = (<span className="colorYellow ticketRoller"><i className="fas fa-ticket-alt" /> {ticketsRemaining} <i className="fas fa-hourglass-half" /> <Countdown dateTo={endDate} now={moment()} shortHand /> </span>);
                    break;
                }
                drawTypeContent = (<span className="td__cell"><span className="muted">{drawType}</span></span>);
            }
            
// disable the purchase of inactive draw
            let drawEnd = false;
            if (!lotteryObject.getIn(['lottery_options', 'is_active'])) {
                drawTypeContent = (<span className="td__cell"><span className="muted"><Translate content="dashboard.draw-ended" /></span></span>)
                buyTicketsContent = null;
                drawEnd = true;
            }

            if (ticketsRemaining == 0) {
                buyTicketsContent = <p><Translate content="dashboard.no-more-tickets" /></p>;
                drawEnd = true;
            }



        }else{
            drawName = 'Not Found',
            drawDesc = '',
           
                //drawDesc = counterpart.translate("draw_details.default_description");
               // drawDesc = "111";
           
            ticketsRemaining = 0;
            ticketsSold = 0;
            drawType = '';
            blankDrawTypeStr = '';
            ticketsPrice =0;
            ticketsPrice = '';
            bName = '';
            drawTypeContent = '';
            creatorName = '';
        }

        if(isNaN(jackpot)) {
          jackpot = 0
        }
        
        jackpot = Helper.convertWithoutUnits(jackpot);

        let number = (!!jackpot.toString().split('.')[0]) ? jackpot.toString().split('.')[0] : "0"
        let mantissa = (!!jackpot.toString().split('.')[1]) ? jackpot.toString().split('.')[1] : "0"

        mantissa = typeof(mantissa) === 'string' ? mantissa.replace(/^0+/, '') : "0"

        if(!this.props.open) {
          number = 9;
          mantissa = 8;
        }

        mantissa = Number(mantissa)
        number = Number(number)
        let units = Helper.getUnits()
        if(JSON.stringify(units) == "{}")
          units = "CAD"

        return (
          <div>
            <div className="frameImg-Detail pull-left">

                <div className="drawTxtRoller-Detail"><Marquee loop={true} trailing={5000} hoverToStop={true} text={bName} /></div>
                {this.displayPriceFeature(number, mantissa, jackpot, units)}
                
                <table className="resolution-Detail-table">
                    <tbody>
                      <tr>
                          <td className="resolution-Detail-tdleft"><img src={arrowright} /></td>
                          <td className="resolution-Detail-tdcenter">{drawTypeContent}</td>
                          <td className="resolution-Detail-tdright"><img src={arrowleft} /></td>
                      </tr>
                    </tbody>
                </table>
                    
                
            </div>

            <div className="headerTxt-dd text_c mt-3"><Marquee loop={true} trailing={5000} hoverToStop={true} text={drawName} /></div>
            <div className="descriptionTxt-dd text_c" id="scrollStyle">{drawDesc}</div>
            <div className="drawStats-dd mt-3">
              <Fade bottom duration={1500}>
                <div className="d-flex align-items-center">
                  <span className="header-verify-dd"><Translate content="dashboard.created-by-lbl" /></span>
                  {creatorName && 
                    <Tooltip
                    title={creatorName}
                    position="right"
                    arrow
                    >
                      <span className="yellow-dd truncated ml-3"> {creatorName}</span>
                    </Tooltip>
                  }
                </div>
              </Fade>
              <Fade bottom duration={2000}>
                <div className="d-flex align-items-center">
                  <span className="header-verify-dd"><Translate content="dashboard.benefactor-lbl" /></span>
                  {bName && 
                    <Tooltip
                    title={bName}
                    position="right"
                    arrow
                    >
                      <span className="yellow-dd truncated ml-3"> {bName}</span>
                    </Tooltip>
                  }
                </div>
              </Fade>
              <Fade bottom duration={2500}>
                <div className="d-flex align-items-center">
                  <span className="header-verify-dd"><Translate content="dashboard.ticket-price-lbl" /></span>
                  <Tooltip
                    title={ticketsPrice}
                    position="right"
                    arrow
                    >
                    <span className="yellow-dd ml-3"> {Helper.currencyConvert(ticketsPrice)} </span>
                  </Tooltip>
                </div>
              </Fade>
            </div>

            <div className="buyTicket-dd">
            <span>
          <div>
            <span>
              {this.props.isLogin ? this.state.showPostPurchase ?
                null :
                buyTicketsContent
                : <div className="section2-landing">
                <LogInPage button="true" />
              </div>
            }

            </span>
          </div>
          {this.state.showPostPurchase ? <Translate component="span" content="purchase_ticket.tickets_bought" className="" /> : null}
        </span>
            
            </div>
          </div>
        );
    }
  }

export default DrawDetails;