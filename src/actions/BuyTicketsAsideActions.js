import BuyTicketsAsideReducer from "../reducers/BuyTicketsAsideReducer";
import BuyTicketsService from "../services/BuyTicketsService";
import LotteryRepository from "../repositories/LotteryRepository";
//import { Notifications } from "../components/Dashboard/Dashboard/Notifications";
import { ChainStore } from 'peerplaysjs-lib'

class BuyTicketsAsideActions {
    /**
     *
     * @param {String} id
     * @return {function(*)}
     */
    static openAside(id) {
        return (dispatch) => {
            console.log('open aside');
            dispatch(BuyTicketsAsideReducer.actions.showAside({showAside: true, id: id}));
            return dispatch(BuyTicketsAsideActions.updateInfo());
        };
    }


    /**
     *
     * @return {function(*)}
     */
    static closeAside() {
        return (dispatch) => {
            console.log('closing aside');
            dispatch(BuyTicketsAsideReducer.actions.showAside({showAside: false, id: null}))
            return dispatch(BuyTicketsAsideActions.updateInfo());
        };
    }

    static updateInfo() {
        return (dispatch, getState) => {

            let state = getState(),
                id = state.buyTicketsAside.get('id'),
                asset = state.buyTicketsAside.asset,
                benefactorsById = state.buyTicketsAside.get('benefactorsById');

            if (!id) {
                return null;
            }

            let lotteryObject = ChainStore.getObject(id);

            if (!lotteryObject) {
                return null;
            }

            if (lotteryObject.getIn(['lottery_options', 'benefactors']).size) {
                lotteryObject.getIn(['lottery_options', 'benefactors']).forEach((benefactor) => {
                    let benefactorObj = ChainStore.getObject(benefactor.get('id'));
                    if (benefactorsById.get(benefactor.get('id')) !== benefactorObj) {
                        benefactorsById = benefactorsById.set(benefactor.get('id'), benefactorObj);
                    }
                });
            }

            let creator = ChainStore.getObject(lotteryObject.get('issuer'));

            let assetId = lotteryObject.getIn(['lottery_options', 'ticket_price', 'asset_id']);

            if (assetId) {

                let newAsset = ChainStore.getObject(assetId);

                if (asset !== newAsset) {
                    asset = newAsset;
                }

            }

            return dispatch(BuyTicketsAsideReducer.actions.updateInfo({lotteryObject, creator, benefactorsById, asset}))
        };
    }

    static buyTickets(lotteryId, quantity, amount) {
        debugger;
        return (dispatch, getState) => {
            let state = getState(),
                operationParams = {
                    lottery: lotteryId,
                    buyer: state.app.account.get('id'),
                    tickets_to_buy: quantity,
                    amount: {
                        amount: amount,
                        asset_id: '1.3.0'
                    },
                    extensions: null
                };

            return LotteryRepository.buyLotteryTickets(operationParams, state.app.keys);

        }
    }

    static setTicketAmountPurchased(amount) {
        return dispatch => dispatch(BuyTicketsAsideReducer.actions.setTicketAmountPurchased(amount));
    }

}

export default BuyTicketsAsideActions;