import React from 'react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import counterpart from 'counterpart';
import Helper from '../Draws/Helper';
import Countdown from '../../utilities/Countdown';
import Translate from 'react-translate-component';
import VerificationContent from '../../Landing/VerificationContent';

var translate = require('counterpart');

const PreviousSweepRow = ({
  coreAssetPrecision,
  time,
  lotteryInfo: {
    id,
    symbol,
    issuer,
    blockTime,
    options: { max_supply },
    lottery_options: {
      ticket_price: { amount },
      is_active,
      end_date,
      ending_on_soldout
    }
  },
  setSweepAdditionalInfo,
  assetsByHash,
  lotteriesByHash,
  modalVisible,
  lotteryWinners
}) => {
  const onSetSweep = () => setSweepAdditionalInfo(id);

  const momentObject = moment.utc(end_date).local(),
    isDateNull = !(Date.parse(end_date) + momentObject.utcOffset() * 60 * 1000);
  const lottoFromHash = lotteriesByHash.get(id);

  let description =
    lottoFromHash !== undefined ?
    lottoFromHash.getIn(['options', 'description']) : '';

  let drawType = lottoFromHash !==undefined ? Helper.getDrawType(lottoFromHash.getIn(['options', 'description'])) : 'Time Based';
    
 
  const ticketsRemaining = lottoFromHash !==undefined ? max_supply -
    lottoFromHash.getIn(['dynamic', 'current_supply']) : 0;
    
  
  const ticketsPrice =
    new BigNumber(
          amount
        )
          .div(Math.pow(10, coreAssetPrecision))
          .toFixed(10);

  const ticketsTotal = lottoFromHash !== undefined ? lottoFromHash.getIn(['options', 'max_supply']) : 0;

  let jackpot = ticketsPrice * lottoFromHash.getIn(['dynamic', 'current_supply']) * 0.5;
  const ticketPrice = Number(new BigNumber(amount).div(Math.pow(10, coreAssetPrecision)).toFixed(2));
  if (lottoFromHash) {
    jackpot = ticketsPrice * lottoFromHash.getIn(['dynamic', 'sweeps_tickets_sold']) * 0.5;
  }

  if (
    lottoFromHash &&
    Helper.IsJsonString(lottoFromHash.getIn(['options', 'description']))
  ) {
    symbol = JSON.parse(lottoFromHash.getIn(['options', 'description']))
      .lottoName;
  }
  const formattedTime = moment(blockTime).format('MMMM D, YYYY');

  let winner = lotteryWinners.filter(data => {
    return data.lotteryId === id;
  });

  winner = winner[0];
    let verificationData;
  let verified = false;
  if (winner === undefined) {
    verificationData = {drawName: symbol, blockNum: "", winner:"", id: id};
    verified = false;
  } else {
    verificationData = {drawName: symbol, blockNum: winner.blockNum, winner: winner.name, id: winner.lotteryId};
    verified = true;
  }

  /*
    <tr onClick={onSetSweep}>
      <th scope="row" className="columnA">
        {symbol}
      </th>

      <td className="columnB">{formattedTime}</td>
      <td className="columnC">
        {Helper.currencyConvert(
          Number(new BigNumber(amount).div(Math.pow(10, 9)).toFixed(10))
        )}
      </td>

      <td className="columnD">{Helper.currencyConvert(jackpot)}</td>

      <td className="columnE">
        <VerificationContent verificationData={verificationData} />
      </td>
    </tr>
  */
  return (

    <tr className="tr js-show-aside" onClick={onSetSweep}>
      <td id="tableCustom" className="td">
        <span className="td__cell">
          {symbol}
        </span>
      </td>
      <td id="tableCustom" className="td">
        {formattedTime}
      </td>
      <td id="tableCustom" className="td">
        {Helper.currencyConvert(ticketPrice)}
      </td>
      <td id="tableCustom" className="td">
        <span className="td__cell">{Helper.currencyConvert(jackpot)}</span>
      </td>
      <td id="tableCustom" className="td text-center">
          {// enable if true, disable if false
            verified ? 
              <VerificationContent verificationData={verificationData} /> :
              <button className="drawDetailsBtnDisabled" disabled={true} ><Translate content="landing.verified-btn" /></button>
          }
      </td>
    </tr>

  );
};
/* <button className="drawDetailsBtn" onClick={modalVisible}>{buttonText}</button> */
export default PreviousSweepRow;
