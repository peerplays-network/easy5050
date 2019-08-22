import { Apis, ChainConfig, ChainStore, PrivateKey, key, Aes, hash, FetchChain, TransactionBuilder } from "peerplaysjs-lib";
import moment from 'moment';

import LotteryRepository from '../repositories/LotteryRepository';

import constants from 'constants/createDraw';

class BuyTicketsService {

    static buyTickets(params, keys) {
//TODO::rm



        return ;

        let { benefactors, winnerPercents, name, price, endDate, tickets, resolution } = LotteryService.formValues(lotteryParams);

        benefactors = benefactors.map(benefactor => ({
            id: benefactor.id,
            share: benefactor.percent * constants.GRAPHENE_1_PERCENT
        }));

        winnerPercents = winnerPercents.filter(percent => percent).map(percent => percent * constants.GRAPHENE_1_PERCENT);

        const isResolutionDate = constants.RADIO_BUTTONS.all_tickets_sold !== resolution;
        const ownerId = state.app.account.get('id');
        const creatingLotteryParams = {
            issuer: ownerId,
            symbol: name,
            precision: 0,
            extensions: [
                1, // serializer/src/types, 666 row, types 0 or 1
                {
                    benefactors,
                    owner: '1.3.0',
                    winning_tickets: winnerPercents, //array
                    ticket_price: {
                        amount: Number(price),
                        asset_id: '1.3.0'
                    },
                    end_date: isResolutionDate ? Number(endDate) : 0, // seconds
                    ending_on_soldout: isResolutionDate,
                    is_active: true
                }
            ],
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
                description: 'desc',
                extensions: []
            },
            is_prediction_market: false
        };

        return LotteryRepository.createNewLottery(creatingLotteryParams, state);
    }

    static formValues(values) {

        values.endDate = Number(moment(values.date || 0).add(values.time.split(':')[0], 'hours').format('X'));

        return Object.entries(values).reduce((newValues, value) => {

            if (~value[0].indexOf('benefactor')) {

                newValues.benefactors[value[0].replace('benefactor', '')] = value[1];

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

export default BuyTicketsService;