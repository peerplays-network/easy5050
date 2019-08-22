import React from 'react'
import { connect } from 'react-redux';
import SuccessModalActions from 'actions/SuccessModalActions';

@connect(
    null,
    dispatch => ({
        showModal: (showModal) => dispatch(SuccessModalActions.showModal(showModal))
    })
)

class SuccessModal extends React.Component {

    onCloseModal() {
        this.props.showModal(false);
    }

    onHideModal(e) {
        if (e.target === e.currentTarget) {
            this.onCloseModal();
        }
    }

    render() {

        //TODO::title

        return (
            <div>
                <div className="modal fade in">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal__in">
                                <div className="modal__header">
                                    <div className="modal__title">
                                        Tickets was bought successfully
                                    </div>
                                </div>
                                <div className="modal__footer center">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        data-dismiss="modal"
                                        onClick={ this.onCloseModal.bind(this) }
                                    >OK</button>
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

export default SuccessModal;