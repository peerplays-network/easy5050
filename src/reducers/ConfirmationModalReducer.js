import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const initialState = Map({
    showModal: false,
    acceptCallback: null,
    cancelCallback: null,
});

export default createModule({
    name: 'confirmationModal',
    initialState,
    transformations: {
        showModal: {
            reducer: (state, {payload}) => {
                let {showModal, acceptCallback, cancelCallback} = payload;
                return state.set('showModal', showModal).set('acceptCallback', acceptCallback).set('cancelCallback', cancelCallback);
            }
        }

    }
})
