import React from 'react';
import Rodal from 'rodal';
import Translate from 'react-translate-component';

class BetaMessageModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true };

        this.hide = this.hide.bind(this);
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        const mStyle = {
            color: 'white',
            background: 'black',
            height: 375,
            width: 550,
            border: '1px solid gold'
        };

        return (
        <div className="rodalPublicBeta">
          <Rodal visible={this.state.visible} onClose={this.hide.bind(this)} customStyles={mStyle}>
            <div>
              <h1 className="text-golden text_c"><Translate content="sign_up.beta-header" />< br/><Translate content="sign_up.beta-header-public-demo" /></h1>
              <div className="underline-golden"> </div><br />
              <div className="betaText-landing"><Translate content="sign_up.beta-message" /></div>
            </div>
            <div className="text_c">
            <br />
            <button
            className="btn-forward"
            onClick={this.hide}
          > 
            <Translate content="sign_up.i-understand-btn" />
          </button>
          </div>
          </Rodal>
          </div>

        );

    }
}
export default BetaMessageModal;

