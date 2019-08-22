import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const initialState = Map({
    isOpened: false,
    sweepAdvancedInfo: Map({})
});

export default createModule({
    name: 'aside',
    initialState,
    transformations: {
        showAside: {
            reducer: state => state.set('isOpened', true)
        },
        hideAside: {
            reducer: state => state.set('isOpened', false)
        },
        setSweepAdvancedInfo: {
            reducer: (state, { payload }) => state.set('sweepAdvancedInfo', Map(payload))
        }
    }
})
