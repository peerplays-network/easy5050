import moment from 'moment';
import BigNumber from 'bignumber.js';

import ValidationService from 'services/ValidationService';
import LotteryService from 'services/LotteryService';
import React from 'react';
import constants from 'constants/createDraw';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';

var translate = require('counterpart');

export default (values, requiredFields, errors) => {

    const currentDate = moment();
    requiredFields.forEach(field => {
        if (field === "benefactorid"){
            if (!values[field] && values["benefactorname"]) {
                errors[field] = translate("errors.user_not_found");
            }
        }
        else if (!values[field]) {
            errors[field] = translate("errors.field_is_required");
        }
    });

    errors.description = errors.description || ValidationService.validateLotteryName(values.description).error;
    errors.tickets = errors.tickets || ValidationService.validateLotteryTicketAmount(values.tickets).error;
    errors.price = errors.price || ValidationService.validateLotteryTicketPrice(values.price).error;

    // if(values.nameunique === undefined){
    //     errors.name = errors.name || "Name is not unique";
    // }

    values = LotteryService.formValues(values);

    values.benefactors.forEach((benefactor, index) => {

        errors[`benefactor${ index }`] = {};

        if (!benefactor.id) {
            errors[`benefactor${ index }`].name = errors[`benefactor${ index }`].name || translate("errors.user_not_found");
            //errors[`benefactor${ index }`].name = errors[`benefactor${ index }`].name || <Translate content="errors.field_is_required" />;
        }

       
    });

    if(values.drawDescription && values.drawDescription.length > 300){
        errors.drawDescription = translate("errors.description_length");
    }

    if (values.time && values.date) {
        if (moment(moment(values.date).format('YYYY/MM/DD') + " " + values.time).diff(currentDate.startOf('day'), 'months') > 6) {
            
            errors.date = translate("errors.must_conclude_6mon");
        }

        else if (moment(moment(values.date).format('YYYY/MM/DD') + " " + values.time).diff(currentDate, 'months') === 6 && moment(moment(values.date).format('YYYY/MM/DD') + " " + values.time).diff(currentDate.add(6, 'months'), 'days') > 0 ) {
            errors.date = translate("errors.must_conclude_6mon");
        }

        else if (moment(moment(values.date).format('YYYY/MM/DD') + " " + values.time).diff(moment(), 'minutes') <= 0 ) {
            errors.date =  translate("errors.must_after_now");
        }

         else if (!moment(moment(values.date).format('YYYY/MM/DD'))._isValid) {
             errors.date = translate("errors.must_after_now");
         }

        if(!errors.date) {
            errors.time = moment(moment(values.date).format('YYYY/MM/DD') + " " + values.time).diff(moment(), 'minutes') <= 0 ? translate("errors.must_after_now") : null;
        }
    }

    //errors.commonFormError = percentSum && percentSum !== 100 ? 'Sum of all percents should be equal 100' : null;
};
