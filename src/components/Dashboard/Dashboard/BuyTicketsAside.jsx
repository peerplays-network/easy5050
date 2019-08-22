import React from "react";
import { connect } from 'react-redux';
import BuyTicketsAsideActions from '../../../actions/BuyTicketsAsideActions';
import ConfirmationModalActions from '../../../actions/ConfirmationModalActions';
import SuccessModalActions from '../../../actions/SuccessModalActions';
import { ChainStore } from 'peerplaysjs-lib';
import moment from 'moment';
import classNames from 'classnames';
import counterpart from 'counterpart';
import BigNumber from 'bignumber.js';

@connect(
    state => ({
        showAside: state.buyTicketsAside.get('showAside'),
        lotteryObject: state.buyTicketsAside.get('lotteryObject'),
        creator: state.buyTicketsAside.get('creator'),
        asset: state.buyTicketsAside.get('asset'),
        benefactorsById: state.buyTicketsAside.get('benefactorsById')
    }),
    dispatch => ({
        closeBuyTicketsAside: () => dispatch(BuyTicketsAsideActions.closeAside()),
        updateInfo: () => dispatch(BuyTicketsAsideActions.updateInfo()),
        showModal: (showModal, acceptCallback, cancelCallback) => dispatch(ConfirmationModalActions.showModal(showModal, acceptCallback, cancelCallback)),
        showSuccessModal: (showModal) => dispatch(SuccessModalActions.showModal(showModal)),
        buyTickets: (lotteryId, quantity, amount) => dispatch(BuyTicketsAsideActions.buyTickets(lotteryId, quantity, amount))
    })
)
class BuyTicketsAside extends React.Component {

    constructor(props) {
        super(props);
        this.subscribe = this.subscribe.bind(this);
        this.state = {
            quantityIsOpen: false,
            quantity: '',
            error: '',
            inProcess: false
        };
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        ChainStore.subscribe(this.subscribe);
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    subscribe() {
        this.props.updateInfo();
    }

    componentWillUnmount() {
        ChainStore.unsubscribe(this.subscribe);
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    resetToDefaultState() {
        this.setState({
            quantityIsOpen: false,
            quantity: '',
            error: '',
            inProcess: false
        });
    }

    closeAside(e) {
        e.preventDefault();
        this.props.closeBuyTicketsAside();
    }

    handleClickOutside(event) {
        //console.log(event);
        //console.log(event.target);
        //console.log(this.backdropRef);
        //console.log(this.state);
        //console.log(this.props);
        // left in to prevent a possible bug from previous code but
        // the proper background event.target seems to be a div (div class="rodal-mask" to be exact) and not the current ref
        if (event.target === this.backdropRef) {
            this.props.closeBuyTicketsAside();
        }
    }

    openQuantityOrBuyTickets() {
        if (!this.state.quantityIsOpen) {

            this.setState({
                quantityIsOpen: true
            }, () => {
                this.quantityInput.focus();
            });

        } else {

            if (!this.state.quantity) {

                this.setState({
                    error: counterpart.translate('errors.field_is_required')
                });

            } else if ((this.props.lotteryObject.getIn(['options', 'max_supply']) - this.props.lotteryObject.getIn(['dynamic', 'current_supply'])) < this.state.quantity) {

                this.setState({
                    error: counterpart.translate('errors.trying_to_buy_X_tickets_only_Y_left', {quantity: this.state.quantity, tickets_left: this.props.lotteryObject.getIn(['options', 'max_supply']) - this.props.lotteryObject.getIn(['dynamic', 'current_supply'])})
                });

            } else {

                this.props.showModal(true, () => {

                    this.setState({
                        inProcess: true
                    }, () => {

                        this.props.buyTickets(this.props.lotteryObject.get('id'), this.state.quantity, this.state.quantity * this.props.lotteryObject.getIn(['lottery_options', 'ticket_price', 'amount'])).then(() => {
                            this.resetToDefaultState();
                            this.props.showSuccessModal(true);
                        }).catch((err) => {
                            console.log('[ERROR]', err);

                            let  errStr = err.toString().substring(0, 150);

                            if (/lottery_options.is_active/.test(errStr)) {
                                errStr = counterpart.translate('errors.max_supply');
                            } else if (/current_supply < lottery->options.max_supply/.test(errStr)) {
                                errStr = counterpart.translate('errors.tickets_left_for_sale');
                            } else if(/Insufficient Balance/.test(errStr)) {
                                let amount = new BigNumber(this.state.quantity * this.props.lotteryObject.getIn(['lottery_options', 'ticket_price', 'amount'])).div(Math.pow(10, this.props.asset.get('precision'))).toFixed(this.props.asset.get('precision'))
                                errStr = counterpart.translate('errors.dont_have_enough_funds', {amount: amount, symbol: this.props.asset.get('symbol')}); // replace BTC -> this.props.asset.get('symbol')
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

                });


            }
        }

    }

    changeQuantity(e) {

        let value = e.target.value,
            isValid = /^\d+$/.test(value);

        if (isValid || value === '') {
            this.setState({
                quantity: value,
                error: ''
            });
        }
    }

    render() {

        let {lotteryObject, creator, benefactorsById, asset} = this.props;

        if (!lotteryObject) {
            return null;
        }

        let momentObject = moment.utc(lotteryObject.getIn(['lottery_options', 'end_date'])).local(),
            hideBuyTickets = !lotteryObject.getIn(['lottery_options', 'is_active']) || (lotteryObject.getIn(['dynamic', 'current_supply']) === lotteryObject.getIn(['options', 'max_supply'])),
            endingOnSoldout = lotteryObject.getIn(['lottery_options', 'ending_on_soldout']);

        const isDateNull = !(Date.parse(lotteryObject.getIn(['lottery_options', 'end_date'])) + (momentObject.utcOffset() * 60 * 1000));

        return (
            <span></span>
        )
    }
}

export default BuyTicketsAside;