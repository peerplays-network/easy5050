import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

const initialState = Map({
    showModal: false
});

export default createModule({
    name: 'successModal',
    initialState,
    transformations: {
        showModal: {
            reducer: (state, {payload}) => {
                let {showModal} = payload;
                return state.set('showModal', showModal);
            }
        }

    }
})
