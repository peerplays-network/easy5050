import { createModule } from 'redux-modules';
import { Map } from 'immutable';

const initialState = Map({
    id: null,
    showAside: false,
    asset: null,
    lotteryObject: Map({}),
    creator: Map({}),
    benefactorsById: Map({}),
    ticketAmountPurchased: 0,
});

export default createModule({
    name: 'buyTicketsAside',
    initialState,
    transformations: {
        showAside: {
            reducer: (state, {payload}) => {

                let {showAside, id} = payload;
                if(id == null){
                    return state.set('showAside', showAside).set('lotteryObject', null);
                }else{
                    return state.set('showAside', showAside).set('id', id);
                }
                
            }
        },
        updateInfo: {
            reducer: (state, {payload}) => {

                let {lotteryObject, creator, benefactorsById, asset} = payload;

                return state.set('lotteryObject', lotteryObject).set('creator', creator).set('benefactorsById', benefactorsById).set('asset', asset);
            }
        },
        setTicketAmountPurchased: {
            reducer: (state, { payload }) => {
                return state.set('ticketAmountPurchased',payload);
            }
        },
    }
})
