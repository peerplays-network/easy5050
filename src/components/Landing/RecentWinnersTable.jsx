import React, { Component } from 'react';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import ChainService from '../../services/ChainService';
import Helper from '../../components/Dashboard/Draws/Helper';

import VerificationContent from './VerificationContent';
import { resolve } from 'url';
import Translate from 'react-translate-component';

@connect(
    state => ({
        lotteriesByHash: state.dashboard.get('lotteriesByHash'),
        assetsByHash: state.dashboard.get('assetsByHash'),
        lotteriesIds: state.dashboard.get('lotteriesIds'),
        creatorsByHash: state.dashboard.get('creatorsByHash'),
        countRowsOnPage: state.dashboard.get('countRowsOnPage'),
        sortField: state.dashboard.get('sortField'),
        sortDirection: state.dashboard.get('sortDirection'),
        page: state.dashboard.get('page'),
        dateFilterEnd: state.dashboard.get('dateFilterEnd'),
        dateFilterStart: state.dashboard.get('dateFilterStart'),
        textFilter: state.dashboard.get('textFilter'),
        activeDraws: state.dashboard.get('activeDraws'),
        benefactorsById: state.buyTicketsAside.get('benefactorsById'),
        lotteryObject: state.buyTicketsAside.get('lotteryObject'),
        location: state.router.location.pathname.split('/')[2],
        currency: state.app.selectedCurrency,
        precision: state.app.coreAsset.get('precision')
    }),
    dispatch => ({

    })
)

class RecentWinnersTable extends Component {

    constructor(props) {
        super(props);

        this.hideModal = this.hideModal.bind(this);
        this.showModal = this.showModal.bind(this);

        this.state = {
            modalVisible: false,
            lotteryData: null,
            times: [],
        };

    }

    showModal(lottery, verificationData) {
        this.setState({ modalVisible: true, lotteryData: lottery.toJS(), verificationData});
    }

    hideModal() {
        this.setState({ modalVisible: false });
    }

    componentDidMount() {
        const times = [];
        this.props.data.slice(0, 5).map(data => {
            const blockTime = ChainService.getDateOfBlock(data.blockNum).then(response => {
                const formattedTime = moment(response.blockTime).format('MMMM D, YYYY');

                this.setState({
                    times: [...this.state.times, formattedTime] // add times to array
                });

            });
        });

    }

    render() {

        const { lotteriesIds, lotteriesByHash } = this.props;
        let verificationPage = (<p>Loading</p>);

        if (this.state.lotteryData) {
            verificationPage = <VerificationContent data={this.state.lotteryData} verificationData={this.state.verificationData} />;
        }
        return (
          <div>
            <div className="borderTop-landing100Silver"/><table className="table table-striped-inactive table-landing "><div className="borderTop-landingSilver"/>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="Col-Header"><Translate content="landing.drawname" /></span>
                  </th>
                  <th scope="col">
                    <span className="Col-Header"><Translate content="landing.draw-date" /></span>
                  </th>
                  <th scope="col">
                    <span className="Col-Header"><Translate content="landing.winner-paid" /></span>
                  </th>
                  <th className="th">
                    <span className="Col-Header"><Translate content="landing.verification" /></span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {this.props.data.slice(0, 5).map((data, index) => {
                    const lottery = lotteriesByHash.get(data.lotteryId);
                    const drawName = JSON.parse(lottery.getIn(['options', 'description'])).lottoName;
                    const amount = new BigNumber(data.amount).div(Math.pow(10, this.props.precision)).toFixed(2);

                    const verificationData = {drawName, blockNum: data.blockNum, winner: data.winner, id: data.lotteryId};
                    return (

                      <tr key={lottery.get('id')} className="tr js-show-aside">
                        <td id="tableCustom" className="td">
                          <span className="td__cell" >
                            {drawName}
                          </span>
                        </td>


                        <td id="tableCustom" className="td">
                          {this.state.times[index]}
                        </td>
                        <td id="tableCustom" className="td"><span className="td__cell">{Helper.currencyConvert(amount)}</span></td>
                        <td id="tableCustom" className="td">
                          <VerificationContent verificationData={verificationData} />
                        </td>
                      </tr>);

                })}
              </tbody>
            </table>
          </div>
        );
    }
}

export default RecentWinnersTable;
