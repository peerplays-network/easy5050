import React from 'react';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import counterpart from 'counterpart';
import Helper from '../Draws/Helper';
import Countdown from '../../utilities/Countdown';
import Translate from 'react-translate-component';

var translate = require('counterpart');

const TicketSweepRow = ({
  coreAssetPrecision,
  lotteryInfo,
  setSweepAdditionalInfo,
  assetsByHash,
  lotteriesByHash,
  modalVisible,
  ticketAmount,
}) => {
  // console.warn(lotteryInfo);
  let symbol = lotteryInfo.symbol
  let id = lotteryInfo.id;
  let end_date = lotteryInfo.lottery_options.end_date;
  let amount = lotteryInfo.lottery_options.ticket_price.amount;
  
  //id
  //symbol
  //blockTime
  //end_date
  const onSetSweep = () => setSweepAdditionalInfo(id);

  const momentObject = moment.utc(end_date).local(),
    isDateNull = !(Date.parse(end_date) + momentObject.utcOffset() * 60 * 1000);
  const dateformat = counterpart('sign_in.date_format');

  const lottoFromHash = lotteriesByHash.get(id);
  //const resolutionTime = (Date.parse(lottoFromHash.getIn(['lottery_options', 'end_date'])) + (momentObject.utcOffset() * 60 * 1000) - Date.now());
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
      ? new BigNumber(amount).div(Math.pow(10, coreAssetPrecision))
      : 0;
  const ticketsTotal =
    lottoFromHash &&
    lottoFromHash.getIn(['options', 'max_supply']) !== undefined
      ? lottoFromHash.getIn(['options', 'max_supply'])
      : 1;

      let jackpot = ticketsPrice * ticketsTotal * 0.5;
  if (lottoFromHash) {
      jackpot = ticketsPrice * lottoFromHash.getIn(['dynamic', 'current_supply']) * 0.5;
  }


  jackpot = Helper.currencyConvert(jackpot);

  const endingOnSoldout =
    lottoFromHash &&
    lottoFromHash.getIn(['lottery_options', 'ending_on_soldout']) !== undefined
      ? lottoFromHash.getIn(['lottery_options', 'ending_on_soldout'])
      : null;

  let drawTypeContent;
  if (
    lottoFromHash &&
    Helper.IsJsonString(lottoFromHash.getIn(['options', 'description']))
  ) {
    symbol = JSON.parse(lottoFromHash.getIn(['options', 'description']))
      .lottoName;
  }
  let ticketsPurchased = '';

  if(!!ticketAmount && !!lottoFromHash) {
   let ticket = ticketAmount.find(el => el.id == id)
    !!ticket ? ticketsPurchased = ticket.ticketsPurchased : null
  }

  //let drawType = Helper.getDrawType(lottoFromHash.getIn(["options", "description"]));

  if (!drawType) {
    // description.drawType not found -> legacy support
    if (endingOnSoldout && !isDateNull) {
      //   both
      drawTypeContent = (
        <span className="td__cell">
          <span className="muted">
            <i className="fas fa-ticket-alt" /> {ticketsRemaining}{' '}
            <i className="fas fa-hourglass-half" /> {endDate}
          </span>
        </span>
      );
    } else if (endingOnSoldout && isDateNull) {
      // ticket
      drawTypeContent = (
        <span>
          <i className="fas fa-ticket-alt" /> {ticketsRemaining}
        </span>
      );
    } else {
      //    time
      drawTypeContent = (
        <span className="td__cell">
          <span className="">
            <i className="fas fa-hourglass-half" /> {endDate}
          </span>
          &nbsp;
        </span>
      );
    }
  } else {
    switch (drawType) {
      case 'Ticket Based':
        drawType = (
          <span>
            <i className="fas fa-ticket-alt" /> {ticketsRemaining}
          </span>
        );
        break;
      case 'Time Based':
        drawType = (
          <span>
            <i className="fas fa-hourglass-half" />{' '}
            <Countdown dateTo={endDate} />{' '}
          </span>
        );
        break;
      case 'Ticket & Time Based':
        drawType = (
          <span>
            <i className="fas fa-ticket-alt" /> {ticketsRemaining}{' '}
            <i className="fas fa-hourglass-half" />{' '}
            <Countdown dateTo={endDate} now={moment()} />{' '}
          </span>
        );
        break;
    }
    drawTypeContent = (
      <span className="td__cell">
        <span className="muted">{drawType}</span>
      </span>
    );
  }

  return (
    <tr className="tr js-show-aside">
      <td id="tableCustom" className="td">
        <span className="td__cell" >
          <i className="fas fa-ticket-alt" /> {ticketsPurchased + " - " + symbol}
        </span>
      </td>
      <td id="tableCustom" className="td">
        {drawTypeContent}
      </td>
      <td id="tableCustom" className="td">
        {Number(new BigNumber(amount).div(Math.pow(10, coreAssetPrecision)))}
      </td>
      <td id="tableCustom" className="td">{jackpot}</td>

      <td id="tableCustom" className="td text-center">
        <button className="drawDetailsBtn" onClick={modalVisible}>
          <Translate component="span" content="draw_details.buy_a_ticket" />
        </button>
      </td>
    </tr>
  );
};

export default TicketSweepRow;
