import { createModule } from 'redux-modules';
import { Map, List } from 'immutable';
import tableConstants from '../constants/tables';

const COUNT_ROWS_ON_PAGE = tableConstants.LIMIT;

const initialState = Map({
    page: 1,
    countRowsOnPage: COUNT_ROWS_ON_PAGE,
    sortField: 'id',
    sortDirection: 'desc',
    creatorsByHash: Map({}),
    lotteriesByHash: Map({}),
    assetsByHash: Map({}),
    lotteriesIds: List([]),
    filters: List()
});

export default createModule({
    name: 'dashboard',
    initialState,
    transformations: {
        setLotteries: {
            reducer: (state, {payload}) => {

                let {lotteriesIds, lotteriesByHash, creatorsByHash, assetsByHash} = payload;

                return state.set('lotteriesIds', lotteriesIds)
                            .set('lotteriesByHash', lotteriesByHash)
                            .set('assetsByHash', assetsByHash)
                            .set('creatorsByHash', creatorsByHash);
            }
        },
        setSort: {
            reducer: (state, {payload}) => {

                let {sortField, sortDirection} = payload;

                return state.set('sortField', sortField)
                            .set('sortDirection', sortDirection);
            }
        },
        setPage: {
            reducer: (state, {payload}) => {
                let {page} = payload;
                return state.set('page', page);
            }
        },
        setDateFilterEnd: {
            reducer: (state, {payload}) => {
                let {dateFilterEnd} = payload;
                return state.set('dateFilterEnd', dateFilterEnd);
            }
        },
        setDateFilterStart: {
            reducer: (state, {payload}) => {
                let {dateFilterStart} = payload;
                return state.set('dateFilterStart', dateFilterStart);
            }
        },
        setTextFilter: {
            reducer: (state, {payload}) => {
                let {textFilter} = payload;
                return state.set('textFilter', textFilter);
            }
        },
        setActiveDraws: {
            reducer: (state, {payload}) => {
                let {activeDraws} = payload;
                return state.set('activeDraws', activeDraws);
            }
        },
        setFilters: {
            reducer: (state, {payload}) => {
                
                return state.set('filters',payload);
            }
        },

    }
})
