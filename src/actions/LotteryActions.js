import { SubmissionError } from 'redux-form';
import { reset, unregisterField, stopSubmit, change } from 'redux-form';
import { fromJS } from 'immutable';
import ModalReducer from 'reducers/ModalReducer';
import SweepsReducer from 'reducers/SweepsReducer';

import LotteryService from 'services/LotteryService';
import ChainService from 'services/ChainService';
import { Apis, ChainStore } from 'peerplaysjs-lib';

import LotteryRepository from 'repositories/LotteryRepository';
import AccountChainRepository from 'repositories/AccountChainRepository';

class LotteryActions {

    static createNewLottery(lotteryParams) {
        return (dispatch, getState) => new Promise((resolve, reject) => {
            const state = getState();
            const registeredFields = Object.entries(state.form.drawApplicationForm.registeredFields).filter(field => (~field[0].indexOf('benefactor') || ~field[0].indexOf('winnerPercent')) && !~field[0].indexOf('0'));

            LotteryService.createNewLottery(lotteryParams, state)
            .then(() => {
                dispatch(reset('drawApplicationForm'));

                registeredFields.forEach(field => {
                    dispatch(unregisterField('drawApplicationForm', field[0]));
                    dispatch(unregisterField('drawApplicationForm', field[0]));
                });
                dispatch(change('drawApplicationForm', 'date', null));
                dispatch(ModalReducer.actions.showModal('lotteryCreatingConfirmation'));
                resolve();
            })
            .catch(err => {
                dispatch(stopSubmit('drawApplicationForm', { _error: JSON.stringify(err) }));
                throw new SubmissionError({ _error: JSON.stringify(err) });
            });

        });
    }

    static sortUserLotteries(field, direction, path) {
        return dispatch => dispatch(SweepsReducer.actions.sortUserLotteries({ field, direction, path }));
    }

    static filterUserLotteries(filters) {
        return dispatch => {
            dispatch(LotteryActions.setPage(1));
            dispatch(SweepsReducer.actions.filterUserLotteries(filters));
        };
    }

    static filterUserTickets(filters) {
        return dispatch => {
            dispatch(LotteryActions.setPage(1));
            dispatch(SweepsReducer.actions.filterUserTickets(filters));
        };
    }

    static filterPreviousUserLotteries(text) {
        return dispatch => {
            dispatch(LotteryActions.setPreviousPage(1));
            dispatch(SweepsReducer.actions.setPreviousLotteriesTextFilter(text));
        };
    }
    static filterPreviousUserTickets(text) {
        return dispatch => {
            dispatch(LotteryActions.setPreviousPage(1));
            dispatch(SweepsReducer.actions.setPreviousTicketsTextFilter(text));
        };
    }
    static setFilteredCount(filteredCount) {
        return dispatch => dispatch(SweepsReducer.actions.setFilteredCount(filteredCount));
    }

    static setPreviousCount(previousCount) {
        return dispatch => dispatch(SweepsReducer.actions.setPreviousCount(previousCount));
    }

    static setPage(page) {
        return dispatch => {
            dispatch(SweepsReducer.actions.setPage({page}));
        };
    }

    static setPreviousPage(page) {
        return dispatch => {
            dispatch(SweepsReducer.actions.setPreviousPage({page}));
        };
    }

    static setActiveDraws(activeDraws) {
        return dispatch => {
            dispatch(LotteryActions.setPage(1));
            dispatch(LotteryActions.setPreviousPage(1));
            dispatch(SweepsReducer.actions.setActiveDraws({activeDraws}));
        };
    }

