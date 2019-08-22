import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import tableConstants from '../constants/tables';

const COUNT_ROWS_ON_PAGE = tableConstants.LIMIT;

const initialState = Map({
    page: 1,
    previousPage: 1,
    countRowsOnPage: COUNT_ROWS_ON_PAGE,
    userLotteries: List([]),
    previousUserLotteries: List([]),
    userTickets: List([]),
    previousUserTickets: List([]),
    userLotteriesBlocksTime: List([]),
    userTicketsBlocksTime: List([]),
    userTicketsAmountPurchased: List([]),
    userLotteriesSymbol: List([]),
    previousLotteriesTextFilter:'',
    previousTicketsTextFilter:'',
    activeDraws: true,
    userLotteriesTableParams: Map({
        direction: 'desc',
        field: 'end_date',
        path: ['blockTime']
        //filters: List([{'key':'textFilter','val': 'net'},{'key':'dateRange', 'val':{'start_date':'01-02-18', 'end_date':'04-05-19'}}])
    }),
    filters: List(),
    filtersTickets: List(),
    
    filteredCount: 0,
    previousCount: 0
});

export default createModule({
    name: 'sweeps',
    initialState,
    transformations: {
        setUserLotteries: {
            reducer: (state, { payload }) => state.set('userLotteries', List(payload))
        },
        setPreviousUserLotteries: {
            reducer: (state, { payload }) => state.set('previousUserLotteries', List(payload))
        },
        setUserTickets: {
            reducer: (state, { payload }) => state.set('userTickets', List(payload))
        },
        setPreviousUserTickets: {
            reducer: (state, { payload }) => state.set('previousUserTickets', List(payload))
        },
        setUserLotteriesBlocksTime: {
            reducer: (state, { payload }) => state.set('userLotteriesBlocksTime', List(payload))
        },
        setUserTicketsBlocksTime: {
            reducer: (state, { payload }) => state.set('userTicketsBlocksTime', List(payload))
        },
        setUserTicketsAmountPurchased: {
            reducer: (state, { payload }) => state.set('userTicketsAmountPurchased', List(payload))
        },
        setPreviousLotteriesTextFilter: {
            reducer: (state, { payload }) => {
                return state.set('previousLotteriesTextFilter',payload);
            }
        },
        setPreviousTicketsTextFilter: {
            reducer: (state, { payload }) => {
                return state.set('previousTicketsTextFilter',payload);
            }
        },
        sortUserLotteries: {
            reducer: (state, {
                payload: {
                    field = state.getIn(['userLotteriesTableParams', 'field']),
                    direction = state.getIn(['userLotteriesTableParams', 'direction']),
                    path = state.getIn(['userLotteriesTableParams', 'path']),
                    filters = state.getIn(['userLotteriesTableParams', 'filters'])
                }
            }) => state.set('userLotteriesTableParams', Map({
                field,
                direction,
                path,
                filters
            }))
        },
        filterUserLotteries: {
            reducer: (state, {payload}) => {
                
                return state.set('filters',payload);
            }
        },

        filterUserTickets: {
            reducer: (state, {payload}) => {
                
                return state.set('filtersTickets',payload);
            }
        },
        setPage: {
            reducer: (state, {payload}) => {
                let {page} = payload;
                return state.set('page', page);
            }  
        },
        setPreviousPage: {
            reducer: (state, {payload}) => {
                let {page} = payload;
                return state.set('previousPage', page);
            }  
        },
        setActiveDraws: {
            reducer: (state, {payload}) => {
                let {activeDraws} = payload;
                return state.set('activeDraws', activeDraws);
            }
        },
        setFilteredCount: {
            reducer: (state, {payload}) => {
               
                return state.set('filteredCount', payload);
            }
        },

        setPreviousCount: {
            reducer: (state, {payload}) => {
               
                return state.set('previousCount', payload);
            }
        }
    }
})
