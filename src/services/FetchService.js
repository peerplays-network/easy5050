import { ChainStore } from 'peerplaysjs-lib';
import moment from 'moment';
import Helper from '../components/Dashboard/Draws/Helper';
import StorageService from '../services/StorageService';

export default class ChainService {

    static fetchExchangeRates() {
        return new Promise((resolve, reject) => {
            let usdRate;
            let cadRate;
            let rates = {};
            fetch(`https://blockchain.info/ticker`).then((response) => {
                return response.json();
            }).then((data) => {
                usdRate = data.USD.last;
                cadRate = data.CAD.last;
                rates = {usd: usdRate, cad: cadRate};
                StorageService.set('rates', rates);
                resolve(rates);
            });
        
        });
    }
}



