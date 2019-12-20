import React, { Component } from 'react';
import classNames from 'classnames';
import 'react-tippy/dist/tippy.css';
import {
  Tooltip,
} from 'react-tippy';

import StorageService from '../../services/StorageService';

export default class Balance extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selected: [false, false, false, false], // 0= BTC, 1=PPY, 2=CAD, 3=USD
        };
    }


    componentWillMount() {
        let initCurrency = StorageService.get('currency');
        if (Object.keys(StorageService.get('currency')).length === 0 && StorageService.get('currency').constructor === Object) {
          initCurrency = 'PPY';
        }
        this.changeCurrencyDisplay(initCurrency);
    }

    changeCurrencyDisplay(convertTo) {
        switch (convertTo) {
        case 'BTC':
            this.setState({
                selected: [true, false, false, false]
            });
            break;
        case 'PPY':
            this.setState({
                selected: [false, true, false, false]
            });
            break;
        case 'CAD':
            this.setState({
                selected: [false, false, true, false]
            });
            break;
        case 'USD':
            this.setState({
                selected: [false, false, false, true]
            });
            break;
        }
        this.props.selectCurrency(convertTo);
        StorageService.set('currency', convertTo);


    }

    render() {

        const btcClasses = classNames(
     {'text-white': this.state.selected[0]}
    );

        const ppyClasses = classNames(
      {'text-white': this.state.selected[1]}
     );

        const cadClasses = classNames(
      {'text-white': this.state.selected[2]}
     );

        const usdClasses = classNames(
      {'text-white': this.state.selected[3]}
     );

        return (
          <div>
            <div className="balance-box-style mb-2 mt-2">
              <Tooltip
             // options
                  title="To increase your balance you can either take part in lotteries or fill your wallet"
                  position="right"
                  arrow="true"
              >
                <span className="d-flex justify-content-between">
                <span className="ppy-symbol-style">PPY</span>
                <span className="balance-style">{this.props.balance}</span>
              </span>
              </Tooltip>
            </div>
          </div>
        );
    }
}
