import moment from 'moment';
import BigNumber from 'bignumber.js';

import LotteryRepository from 'repositories/LotteryRepository';

import constants from 'constants/createDraw';

export default class LotteryService {
    static createNewLottery(lotteryParams, state) {

        let { benefactors,benefactorId, winnerPercents, name, price, endDate, tickets, resolution, description} = LotteryService.formValues(lotteryParams);
        const ownerId = state.app.account.get('id');

        //adjust for single benefactor
        let singleBenefactor = [{name: lotteryParams.benefactorname, id: lotteryParams.benefactorid, percent: 50}];
        
        

        // benefactors = benefactors.filter(item => item).map(benefactor => ({
        //     id: benefactor.id,
        //     share: new BigNumber(benefactor.percent).mul(constants.GRAPHENE_1_PERCENT).toNumber()
        // }));
        


        benefactors = singleBenefactor.map(benefactor => ({
            id: benefactor.id,
            share: new BigNumber(benefactor.percent).mul(constants.GRAPHENE_1_PERCENT).toNumber()
        }));

        winnerPercents = winnerPercents
        .filter(item => item)
        .sort((a, b) => b - a)
        .map(percent =>
            new BigNumber(percent)
            .mul(constants.GRAPHENE_1_PERCENT)
            .toNumber()
        );

        winnerPercents.nosort = true;

        return LotteryRepository.createNewLottery({
            issuer: ownerId,
            symbol: name,
            precision: 0,
            extensions:
                {
                    benefactors,
                    owner: '1.3.0',
                    winning_tickets: winnerPercents,
                    ticket_price: {
                        amount: new BigNumber(price),
                        asset_id: '1.3.0'
                    },
                    end_date: Number(endDate), // seconds
                    ending_on_soldout: constants.RADIO_BUTTONS.on_resolution_date !== resolution,
                    is_active: true
                },
            common_options: {
                max_supply: Number(tickets),
                market_fee_percent: 0,
                max_market_fee: 1000000000000000,
                issuer_permissions: 79,
                flags: 0,
                core_exchange_rate: {
                    base: {
                        amount: 1,
                        asset_id: '1.3.0'
                    },
                    quote: {
                        amount: 1,
                        asset_id: '1.3.1'
                    }
                },
                whitelist_authorities: [],
                blacklist_authorities: [],
                whitelist_markets: [],
                blacklist_markets: [],
                description: description,
                extensions: []
            },
            is_prediction_market: false
        }, state);
    }

    static formValues(values) {

        let time = moment(values.time, 'hh:mm A');
        const date = moment(values.date || 0);

        values.endDate = date.add(time.get('hours'), 'hour').add(time.get('minutes'), 'minute').utc().format('X');

        return Object.entries(values).reduce((newValues, value) => {

            if (~value[0].indexOf('benefactor')) {

                newValues.benefactors[value[0].replace('benefactor', '')] = value[1];
                newValues.benefactors['percent']=50;
                return newValues;
            }

            if (~value[0].indexOf('winnerPercent')) {

                newValues.winnerPercents[value[0].replace('winnerPercent', '')] = value[1];

                return newValues;
            }

            newValues[value[0]] = value[1];

            return newValues;
        }, {
            benefactors: [],
            winnerPercents: []
        });
    }
}
