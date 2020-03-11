import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import Rodal from 'rodal';
import { Tooltip } from 'react-tippy';
import AccountChainRepository from '../../repositories/AccountChainRepository';
import goldenTicket from '../../../assets/images/landing/goldenTicket.png';
import Translate from 'react-translate-component';
import RenderInBrowser from 'react-render-in-browser';


class VerificationContent extends Component {
  constructor(props) {
    super(props);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);

    this.state = {
      modalVisible: false,
      winner: ''
    };
  }

  componentWillReceiveProps() {
    AccountChainRepository.getAccount(this.props.verificationData.winner)
      .then(winner => {
        this.setState({
          winner: winner.get('name')
        });
      })
      .catch(error => {
        console.log("Can't get a winner name:", error);
      });
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  render() {
    const blockNum = this.props.verificationData.blockNum;
    const id = this.props.verificationData.id;
    const drawName = this.props.verificationData.drawName;
    let winner = this.props.verificationData.winner;

    const verifyModalStyle = {
      height: 225,
      width: 450,
      backgroundColor: 'black',
      textAlign: 'left'
    };

    return (
      <div>
        <button className="drawDetailsBtn" onClick={() => this.showModal()}>
        <Translate content="landing.verified-btn" />
        </button>
        <div className="rodalDialog">
          <Rodal
            animation="door"
            duration={200}
            visible={this.state.modalVisible}
            onClose={this.hideModal}
            customStyles={verifyModalStyle}
          >
          <RenderInBrowser except edge>
          <div>
              <h1 className="verifyTicketHeader-landing text-golden text-uppercase text-bold">
              <Translate content="landing.verified-winner" />
              </h1>
              <Fade bottom duration={1000}>
                <span className="header-verify-landing"><Translate content="landing.verified-block" /></span>
                <span className="yellow-landing ml-2"> {blockNum}</span>
                <br />
              </Fade>
              <img className="ticketImg-landing ml-2" src={goldenTicket} />
              <Fade bottom duration={1500}>
                <span className="header-verify-landing"><Translate content="landing.verified-draw-id" /></span>
                <span className="yellow-landing ml-2"> {id}</span>
                <br />
              </Fade>
              <Fade bottom duration={2000}>
                <div className="d-flex flex-nowrap">
                  <span className="header-verify-landing"><Translate content="landing.verified-drawname" /></span>
                  <span className="yellow-landing truncated ml-3"> 
                  <Tooltip
                      title={drawName}
                      position="bottom"
                      arrow
                    >
                    {drawName}
                  </Tooltip>
                  </span>
                </div>
              </Fade>
              <Fade bottom duration={2500}>
              <div className="d-flex flex-nowrap">
                <span className="header-verify-landing"><Translate content="landing.verified-winner" /> </span>
                  {this.state.winner !== '' && 
                    <Tooltip
                      title={this.state.winner}
                      position="bottom"
                      arrow
                    >
                      <span className="yellow-landing truncated ml-2"> {this.state.winner}</span>
                    </Tooltip>
                }
              </div>
              </Fade>
            </div>
          </RenderInBrowser>

          <RenderInBrowser edge only>
          <div>
              <h1 className="verifyTicketHeader-landing text-golden text-uppercase text-bold">
              <Translate content="landing.verified-winner" />
              </h1>
                <span className="header-verify-landing"><Translate content="landing.verified-block" /></span>
                <span className="yellow-landing ml-2"> {blockNum}</span>
                <br />
              <img className="ticketImg-landing ml-2" src={goldenTicket} />
                <span className="header-verify-landing"><Translate content="landing.verified-draw-id" /></span>
                <span className="yellow-landing ml-2"> {id}</span>
                <br />
                <div className="d-flex flex-nowrap">
                  <span className="header-verify-landing"><Translate content="landing.verified-drawname" /></span>
                  <span className="yellow-landing truncated ml-3"> {drawName}</span>
                </div>
              <div className="d-flex flex-nowrap">
                <span className="header-verify-landing"><Translate content="landing.verified-winner" /> </span>
                  {this.state.winner !== '' && 
                    <Tooltip
                      title={this.state.winner}
                      position="bottom"
                      arrow
                    >
                      <span className="yellow-landing truncated ml-2"> {this.state.winner}</span>
                    </Tooltip>
                }
              </div>
            </div>
          </RenderInBrowser>

          </Rodal>
        </div>
      </div>
    );
  }
}

export default VerificationContent;
