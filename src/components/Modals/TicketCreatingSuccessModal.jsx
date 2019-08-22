import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rodal from 'rodal';
import ModalActions from 'actions/ModalActions';
import LotteryActions from 'actions/LotteryActions';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import success from '../../../assets/images/success-transparent2.png';
import { NotificationManager } from 'react-notifications';
import copy from 'copy-to-clipboard';

@connect(
    state => ({
        lotteryObject: state.buyTicketsAside.get('lotteryObject'),
        ticketsPurchased: state.buyTicketsAside.get('ticketAmountPurchased'),
    }),
    dispatch => ({
        hideModal: () => dispatch(ModalActions.hideModal('ticketCreatingSuccess')),
    })
)
class TicketCreatingSuccess extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.onCloseModal.bind(this))
    }

    componentDidUnmount() {
        document.removeEventListener('click', this.onCloseModal.bind(this))
    }

    onCloseModal() {
        this.setState({visible: !this.state.visible})
        this.props.hideModal();
    }

    copyDrawUrl = id => () => {

        id = parseInt(id.split('.')[2]);
        let url;

  // construct URL
        (window.location.port == 80 || window.location.port == 8080) ? url = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/dashboard/${id}` : url = `${window.location.protocol}//${window.location.hostname}/dashboard/${id}`;

        copy(url);
  // push a notif.
        NotificationManager.success('Copied to clipboard!');

        this.setState({visible: !this.state.visible})
        this.props.hideModal();
    }

    render() {
         const { lotteryObject } = this.props;
         const drawId = lotteryObject !== undefined || lotteryObject !==null  ? lotteryObject.get('id') : null;

         const createDrawStyle = {
            height: 'auto',
            background: 'rgba(0, 0, 0, 0.5)',
            width: "100%",
        };

        var tics = this.props.ticketsPurchased;

        return (
            <div className="rodalDialog">
                <Rodal
                        animation="fade"
                        duration="500"
                        customStyles={createDrawStyle}
                        visible={this.state.visible}
                        onClose={this.onCloseModal.bind(this)}
                        closeOnEsc={true}
                        onClick={this.onCloseModal.bind(this)}
                    >
                    <div className="text-center verticalCenter"> 
                        <img
                            src={success}
                            alt="success"
                            className="w-20 mb-3"
                        />
                        {this.props.ticketsPurchased > 1 
                        ? 
                        <h4 className="text-golden text-uppercase text-bold text-center"> 
                            {counterpart.translate('creating_lottery.success', {tics: tics, plural:'s'})}
                        </h4> 
                        : 
                        <h4 className="text-golden text-uppercase text-bold text-center"> 
                            {counterpart.translate('creating_lottery.success', {tics: tics, plural:''})}
                        </h4> 
                        }
                        <div>
                         <button
                            className={"btn-forward m-4"}
                            onClick={this.onCloseModal.bind(this)}>Close</button>
                        <button className={"btn-forward m-4"} onClick={this.copyDrawUrl(drawId)}><Translate content="draw_details.share" /> <i className="fas fa-link" /></button>    
                            <br />&nbsp;<br />
                        </div>
                    </div>
                </Rodal>
            </div>
        )
    }
}

TicketCreatingSuccess.PropTypes = {
    hideModal: PropTypes.func.isRequired,
}

export default TicketCreatingSuccess;