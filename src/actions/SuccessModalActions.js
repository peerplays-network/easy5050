import SuccessModalReducer from "../reducers/SuccessModalReducer";

class SuccessModalActions {

    static showModal(showModal) {

        return (dispatch, getState) => {
            dispatch(SuccessModalReducer.actions.showModal({showModal: showModal}));
        }

    }

}


export default SuccessModalActions;