import DashboardReducer from "../reducers/DashboardReducer";
import { ChainStore } from 'peerplaysjs-lib'
import moment from 'moment';
import Helper from '../components/Dashboard/Draws/Helper';

class DashboardActions {

    static fetchLotteries() {

        return (dispatch, getState) => {

            return ChainStore.getAllLotteriesIds().then((lotteriesIds) => {

                let lotteriesByHash = getState().dashboard.get('lotteriesByHash'),
                    assetsByHash = getState().dashboard.get('assetsByHash'),
                    //dateFilter = getState().dashboard.get('dateFilter'),
                    dateFilterStart,
                    dateFilterEnd,
                    textFilter,
                    creatorsByHash = getState().dashboard.get('creatorsByHash'),
                    prevLotteriesIds = getState().dashboard.get('lotteriesIds'),
                    activeDraws = getState().dashboard.get('activeDraws'),
                    filters = getState().dashboard.get('filters');

                if(filters){
                    textFilter = filters && 
                    filters.findIndex(filter => { return filter.key === 'textFilter'}) != -1 
                    ? 
                    filters.get(filters.findIndex(filter => { return filter.key === 'textFilter'})).val 
                    : undefined;
            
                    dateFilterStart = filters && 
                    filters.findIndex(filter => { return filter.key === 'dateRange'}) != -1 
                    ? 
                    filters.get(filters.findIndex(filter => { return filter.key === 'dateRange'})).val.start_date
                    : undefined;

                    dateFilterEnd = filters && 
                    filters.findIndex(filter => { return filter.key === 'dateRange'}) != -1 
                    ? 
                    filters.get(filters.findIndex(filter => { return filter.key === 'dateRange'})).val.end_date
                    : undefined;
                }


                lotteriesIds.forEach((lotteryId) => {

                    let lotteryObject = ChainStore.getObject(lotteryId);

                    let assetId = lotteryObject.getIn(['lottery_options', 'ticket_price', 'asset_id']);

                    if (assetId) {

                        let assetObject = ChainStore.getObject(assetId);

                        if (assetsByHash.get(assetId) !== assetObject) {
                            assetsByHash = assetsByHash.set(assetId, assetObject);
                        }

                    }

                    if (lotteriesByHash.get(lotteryId) !== lotteryObject) {
                        lotteriesByHash = lotteriesByHash.set(lotteryId, lotteryObject);
                    }

                    let issuerId = lotteryObject.get('issuer'),
                        issuerObject = ChainStore.getObject(issuerId);

                    if (creatorsByHash.get(issuerId) !== issuerObject) {
                        creatorsByHash = creatorsByHash.set(issuerId, issuerObject);
                    }

                });

                dateFilterStart = dateFilterStart ? dateFilterStart : new Date(0).toISOString();

                lotteriesIds = lotteriesIds.filter(id => {

                    let lotteryObject = lotteriesByHash.get(id);
                    let issuerObject = ChainStore.getObject(lotteryObject.get('issuer'));

                    if (!lotteryObject) {
                        return false;
                    }

                    
                        if (!lotteryObject.getIn(['lottery_options', 'is_active'])) {
                            return false;
                        }
                    
                    

                    let advancedFilters = true;
                    if (dateFilterEnd) {
                        advancedFilters = advancedFilters && 
                            (
                                moment.utc(lotteryObject.getIn(['lottery_options', 'end_date'])).local().isBefore(dateFilterEnd+" 23:59:59")
                                && moment(lotteryObject.getIn(['lottery_options', 'end_date'])).isAfter(dateFilterStart)
                            );
                    }

                    if(textFilter) {
                         if (Helper.IsJsonString(lotteryObject.getIn(["options", "description"]))) {
                             advancedFilters = advancedFilters && (
                                 JSON.parse(lotteryObject.getIn(["options", "description"])).lottoName.toUpperCase().includes(textFilter.toUpperCase()) 
                                 || (JSON.parse(lotteryObject.getIn(["options", "description"])).description && JSON.parse(lotteryObject.getIn(["options", "description"])).description.toUpperCase().includes(textFilter.toUpperCase()))
                                 || (issuerObject.get('name') && issuerObject.get('name').toUpperCase().includes(textFilter.toUpperCase()))
                                );
                        } else {
                         advancedFilters = advancedFilters && lotteryObject.get('symbol').toUpperCase().includes(textFilter.toUpperCase());
                        }

                    }
                    //JSON.parse(lottery.getIn(["options", "description"])).lottoName.toUpperCase().includes(f.val.toUpperCase())

                    return advancedFilters;

                });

                if (prevLotteriesIds.equals(lotteriesIds)) {
                    lotteriesIds = prevLotteriesIds;
                }

                return dispatch(DashboardReducer.actions.setLotteries({lotteriesIds, lotteriesByHash, creatorsByHash, assetsByHash}))

            });

        }

    }

    /**
     *
     * @param {String} sortField
     * @return {function(*)}
     */
    static sortBy(sortField) {

        return (dispatch, getState) => {

            let sortDirection = getState().dashboard.get('sortDirection'),
                nextSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';

            return dispatch(DashboardReducer.actions.setSort({sortDirection: nextSortDirection, sortField}));
        }

    }

    /**
     *
     * @param {Number} page
     * @return {function(*)}
     */
    static setPage(page) {
        return (dispatch) => {
            dispatch(DashboardReducer.actions.setPage({page}));
        };
    }

    /**
     *
     * @param {String} dateFilterEnd
     * @return {function(*)}
     */
    static setDateFilterEnd(dateFilterEnd) {
        return (dispatch) => {
            dispatch(DashboardActions.setPage(1));
            dispatch(DashboardReducer.actions.setDateFilterEnd({dateFilterEnd}));
            dispatch(DashboardActions.fetchLotteries());
        };
    }

    /**
     *
     * @param {String} setFilters
     * @return {function(*)}
     */
    static setFilters(filters) {
        return (dispatch) => {
            dispatch(DashboardActions.setPage(1));
            dispatch(DashboardReducer.actions.setFilters(filters));
            dispatch(DashboardActions.fetchLotteries());
        };
    }


    /**
     *
     * @param {String} dateFilterStart
     * @return {function(*)}
     */
    static setDateFilterStart(dateFilterStart) {
        return (dispatch) => {
            dispatch(DashboardActions.setPage(1));
            dispatch(DashboardReducer.actions.setDateFilterStart({dateFilterStart}));
            dispatch(DashboardActions.fetchLotteries());
        };
    }

    /**
     *
     * @param {String} textFilter
     * @return {function(*)}
     */
    static setTextFilter(textFilter) {
        return (dispatch) => {
            dispatch(DashboardActions.setPage(1));
            dispatch(DashboardReducer.actions.setTextFilter({textFilter}));
            dispatch(DashboardActions.fetchLotteries());
        };
    }


    static setActiveDraws(activeDraws) {
        return (dispatch) => {
            dispatch(DashboardActions.setPage(1));
            dispatch(DashboardReducer.actions.setActiveDraws({activeDraws}));
            dispatch(DashboardActions.fetchLotteries());
        };
    }


}

export default DashboardActions;