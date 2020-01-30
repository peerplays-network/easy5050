import React from 'react';
import moment from 'moment';
import Translate from 'react-translate-component';
import BigNumber from 'bignumber.js';

const SweepsAside = ({
    hideAside,
    info: {
        symbol,
        ticketsSold,
        lotteryStartDate,
        blockTime,
        lottery_options: {
            is_active,
            ending_on_soldout,
            ticket_price: {
                amount
            },
            end_date,
            benefactors,
            winning_tickets
        },
        options: {
            max_supply,
            description
        }
    },
    core: {
        precision
    }
}) => {

    const onHideAside = e => {

        e.preventDefault();

        document.getElementById('aside_scroll_component').scrollTop = 0;

        hideAside();
    };

    const endDate = moment.utc(end_date).local();
    const ticketPrice = new BigNumber(amount).div(Math.pow(10, precision)).toNumber();
    const jackPot = new BigNumber(ticketPrice).mul(ticketsSold).toNumber();
    const isDateNull = !(Date.parse(end_date) + (endDate.utcOffset() * 60 * 1000));

    return (
        <div>
            <div className="aside__header">
                <a
                    href=""
                    onClick={ onHideAside }
                    className="aside__close js-hide-aside"
                >
                    <i className="icon-close"/>
                </a>
                <div className="aside__title">
                    { symbol }
                </div>
            </div>
            <div className="aside__body aside__scroll" id="aside_scroll_component">
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.status"
                        className="aside__sectionTitle"
                    />
                    <div className="aside__sectionRow">
                        <div className="aside__sectionLabel">
                            <div className={`status ${ is_active ? 'open' : 'closed' }`}>
                                <span className="statusIcon"/>
                                <Translate
                                    compoenent="span"
                                    content={`aside.${ is_active ? 'open' : 'closed' }`}
                                    className="statusText"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.info"
                        className="aside__sectionTitle"
                    />
                    <div className="aside__sectionRow">
                        <Translate
                            component="div"
                            content="aside.draw_name"
                            className="aside__sectionLabel"
                        />
                        <div className="aside__sectionLabeled">
                            { symbol }
                        </div>
                    </div>
                    <div className="aside__sectionRow">
                        <Translate
                            component="div"
                            content="aside.tickets_sold"
                            className="aside__sectionLabel"
                        />
                        <div className="aside__sectionLabeled">
                            { ticketsSold }
                        </div>
                    </div>
                    <div className="aside__sectionRow">
                        <Translate
                            component="div"
                            content="aside.tickets_total"
                            className="aside__sectionLabel"
                        />
                        <div className="aside__sectionLabeled">
                            { max_supply }
                        </div>
                    </div>
                    <div className="aside__sectionRow">
                        <Translate
                            component="div"
                            content="aside.ticket_price"
                            className="aside__sectionLabel"
                        />
                        <div className="aside__sectionLabeled">
                            { ticketPrice } USD
                        </div>
                    </div>
                    <div className="aside__sectionRow">
                        <Translate
                            component="div"
                            content="aside.resolution"
                            className="aside__sectionLabel"
                        />
                        <div className="aside__sectionLabeled">
                            {
                                ending_on_soldout && !isDateNull ?
                                    <span>
                                        On { endDate.format('MM.DD.YYYY') }
                                        &nbsp;
                                        { endDate.format('hh:mm A') }
                                        <br />
                                        or On all tickets sold out
                                    </span> :
                                ending_on_soldout && isDateNull ?
                                    <span key="1">
                                        On all tickets sold out
                                    </span> :
                                !ending_on_soldout && !isDateNull ?
                                    ([
                                        <span key="1">
                                            { endDate.format('MM.DD.YYYY') }
                                        </span>,
                                        <span key="2">
                                            { endDate.format('hh:mm A') }
                                        </span>
                                    ]) :
                                null
                            }
                        </div>
                    </div>
                </div>
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.benefactors"
                        className="aside__sectionTitle"
                    />
                    {
                        benefactors.map(benefactor =>
                            <div key={ benefactor.id } className="aside__sectionRow">
                                <div className="aside__sectionLabel">
                                    { benefactor.name }
                                </div>
                                <div className="aside__sectionLabeled">
                                    { benefactor.share / 100 } %
                                </div>
                            </div>
                        )
                    }
                </div>
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.winnings_distribution"
                        className="aside__sectionTitle"
                    />
                    {
                        winning_tickets
                        .map((percent, index) =>
                            <div key={ index }className="aside__sectionRow">
                                <div className="aside__sectionLabel">
                                    { index + 1 }
                                    &nbsp;
                                    <Translate
                                        component="span"
                                        content="aside.winner"
                                    />
                                </div>
                                <div className="aside__sectionLabeled">
                                    { percent / 100 } %
                                </div>
                            </div>)
                    }
                </div>
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.current_jackpot"
                        className="aside__sectionTitle"
                    />
                    <div className="aside__sectionRow">
                        <div className="aside__sectionLabel">
                            { jackPot } USD
                        </div>
                        <div className="aside__sectionLabeled"/>
                    </div>
                </div>
                <div className="aside__section">
                    <Translate
                        component="div"
                        content="aside.description"
                        className="aside__sectionTitle"
                    />
                    <div className="aside__sectionRow">
                        <div className="aside__sectionLabel">
                            { description }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SweepsAside;

