import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';

import ChainService from 'services/ChainService';
import moment from 'moment';

const initialState = Map({
    accountHistory: List([]),
    accountHistoryTableParams: Map({
        direction: 'desc',
        field: 'blockTime',
        page: 1,
        dateFilter: 0,
        filteredArrayLength: 0,
        path: ['blockTime'],
        filteredHistoryLength: 0,
        
    }),
    filters: List(),
    accountHistoryBlocksTime: List([]),
    accountHistoryLotterySymbols: List([]),
    accountHistoryLotteryPrices: List([])
});

export default createModule({
    name: 'accountHistory',
    initialState,
    transformations: {

        setTextFilter: {
            reducer: (state, {payload}) => {
                let {Filter} = payload;
                return state.set('textFilter', textFilter);
            }
        },
        setAccountHistory: {
            reducer: (state, { payload }) => state = state.set('accountHistory', payload)
        },
        setAccountHistoryBlocksTime: {
            reducer: (state, { payload }) => state.set('accountHistoryBlocksTime', List(payload))
        },
        sortAccountHistory: {
            reducer: (state, {
                payload: {
                    field = state.getIn(['accountHistoryTableParams', 'field']),
                    direction = state.getIn(['accountHistoryTableParams', 'direction']),
                    path = state.getIn(['accountHistoryTableParams', 'path'])
                }
            }) => state.set('accountHistoryTableParams', state.get('accountHistoryTableParams').merge({
                field,
                direction,
                path,
                // page: initialState.getIn(['accountHistoryTableParams', 'page'])
            }))
        },
        setFilteredHistoryLength: {
            reducer: (state, { payload }) => state.setIn(['accountHistoryTableParams', 'filteredHistoryLength'], payload)
        },
        setLotterySymbols: {
            reducer: (state, { payload }) => state.set('accountHistoryLotterySymbols', List(payload))
        },
        setLotteryPrices: {
            reducer: (state, { payload }) => state.set('accountHistoryLotteryPrices', List(payload))
        },
        setPage: {
            reducer: (state, { payload }) => state.setIn(['accountHistoryTableParams', 'page'], payload)
        },

        setPreviousPage: {
            reducer: (state, { payload }) => state.setIn(['accountHistoryTableParams', 'previousPage'], payload)
        },
        setFilters: {
            reducer: (state, {payload}) => {
                return state.set('filters',payload);
            }
        },

        filterByDate: {
            reducer: (state, { payload }) => {

                state = state.set(
                    'accountHistoryTableParams',
                    initialState.get('accountHistoryTableParams').merge(
                        {
                            dateFilter: new Date(payload).getTime(),
                            filteredArrayLength: state
                                .get('accountHistoryBlocksTime')
                                .filter(tx => {

                                    return moment(tx.blockTime).format('DD.MM.YYYY') === moment(payload).format('DD.MM.YYYY');
                                }).size
                        }
                    )
                );


                return state;
            }
        }
    }
});

