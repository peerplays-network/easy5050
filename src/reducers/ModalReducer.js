import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const initialState = Map({
    lotteryCreatingConfirmation: false,
    lotteryCreatingSuccess: false,
    ticketCreatingSuccess: false,
    browserSupport: false,
    signOut: false,
    error: ''
});

export default createModule({
    name: 'modal',
    initialState,
    transformations: {
        showModal : {
            reducer: (state, { payload }) => initialState.set(payload, true)
        },
        hideModal: {
            reducer: (state, { payload }) => state.set(payload, false)
        },
        showErrorModal: {
            reducer: (state, { payload }) => state.set('error', err)
        },
        hideErrorModal: {
            reducer: (state) => state.merge(initialState)
        },
        hideAll : {
            reducer: state => state.merge(initialState)
        },
    }
})
