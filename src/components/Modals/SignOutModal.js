import React from 'react'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import AppActions from 'actions/AppActions';
import ModalActions from 'actions/ModalActions';
import Translate from 'react-translate-component';

@connect(
    null,
    dispatch => ({
        logout: () => dispatch(AppActions.logout()),
        logoutAndReload: () => dispatch(AppActions.logoutAndReload()),
        hideAll: () => dispatch(ModalActions.hideAll())
    })
)
class SignOut extends React.Component {

    signOut() {
        this.props.logoutAndReload();
    }

    cancel() {
        this.props.hideAll();
    }

    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal__in">
                        <div className="modal__header">
                            <div className="text-golden text-center"><Translate content="auth.signout_msg" /></div>
                        </div>
                        <div className="modal__footer">
                            <button className="btn-back" onClick={this.cancel.bind(this)}><Translate content="auth.no_btn" /></button>
                            &nbsp;&nbsp;&nbsp;
                            <button className="btn-forward" onClick={this.signOut.bind(this)}><Translate content="auth.yes_btn" /></button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

SignOut.PropTypes = {
    logout: PropTypes.func.isRequired,
    hideAll: PropTypes.func.isRequired
}

export default SignOut;