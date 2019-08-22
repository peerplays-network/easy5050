import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';
import PropTypes from 'prop-types';

import ModalActions from 'actions/ModalActions';
import LotteryActions from 'actions/LotteryActions';

import LotteryCreatingConfirmation from './LotteryCreatingConfirmationModal';
import LotteryCreatingSuccess from './LotteryCreatingSuccessModal';
import SignOut from './SignOutModal';
import BrowserSupportModal from './BrowserSupportModal';
import TicketCreatingSuccess from './TicketCreatingSuccessModal';

@connect(
    state => ({
        isOpenedSome: state.modal.includes(true),
        lotteryCreatingConfirmation: state.modal.get('lotteryCreatingConfirmation'),
        lotteryCreatingSuccess: state.modal.get('lotteryCreatingSuccess'),
        signOut: state.modal.get('signOut'),
        browserSupport: state.modal.get('browserSupport'),
        ticketCreatingSuccess: state.modal.get('ticketCreatingSuccess')
    }),
    dispatch => ({
        hideAll: () => dispatch(ModalActions.hideAll())
    })
)

class Modals extends React.Component {

    constructor(props) {
        super(props);

        this.body = document.getElementsByTagName('body')[0];
    }

    componentWillReceiveProps(newProps) {

        if (newProps.isOpenedSome && !this.props.isOpenedSome) {
            this.body.classList.add('modal-open');
        }

        if (!newProps.isOpenedSome && this.props.isOpenedSome) {
            this.body.classList.remove('modal-open');
        }
    }

    componentWillUnmount() {
        this.body.classList.remove('modal-open');
    }

    hideAll(e) {
        if (this.props.isOpenedSome && e.target === e.currentTarget) {
            this.props.hideAll();
        }
    }

    render() {

        const { isOpenedSome, lotteryCreatingConfirmation, lotteryCreatingSuccess, signOut, browserSupport, ticketCreatingSuccess } = this.props;

        return ([
            <div 
                key="1" 
                className={ `modal fade ${ isOpenedSome ? 'in' : '' }` } 
                style={{
                    display: isOpenedSome ? 'block' : 'none',
                    paddingRight: '0px'
                }}
            >
                {
                    lotteryCreatingConfirmation ? <LotteryCreatingConfirmation /> : 
                    lotteryCreatingSuccess ? <LotteryCreatingSuccess /> :
                    signOut ? <SignOut /> :
                    browserSupport ? <BrowserSupportModal /> :
                    ticketCreatingSuccess ? <TicketCreatingSuccess/>
                    : null
                }
            </div>,
            isOpenedSome ? <div 
                key="2"
                className={ `modal-backdrop fade ${ isOpenedSome ? 'in' : '' }` }
            ></div> : null
        ])
    }
}

Modals.propTypes = {
    isOpenedSome: PropTypes.bool,
    lotteryCreatingConfirmation: PropTypes.bool,

    hideAll: PropTypes.func
}

export default Modals;