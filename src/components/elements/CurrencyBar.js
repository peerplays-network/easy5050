import React, { Component } from 'react';
import classNames from 'classnames';
import 'react-tippy/dist/tippy.css';

import StorageService from '../../services/StorageService';

export default class CurrencyBar extends Component {

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

        const selected = this.props.selected;

        const btcClasses = classNames('p-3',
     {activeMenu: selected == 'BTC'}
    );

        const ppyClasses = classNames('p-3',
      {activeMenu: selected == 'PPY'}
     );

        const cadClasses = classNames('p-3',
      {activeMenu: selected == 'CAD'}
     );

        const usdClasses = classNames('p-3',
      {activeMenu: selected == 'USD'}
     );

        return (
          <div className="darkGrey">
            <div className="container padding-zero m-0">
              <div className="row m-0">
                <div className="col-6 margin-zero d-flex align-items-center justify-content-start currencies-row text-extra-bold currencies-bar cursor-default">
                  <span className={ppyClasses} onClick={() => this.changeCurrencyDisplay('PPY')}>CAD</span>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
