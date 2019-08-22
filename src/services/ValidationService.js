import BigNumber from 'bignumber.js';
import constants from 'constants/common';
import createConstants from 'constants/createDraw';

import React from 'react';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

counterpart.registerTranslations('en', require('../../assets/locales/locale-en'));
counterpart.registerTranslations('fr', require('../../assets/locales/locale-fr'));
counterpart.registerTranslations('ru', require('../../assets/locales/locale-ru'));
var translate = require('counterpart');


export default class ValidationService {

    static validateLotteryName(string) {

        let isValid = true,
            errorMsg = null;

       switch(true){
            case typeof string !== 'string':
                isValid = false;
                errorMsg = translate('errors.new_draw_only_letters_numbers');
                break;
            case string.length < 1: 
                isValid = false;
                errorMsg = translate('errors.new_name_short');
                break;
            case string.length >40: 
                isValid = false;
                errorMsg = translate('errors.new_name_long');
                break;
            // case !/^[0-9A-Za-z\s]+$/g.test(string) : 
            //     isValid = false;
            //     errorMsg = translate('errors.new_draw_only_letters_numbers');
            //     break;
            // uncomment to disable symbols
        
       }

        return {
            isValid,
            error: errorMsg
        };
    }

    static validateLotteryTicketAmount(number) {

        number = Number(number);
        const isValid = !isNaN(number) && Number.isInteger(number) && number >= constants.MIN_TICKETS_AMOUNT;
        const isValidAmount = number <= constants.MAX_TICKETS_AMOUNT;

        var min_ticket_qty = translate('errors.min_ticket_qty');
        var max_ticket_qty = translate('errors.max_ticket_qty');

        return {
            isValid,
            error: 
                !isValid ? 
                min_ticket_qty :
                !isValidAmount ? 
                    `${max_ticket_qty}` :
                null
        };
    }

    static validateLotteryTicketPrice(number) {

        number = Number(number);
        const isValid = !isNaN(number);
        const isMinimalValid = number >= 1 / `1e${ constants.MINIMAL_PRECISION }`;
        const isMaximalValid = number <= constants.MAX_TICKET_PRICE;

        var price_number = translate('errors.price_number');
        var price_min = translate('errors.price_min');
        var price_max = translate('errors.price_max');

        return {
            isValid,
            error: !isValid ?
            price_number :
                    !isMinimalValid ?
                        `${price_min} ${ new BigNumber(1).dividedBy(`1e${ constants.MINIMAL_PRECISION }`).toNumber() } BTC` :
                    !isMaximalValid ?
                        `${price_max} ${ constants.MAX_TICKET_PRICE }` :
                    null
        };
    }


}