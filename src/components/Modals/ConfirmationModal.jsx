import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import ConfirmationModalActions from 'actions/ConfirmationModalActions';
import LotteryActions from 'actions/LotteryActions';

@connect(
    state => ({
        acceptCallback: state.confirmationModal.get('acceptCallback')
    }),
    dispatch => ({
        showModal: (show) => dispatch(ConfirmationModalActions.showModal(show))
    })
)
class ConfirmationModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            termsAproove: false
        };
    }

    onSubmitForm() {

        if (this.props.acceptCallback) {
            this.props.acceptCallback();
            this.props.showModal(false, null, null);
        }

    }

    onCloseModal() {
        this.props.showModal(false, null, null);
    }

    onHideModal(e) {
        if (e.target === e.currentTarget) {
            this.onCloseModal();
        }
    }

    onSetTermsApprove(e) {

        this.setState({
            termsAproove: !this.state.termsAproove
        });
    }

    render() {

        const { submitting } = this.props;
        const { termsAproove } = this.state;

        return (
            <div>
                <div className="modal fade in">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal__in">
                                <div className="modal__header">
                                    <div className="modal__title">Are you sure you want to purchase tickets?</div>
                                </div>
                                <div className="modal__body">
                                    <div className="modal__descr">
                                        <label className="checkbox__item align-center">
                                            <input
                                                type="checkbox"
                                                className="checkbox__input"
                                                checked={ termsAproove }
                                                onChange={ this.onSetTermsApprove.bind(this) }
                                            />
                                            <span className="checkbox__indicator"></span>
                                            <span className="checkbox__text">
                                        <span>I accept the</span>
                                            &nbsp;
                                            <NavLink
                                                to="/terms/purchase"
                                                target="_blank"
                                                className="mark"
                                            >terms and conditions
                                            </NavLink>
                                    </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="modal__footer no-bd">
                                    <button
                                        type="button"
                                        className="btn btn-gray"
                                        data-dismiss="modal"
                                        onClick={ this.onCloseModal.bind(this) }
                                    >Cancel</button>
                                    <button
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        disabled={ submitting || !termsAproove }
                                        onClick={ this.onSubmitForm.bind(this) }
                                    >Accept</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade in"></div>
            </div>

        )
    }
}

ConfirmationModal.PropTypes = {
    submitting: PropTypes.bool,

    hideModal: PropTypes.func.isRequired,
    createNewLottery: PropTypes.func.isRequired
}

export default ConfirmationModal;