    static setUserLotteries(dispatch, getState) {
        const state = getState();
        const accountId = state.app.account.get('id');
        const oldLotteries = state.sweeps.get('userLotteries').toJS();
        const accountHistory = state.accountHistory.get('accountHistory').size;
        let newTickets = state.accountHistory.get('accountHistory');
        let previousLotteries;
        let newLotteries;

        LotteryRepository.getUserLotteries(accountId)
         .then(lotteries => {

             if (fromJS(lotteries).equals(fromJS(oldLotteries))) {
                 return Promise.reject();
             }

             newLotteries = lotteries;
             previousLotteries = newLotteries.filter(lottery => !lottery.lottery_options.is_active);

             return lotteries;
         })
         .catch(() => Promise.reject())
         .then(() => accountHistory.size ? accountHistory : AccountChainRepository.getAccountHistory(accountId))
         .then(accountHistory => {
             newTickets = accountHistory.toJS().filter(lottery => lottery.op[0] === 78);
             return Promise.all(previousLotteries.map(lottery => {

                 //   console.warn(previousLotteries);

                 const historyItem = accountHistory.toJS().find(historyItem => historyItem.result[1] === lottery.id);
                 const blockNumber = historyItem ? historyItem.block_num : null;

                 return ChainService.getDateOfBlock(blockNumber);
             }));
         })
         .then(blocksTimeArray => {
             const prevBlocksTimeArray = [];


             Apis.instance().history_api().exec('get_account_history', ['1.2.0', '1.11.0', 100, '1.11.0']).then(operations => {
                 operations = operations.filter(r => r.op[0] == 80);

                 LotteryActions.getHistoryRecursively(null, null).then(operations => {
                     operations.map(r => {
                         previousLotteries.filter(p => {
                             if (p.id == r.op[1].lottery) {
                                 ChainService.getDateOfBlock(r.block_num).then(data => {
                                    data.tid = p.id;
                                    prevBlocksTimeArray.push(data);
                                });
                                 return false;
                             }
                         });
                     });
                 }).then(() => { // previous
                     dispatch(SweepsReducer.actions.setUserLotteriesBlocksTime(prevBlocksTimeArray));
                     dispatch(SweepsReducer.actions.setPreviousUserLotteries(previousLotteries));

                 });

                 window.blocksTime = prevBlocksTimeArray;

             }); // end then
             dispatch(SweepsReducer.actions.setUserLotteries(newLotteries));
             dispatch(SweepsReducer.actions.sortUserLotteries({}));
             // dispatch(SweepsReducer.actions.setUserTickets(newTickets));
         }).then(null, () => {});
    }


    static getHistoryRecursively(totalD, recent) { // history, for dates
        let historyWinObjects = [];
        let total = totalD;
        let most_recent = recent;

        if (!total) {
            total = [];
        }
        if (!recent) {
            most_recent = '1.11.0';
        }
        let end = false;
        return new Promise((resolve, reject) => {
            getHistoryFromBlockChain(total, most_recent);
            function getHistoryFromBlockChain(totalD, recent) {
                Apis.instance().history_api().exec('get_account_history', ['1.2.0', '1.11.0', 100, most_recent]).then(operations => {
                    operations = operations.filter(r => r.op[0] == 80);


                    if (operations.length <= 1) {
                        total.concat(operations);
                        historyWinObjects = total;
                        end = true;
                    } else {
                        most_recent = operations[operations.length - 1].id;
                        total = total.concat(operations);
                        operations.pop();
                        getHistoryFromBlockChain(total, most_recent);
                    }


                    if (end) {
                        return resolve(historyWinObjects);
                    }
                });


            }
        });
    }


    static getWinnersRecursively(totalD, recent) { // winner names
        let historyWinObjects = [];
        let total = totalD;
        let most_recent = recent;

        if (!total) {
            total = [];
        }
        if (!recent) {
            most_recent = '1.11.0';
        }
        let end = false;
        return new Promise((resolve, reject) => {
            getHistoryFromBlockChain(total, most_recent);
            function getHistoryFromBlockChain(totalD, recent) {
                Apis.instance().history_api().exec('get_account_history', ['1.2.0', '1.11.0', 100, most_recent]).then(operations => {
                    operations = operations.filter(r => {
                        if (r.op[0] == 79 && r.op[1].is_benefactor_reward == false) {
                            return r;
                        }
                    });


                    if (operations.length <= 1) {
                        total.concat(operations);
                        historyWinObjects = total;
                        end = true;
                    } else {
                        most_recent = operations[operations.length - 1].id;
                        total = total.concat(operations);
                        // operations.pop();
                        getHistoryFromBlockChain(total, most_recent);
                    }


                    if (end) {
                        resolve(historyWinObjects);
                    }
                });


            }
        }).then(async r => {
            const map1 = r.map(data => Apis.instance().db_api().exec('get_full_accounts', [[data.op[1].winner], true]).then(results => {
                const winnerObj = {name: results[0][1].account.name, amount: data.op[1].amount.amount, lotteryId: data.op[1].lottery, blockNum: data.block_num, winner: data.op[1].winner};
                return winnerObj;
            }));

            const finalData = await Promise.all(map1);
            return finalData;

        });

    }


