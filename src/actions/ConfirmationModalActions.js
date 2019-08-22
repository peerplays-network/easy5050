import ConfirmationModalReducer from "../reducers/ConfirmationModalReducer";
import { ChainStore } from 'peerplaysjs-lib'

class ConfirmationModalActions {

    static showModal(showModal, acceptCallback, cancelCallback) {

        return (dispatch, getState) => {
            dispatch(ConfirmationModalReducer.actions.showModal({showModal: showModal, acceptCallback: acceptCallback, cancelCallback: cancelCallback}));
        }

    }

}


export default ConfirmationModalActions;