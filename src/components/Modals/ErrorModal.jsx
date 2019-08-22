import React from 'react'
import { connect } from 'react-redux';
import { reset, SubmissionError, submit } from 'redux-form';

import ModalActions from 'actions/ModalActions';
import LotteryActions from 'actions/LotteryActions';

@connect(
    state => ({
        error: state.modal.get('error')
    }),
    dispatch => ({
        hideErrorModal: () => dispatch(ModalActions.hideErrorModal())
    })
)

class ErrorModal extends React.Component {

    onCloseModal() {
        this.props.hideErrorModal();
    }

    render() {

        return ( this.props.error ?
            <div className="modal fade in" id="modalCreate" style={{
                display: 'block',
                paddingRight: '0px'
            }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal__in">
                            <div className="modal__header">
                                <div className="modal__title">
                                    { this.props.error }
                                </div>
                            </div>
                            <div className="modal__footer">
                                <button 
                                    type="button" 
                                    className="btn btn-gray" 
                                    data-dismiss="modal"
                                    onClick={ this.onCloseModal.bind(this) }
                                >OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : null
        )
    }
}

export default ErrorModal;