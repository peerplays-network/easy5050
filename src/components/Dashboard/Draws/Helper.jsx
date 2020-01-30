import counterpart from 'counterpart';
import StorageService from '../../../services/StorageService';
import constants from '../../../constants/exchangeRates';
import FetchService from '../../../services/FetchService';
import React from 'react'

class Helper {

    static currencyConvert(val) { // returns a string
        const convertTo = StorageService.get('currency');
        let rates = {usd: constants.USD, cad: constants.CAD};

        if (StorageService.get('rates').cad && StorageService.get('rates').usd) {
            rates = {usd: StorageService.get('rates').usd, cad: StorageService.get('rates').cad};
        }

        let valToDisplay = val;
            valToDisplay = `$${ this.roundDollars(valToDisplay * rates.usd)} USD`;
        // console.warn(`valtoDisplay: ${valToDisplay}`);
        return valToDisplay;

    }

    static convertWithoutUnits(val) { // returns a number

        const convertTo = StorageService.get('currency') || 'BTC';
        let rates = {usd: constants.USD, cad: constants.CAD};

        if (StorageService.get('rates').cad && StorageService.get('rates').usd) {
            rates = {usd: StorageService.get('rates').usd, cad: StorageService.get('rates').cad};
        }

        let valToDisplay = val;
            valToDisplay = this.roundPPY(valToDisplay*constants.PPY);

        return valToDisplay;
    }

    static formattedCurrencyConvert(val) { // returns formatted JSX (for featured draws)

        const convertTo = StorageService.get('currency') || 'BTC';
        let rates = {usd: constants.USD, cad: constants.CAD};

        if (StorageService.get('rates').cad && StorageService.get('rates').usd) {
            rates = {usd: StorageService.get('rates').usd, cad: StorageService.get('rates').cad};
        }

        let valToDisplay = val;
            valToDisplay = (<span>{this.roundDollars(valToDisplay * rates.usd)}<span className="yellow-landing"> USD</span></span>);
        // console.warn(`valtoDisplay: ${valToDisplay}`);
        return valToDisplay;

    }

    static getUnits() {

        const convertTo = 'USD';
        return convertTo;
    }