    static setUserTickets(dispatch, getState) {
        const state = getState();
        const accountId = state.app.account.get('id');
        // const oldTickets = state.sweeps.get('userTickets').toJS();
        const accountHistory = state.accountHistory.get('accountHistory').size;

        const newTickets = [];
        const previousTickets = [];
        let ticketPurchasedAmount = [];
        accountHistory.size ? accountHistory : AccountChainRepository.getAccountHistory(accountId)
        .then(accountHistory => {


            const tickets = accountHistory.toJS().map(lottery => {
                let obj;
                if (lottery.op[0] === 78) {
                    obj = ChainStore.getObject(lottery.op[1].lottery).toJSON();

                    if(obj !== undefined) {
                        let ticket = {ticketsPurchased: lottery.op[1].tickets_to_buy, id: lottery.op[1].lottery}

                        {ticketPurchasedAmount.find(el => el.id == ticket.id) ? 
                           ticketPurchasedAmount[ticketPurchasedAmount.indexOf(ticketPurchasedAmount.find(el => el.id == ticket.id))] = {ticketsPurchased: ticketPurchasedAmount.find(el => el.id == ticket.id).ticketsPurchased + lottery.op[1].tickets_to_buy, id: lottery.op[1].lottery}//ticketPurchasedAmount[ticketPurchasedAmount.find(el => el.id == ticket.id)] = {ticketsPurchased: (lottery.op[1].tickets_to_buy + ticketPurchasedAmount.find(el => el.id == ticket.id).ticketsPurchased), id: lottery.op[1].lottery}
                                : ticketPurchasedAmount.push(ticket)}
                        
                    }
                    if (obj !== undefined && obj.lottery_options.is_active === true) {
                                // console.warn(newTickets.includes(obj));
                        { newTickets.find(el => el.id == obj.id) ? null : newTickets.push(obj); }
                                // console.warn(newTickets);
                    }
                    if (obj !== undefined && obj.lottery_options.is_active === false)
                                // console.warn(2)
                                // previousTickets.includes(obj) ? null : previousTickets.push(obj)
                                { previousTickets.find(el => el.id == obj.id) ? null : previousTickets.push(obj); }
                }

            });

            return Promise.all([...newTickets, ...previousTickets].map(lottery => {
                const historyItem = accountHistory.toJS().find(historyItem => historyItem.op[1].lottery === lottery.id);
                const blockNumber = historyItem ? historyItem.block_num : null;
                    // console.warn('block num: ',blockNumber);
                return ChainService.getDateOfBlock(blockNumber);
            }));

        })
            .then(blocksTimeArray => {
                dispatch(SweepsReducer.actions.setUserTicketsBlocksTime(blocksTimeArray));
                dispatch(SweepsReducer.actions.setUserTickets(newTickets));
                dispatch(SweepsReducer.actions.setPreviousUserTickets(previousTickets));
                dispatch(SweepsReducer.actions.setUserTicketsAmountPurchased(ticketPurchasedAmount))
            }).then(null, () => {});
    }

    static subscribeUserLotteries() {
        return (dispatch, getState) => {
            window._userLottoSub = LotteryActions.setUserLotteries.bind(this, dispatch, getState);
            LotteryActions.setUserLotteries(dispatch, getState);
            // LotteryActions.setUserTickets(dispatch, getState);
            LotteryRepository.subscribeUserLotteries(window._userLottoSub);
        };
    }

    static unsubscribeUserLotteries() {
        return (dispatch, getState) => {
            LotteryRepository.unsubscribeUserLotteries(
                window._userLottoSub
            );
            window._userLottoSub = undefined;
        };
    }

    static subscribeUserTickets() {
        return (dispatch, getState) => {
            window._userTicketSub = LotteryActions.setUserTickets.bind(this, dispatch, getState);
            LotteryActions.setUserTickets(dispatch, getState);
            LotteryRepository.subscribeUserTickets(window._userTicketSub);
        };
    }


    static unsubscribeUserTickets() {
        return (dispatch, getState) => {
            LotteryRepository.unsubscribeUserTickets(
                window._userTicketSub
            );
            window._userTicketSub = undefined;
        };
    }
}

export default LotteryActions;
