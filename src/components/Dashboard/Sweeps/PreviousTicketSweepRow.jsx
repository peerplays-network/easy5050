import React from 'react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { List } from 'immutable';
import counterpart from 'counterpart';
import Helper from '../Draws/Helper';
import Countdown from '../../utilities/Countdown';
import Translate from 'react-translate-component';
import VerificationContent from '../../Landing/VerificationContent';
import ChainService from '../../../services/ChainService';

var translate = require('counterpart');

const PreviousTicketSweepRow = ({
  coreAssetPrecision,
  lotteryInfo,
  setTicketAdditionalInfo,
  assetsByHash,
  lotteriesByHash,
  modalVisible,
  lotteryWinners,
  accountHistory,
  ticketAmount,
}) => {

  let symbol =  List.isList(lotteryInfo) ? lotteryInfo.get("symbol") : lotteryInfo.symbol;
  let id = List.isList(lotteryInfo) ? lotteryInfo.get("id") : lotteryInfo.id;
  let end_date = List.isList(lotteryInfo) ? lotteryInfo.getIn(['lottery_options','end_date']) : lotteryInfo.lottery_options.end_date;
  let amount = List.isList(lotteryInfo) ? lotteryInfo.getIn(['lottery_options','ticket_price','amount']) : lotteryInfo.lottery_options.ticket_price.amount;
  let blockTime = List.isList(lotteryInfo) ? lotteryInfo.get("blockTime") : lotteryInfo.blockTime
  //id
  //symbol
  //blockTime
  //end_date

  const onSetSweep = () => setTicketAdditionalInfo(id);

  const momentObject = moment.utc(end_date).local(),
    isDateNull = !(Date.parse(end_date) + momentObject.utcOffset() * 60 * 1000);
  const dateformat = counterpart('sign_in.date_format');

  const lottoFromHash = lotteriesByHash.get(id);

  let resolutionTime = (Date.parse(end_date) + (momentObject.utcOffset() * 60 * 1000) - Date.now());
  resolutionTime = moment(resolutionTime.blockTime).format('MMMM D, YYYY');
  let formattedTime = moment(blockTime).format('MMMM D, YYYY');

  formattedTime = formattedTime !== "Invalid date" ? formattedTime : resolutionTime;

  /* Get draw type */
  //const drawType = (Helper.getDrawType(lottoFromHash.getIn(['options', 'description']))!==undefined) ? lottoFromHash.getIn(['lottery_options','is_active']) : true;

  let description = lottoFromHash !== undefined ? lottoFromHash.getIn(['options', 'description']) : '';

  let drawType =
    Helper.getDrawType(description) !== undefined
      ? Helper.getDrawType(description)
      : 'Time Based';

  const ticketsRemaining =
    lottoFromHash &&
    lottoFromHash.getIn(['options', 'max_supply']) -
      (lottoFromHash.getIn(['dynamic', 'current_supply']) !== undefined
        ? lottoFromHash.getIn(['dynamic', 'current_supply'])
        : 0);

  const endDate = moment.utc(end_date).local();

  const assetId =
    lottoFromHash &&
    lottoFromHash.getIn(['lottery_options', 'ticket_price', 'asset_id']) !==
      undefined
      ? lottoFromHash.getIn(['lottery_options', 'ticket_price', 'asset_id'])
      : '';
  const asset =
    assetId && assetsByHash !== undefined ? assetsByHash.get(assetId) : '';
  const ticketsPrice =
    amount && asset
      ? new BigNumber(amount).div(Math.pow(10, coreAssetPrecision)).toFixed(10)
      : 0;
  const ticketsTotal =
    lottoFromHash &&
    lottoFromHash.getIn(['options', 'max_supply']) !== undefined
      ? lottoFromHash.getIn(['options', 'max_supply'])
      : 1;

  let jackpot = ticketsPrice * ticketsTotal * 0.5;

  if (lottoFromHash) {
    jackpot = ticketsPrice * lottoFromHash.getIn(['dynamic', 'sweeps_tickets_sold']) * 0.5;
  }

  if (lottoFromHash !== undefined) 
  {
    symbol = JSON.parse(description).lottoName;
  }
  let winner = lotteryWinners.filter(data => {
    return (data.lotteryId === id)
  })

  // const blockTime = ChainService.getDateOfBlock(winner.blockNum).then(response => {
  //   const formattedTime = moment(response.blockTime).format('MMMM D, YYYY');
  //   console.log(response)
  //           });
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

  let ticketsPurchased = '';

  if(!!ticketAmount && !!lottoFromHash) {
   let ticket = ticketAmount.find(el => el.id == id)
    !!ticket ? ticketsPurchased = ticket.ticketsPurchased : null
  }
  //console.log("verified");
  //console.log(verified);
  //const formattedTime = moment(blockTime).format('MMMM D, YYYY');

  //let drawType = Helper.getDrawType(lottoFromHash.getIn(["options", "description"]));

  /*
  <tr >
    <th scope="row" className="columnA">
      {symbol}
    </th>

    <td className="columnB">{resolutionTime}</td>
    <td className="columnC">
      {Number(new BigNumber(amount).div(Math.pow(10, 9)).toFixed(10))} BTC
    </td>

    <td className="columnD">{jackpot} ₿</td>

    <td className="columnE">
      <VerificationContent verificationData={verificationData} />
    </td>
  </tr>
  */

  return (

    <tr className="tr js-show-aside">
      <td id="tableCustom" className="td">
        <span className="td__cell" >
          <i className="fas fa-ticket-alt" /> {ticketsPurchased + " - " + symbol}
        </span>
      </td>
      <td id="tableCustom" className="td">
        {formattedTime}
      </td>
      <td id="tableCustom" className="td">
        {Helper.currencyConvert(Number(new BigNumber(amount).div(Math.pow(10, coreAssetPrecision)).toFixed(10)))}
      </td>
      <td id="tableCustom" className="td">
        <span className="td__cell">{Helper.currencyConvert(jackpot)}</span>
      </td>
      <td id="tableCustom" className="td text-center">
          {// enable if true, disable if false
            verified ? 
              <VerificationContent verificationData={verificationData} /> :
              <button className="drawDetailsBtnDisabled" disabled={true} >VERIFIED</button>
          }
      </td>
    </tr>
    
  );
};

export default PreviousTicketSweepRow;