    static roundDollars(num) {
        return (Math.round(num * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
    }

    static roundBTC(num) {
        if(num.toString().length > 10)
            return parseFloat( (Math.round(num * Math.pow(10, 8)) / Math.pow(10, 8)).toFixed(10) );
        else
            return num
    }

    static roundPPY(num) {
        if(num.toString().length > 10)
            return parseFloat( (Math.round(num * Math.pow(10, 8)) / Math.pow(10, 8)).toFixed(10) );
        else
            return num
    }

    static randomizeLottoName() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < 16; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

        return text;
    }

    static replaceLotteryTypes(name) {
        name = name.toString();
        if (name.indexOf('lottery_end') > -1) {
            return 'end_of_lottery' + name.split('lottery_end').join("")
        } else if(name.indexOf('lottery_new') > -1) {
            return 'new_draw' + name.split('lottery_new').join("")
        } else if(name.indexOf('lottery_reward') > -1) {
            return 'lottery_winnings' + name.split('lottery_reward').join("")
        } else {
            return name
        }
    }

    static IsJsonString(str) {
        if (str.length <= 15) {
            return false;
        }

        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    static getDrawType(str) { // get draw type from JSON description value

        if (this.IsJsonString(str)) {
            const drawTypeId = JSON.parse(str).drawType; // we should check if drawType exists too.
            let drawType = '';
            switch (drawTypeId) {
            case 0:
            case '0':
                drawType = counterpart.translate('creating_lottery.all_tickets_sold');
                break;

            case 1:
            case '1':
                drawType = counterpart.translate('creating_lottery.on_resolution_date');
                break;

            case 2:
            case '2':
                drawType = counterpart.translate('creating_lottery.either_one');
                break;

            default:
                drawType = counterpart.translate('creating_lottery.all_tickets_sold');
                break;
            }
            return drawType;
        }
        return counterpart.translate('creating_lottery.all_tickets_sold');

    }

    static universalTableSort = (lotteriesByHash, path, direction) => (a, b) => {
        
        let pathA = path;
        let pathB = path;

        let lottoFromHashA = lotteriesByHash.get(a.id);
        let lottoFromHashB = lotteriesByHash.get(b.id);

        if (path[1] == 'description') { 

            // let lottoFromHashA = lotteriesByHash.get(a.id);
            // let lottoFromHashB = lotteriesByHash.get(b.id);

            a = lottoFromHashA && lottoFromHashA.getIn(['options', 'description']) !== undefined ? lottoFromHashA.getIn(['options', 'description']) : '';
            b = lottoFromHashB && lottoFromHashB.getIn(['options', 'description']) !== undefined ? lottoFromHashB.getIn(['options', 'description']) : '';

            if (Helper.IsJsonString(a) && Helper.IsJsonString(b)) {
                a = JSON.parse(a).lottoName.toUpperCase();
                b = JSON.parse(b).lottoName.toUpperCase();
            }

            let r = a.localeCompare(b, undefined, {numeric: true, sensitivity: 'base'});

            if (direction === 'asc') {
                return r;
            } else if (direction === 'desc') {
                return (r * -1);
            } else {
                return 0;
            }

        }

        else if (path[1] == 'jackpot_amount') {
            let lottoFromHash = lotteriesByHash.get(a.id);
            
            a =
              lottoFromHash &&
              lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
                ? lottoFromHash.getIn([
                  'lottery_options',
                  'ticket_price',
                  'amount'
                ]) * lottoFromHash.getIn(['dynamic', 'sweeps_tickets_sold'])
                : '';
            lottoFromHash = lotteriesByHash.get(b.id);
            b =
              lottoFromHash &&
              lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
                ? lottoFromHash.getIn([
                  'lottery_options',
                  'ticket_price',
                  'amount'
                ]) * lottoFromHash.getIn(['dynamic', 'sweeps_tickets_sold'])
                : '';
          }

        else if (path == 'percent') {
          let lottoFromHash = lotteriesByHash.get(a.id);
          a =
          lottoFromHash &&
          lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
            ? lottoFromHash.getIn(['dynamic', 'current_supply']) /
              lottoFromHash.getIn(['options', 'max_supply']) *
              100
            : '';
          lottoFromHash = lotteriesByHash.get(b.id);
          b =
          lottoFromHash &&
          lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
            ? lottoFromHash.getIn(['dynamic', 'current_supply']) /
              lottoFromHash.getIn(['options', 'max_supply']) *
              100
            : '';
      } else if (path[0] == 'options') {
          if (!(path instanceof Array)) {
            pathA = path[a.op[0]];
            pathB = path[b.op[0]];
        }

          for (let i = 0; i < pathA.length; i += 1) {
            a = a[pathA[i]];
            a = a || 0;
        }

          for (let j = 0; j < pathB.length; j += 1) {
            b = b[pathB[j]];
            b = b || 0;
        }
          if (JSON.parse(a).lottoName) {
            a = JSON.parse(a).lottoName.toUpperCase();
        }
          if (JSON.parse(b).lottoName) {
            b = JSON.parse(b).lottoName.toUpperCase();

        }
      } else if (path[1] == 'current_supply') { 
        let lottoFromHash = lotteriesByHash.get(a.id);
        a =
          lottoFromHash &&
          lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
            ? lottoFromHash.getIn([
              'lottery_options',
              'ticket_price',
              'amount'
            ]) * lottoFromHash.getIn(['dynamic', 'current_supply'])
            : '';
        lottoFromHash = lotteriesByHash.get(b.id);
        b =
          lottoFromHash &&
          lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
            ? lottoFromHash.getIn([
              'lottery_options',
              'ticket_price',
              'amount'
            ]) * lottoFromHash.getIn(['dynamic', 'current_supply'])
            : '';
      } else if (path[1] == 'ticket_price') {
        let itemA = lotteriesByHash.get(a.id);
        let itemB = lotteriesByHash.get(b.id);
        const ticketPricePath = ['lottery_options', 'ticket_price', 'amount'];

        a = Number(itemA.getIn(ticketPricePath));
        b = Number(itemB.getIn(ticketPricePath));

    } else {
          if (!(path instanceof Array)) {
            pathA = path[a.op[0]];
            pathB = path[b.op[0]];
        }

          for (let i = 0; i < pathA.length; i += 1) {
            a = a[pathA[i]];
            a = a || 0;
        }


          for (let j = 0; j < pathB.length; j += 1) {
            b = b[pathB[j]];
            b = b || 0;
        }
      }
        return direction === 'asc' ? (a >= b ? 1 : -1) : a >= b ? -1 : 1;
      }
      

}

export default Helper;
