import ModalReducer from "../reducers/ModalReducer";

export default class ModalActions {
    static showModal(modalName) {
        return dispatch => dispatch(ModalReducer.actions.showModal(modalName))
    }

    static hideModal(modalName) {
        return dispatch => dispatch(ModalReducer.actions.hideModal(modalName))
    }

    static hideAll() {
        return dispatch => dispatch(ModalReducer.actions.hideAll())
    }
}