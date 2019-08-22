import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import Rodal from 'rodal';
import ModalActions from 'actions/ModalActions';
import Translate from 'react-translate-component';
import success from '../../../assets/images/success-transparent2.png';
import { NotificationManager } from 'react-notifications';
import DashboardActions from 'actions/DashboardActions';
import copy from 'copy-to-clipboard';

@connect(
    state => ({
        lotteriesIds: state.dashboard.get('lotteriesIds'),
    }),
    dispatch => ({
        hideModal: () => dispatch(ModalActions.hideModal('lotteryCreatingConfirmation')),
        fetchLotteries: cb => dispatch(DashboardActions.fetchLotteries(cb)),
    })
)

class LotteryCreatingConfirmation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: true,
        };
    }

    componentWillMount() {
        this.props.fetchLotteries();
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
        const { lotteriesIds } = this.props;

        const drawId = lotteriesIds !== undefined || lotteriesIds !==null  ? lotteriesIds.get(0) : null;

         const createDrawStyle = {
            height: 'auto',
            background: 'rgba(0, 0, 0, 0.5)',
            width: "100%",
        };

        return (
            <div className="rodalDialog">
                <Rodal
                        animation="fade"
                        duration="500"
                        customStyles={createDrawStyle}
                        visible={this.state.visible}
                        onClose={this.onCloseModal.bind(this)}
                        closeMaskOnClick={true}
                    >
                    <div className="text-center verticalCenter"> 
                        <img
                            src={success}
                            alt="croupier"
                            className="w-20 mb-3"
                        />
                        <h3 className="text-golden text-uppercase text-bold text-center">
                        Your Draw Has Been Created
                        </h3>
                        <div>
                         <button
                            className={"btn-forward m-4"}
                            onClick={this.onCloseModal.bind(this)}>Close</button>
                        <button className={"btn-forward m-4"} onClick={this.copyDrawUrl(drawId)}><Translate content="draw_details.share" /> <i className="fas fa-link" /></button>    
                        </div>
                            <br />&nbsp;<br />
                    </div>
                </Rodal>
            </div>
        )
    }
}

LotteryCreatingConfirmation.PropTypes = {
    hideModal: PropTypes.func.isRequired,
}

export default LotteryCreatingConfirmation;