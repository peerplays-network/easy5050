import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';
import PropTypes from 'prop-types';

import ModalActions from 'actions/ModalActions';
import Translate from 'react-translate-component';

@connect(
    null,
    dispatch => ({
        hideModal: () => dispatch(ModalActions.hideModal('lotteryCreatingSuccess'))
    })
)

class LotteryCreatingSuccess extends React.Component {

    onCloseModal() {
        this.props.hideModal();
    }

    render() {

        return (<div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal__in">
                            <div className="modal__header">
                                <div className="modal__title">
                                <Translate content="creating_lottery.success" />
                                </div>
                            </div>
                            <div className="modal__footer center">
                                <button 
                                    type="button" 
                                    className="btn btn-gold" 
                                    data-dismiss="modal"
                                    onClick={ this.onCloseModal.bind(this) }
                                ><Translate content="creating_lottery.ok_btn" /></button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

LotteryCreatingSuccess.PropTypes = {
    hideModal: PropTypes.func.isRequired
}

export default LotteryCreatingSuccess;