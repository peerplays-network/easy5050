import React from 'react';
import moment from 'moment';
import counterpart from "counterpart";
import BigNumber from 'bignumber.js';
import { Tooltip } from 'react-tippy';
import AssetAmount from 'components/elements/AssetAmount';

import Helper from '../Draws/Helper';
import StorageService from '../../../services/StorageService';


class HistoryRowData extends React.Component { // This class contains the row data itself on the history page. See chainTypes.js for specific ops.

  constructor(props) {
    super(props);

    this.state = {
        loading: true,
    };

  }
  
  render() {
    const { amount, tickets_to_buy, common_options, lottery, typeName, assetPrice, formattedType } = this.props.data[1];
    const dateformat = counterpart("sign_in.date_format");

    let symbol = this.props.data[1].symbol;

    if (common_options && Helper.IsJsonString(common_options.description)) { 
       symbol = JSON.parse(common_options.description).lottoName;
      } 

    let blockTime = moment(this.props.blockTime);

    console.log('%c History Rendered', 'background: #222; color: #fff');
    let type = this.props.data[0];
    let precision = this.props.precision;

    if (symbol == 'BTC') {
        symbol = StorageService.get('currency');
    }
    return (
        <tr className="tr" id="tableCustom">
        <td className="td" id="tableCustom">
            <span className="td__cell" id="strongText">
                { formattedType } - <Tooltip position="right" title={symbol}> {symbol} </Tooltip> { type === 0 ? '':
                type === 79 ? ' - ' + Helper.currencyConvert(new BigNumber(amount.amount || 0).dividedBy(Math.pow(10, precision)).toNumber().toFixed(2)) :
                type === 5 ? '-' :
                type === 80 ? ' - ' + counterpart.translate('history.lottery_end_desc')
                :
                type === 10 ? '' :
                type === 78 ? ' - ' + tickets_to_buy : '-'}  {
                    type === 10 ?
                        '':
                    type === 0 ?
                    '':
                    type === 78 ?
                    ' @ ' + Helper.currencyConvert(new BigNumber(assetPrice || 0).dividedBy(Math.pow(10, precision)).toNumber().toFixed(2)) + '':
                    type === 5 ? 0 :
                    ''
                } 
            </span>
        </td>
        <td className="td" id="tableCustom">
            <span className="">
                { blockTime ? blockTime.format(dateformat) : '-' }
            </span>
            &nbsp;
            <span className="muted">
                { blockTime ? blockTime.format('hh:mm A') : '-' }
            </span>
        </td>
        <td className="td" id="tableCustom">
            <span className="td__cell">
            {type === 78 ? Helper.currencyConvert((new BigNumber(assetPrice || 0).dividedBy(Math.pow(10, precision)).toNumber().toFixed(2)) * (tickets_to_buy)) : 
            type === 79 ? Helper.currencyConvert(new BigNumber(amount.amount || 0).dividedBy(Math.pow(10, precision)).toNumber().toFixed(2)) :
            type === 0 ? Helper.currencyConvert(new BigNumber(amount.amount || 0).dividedBy(Math.pow(10, precision)).toNumber().toFixed(2)) :
            type === 10 ? '-' :
             '-'}
            </span>
        </td>
        <td>
            
        </td>
    </tr>
    )
  }
}

export default HistoryRowData;
