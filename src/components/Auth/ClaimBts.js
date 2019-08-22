import React from 'react'
import {connect} from "react-redux";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import Logo from "./Logo";
import ClaimBtsForm from "./ClaimBtsForm";
import ClaimBtsActions from "../../actions/ClaimBtsActions";
import NavigateActions from "../../actions/NavigateActions";


@connect(
    (state) => {
        return {
            status: state.claimBtsPage.status,
            errors: state.claimBtsPage.errors,
        };
    },
    {
        setStatus: ClaimBtsActions.setStatus,
        loginAccountFromBts: ClaimBtsActions.loginAccountFromBts,
        navigateToSignIn: NavigateActions.navigateToSignIn,
        navigateToSignUp: NavigateActions.navigateToSignUp
    }
)
class ClaimBts extends React.Component {

    componentDidMount() {
        window.scrollTo(0, 0);
    }

    handleSubmit(values) {

        this.props.setStatus('loading');

        setTimeout(() => {
            this.props.loginAccountFromBts(values.private_bts_key);
        }, 0);

    }

    onClickLogin() {
        this.props.navigateToSignIn();
    }

    navigateToSignUp() {
        this.props.navigateToSignUp()
    }

    render() {
        return (
            <div className="out">
                <div className="wrapper">
                    <div className="box">
                        <div className="dialog-login">

                            <Logo />

                            <h1 className="h1">{counterpart.translate("login_bts.login_form_title")}<span className="tm">TM</span></h1>

                            <div className="section__text">
                                <Translate component="div" className="section__textTitle" content="login_bts.title" />
                                <div className="section__textItem">
                                    <Translate component="div" className="section__textItemHead" content="login_bts.note_title_1" />
                                    <div className="section__textItemBody">
                                        <Translate component="div" className="" content="login_bts.note_1" />
                                    </div>
                                </div>

                                <div className="section__textItem">
                                    <Translate component="div" className="section__textItemHead" content="login_bts.note_title_2" />
                                    <div className="section__textItemBody">
                                        <Translate component="div" className="" content="login_bts.note_2" />
                                    </div>
                                </div>

                                <div className="section__textItem">
                                    <Translate component="div" className="section__textItemHead" content="login_bts.note_title_3" />
                                    <div className="section__textItemBody">
                                        <Translate component="div" className="" content="login_bts.note_3" />
                                    </div>
                                </div>

                            </div>

                            <div className="form">
                                <ClaimBtsForm errors={this.props.errors} btnStatus={this.props.status} onSubmit={this.handleSubmit.bind(this)} />
                            </div>

                            <div className="login__footer">
                                <div className="login__footerTitle">{counterpart.translate("login_bts.login_form_sign_up_label")}</div>

                                <button className="btn btn-sign btn-fsz-18 " onClick={this.navigateToSignUp.bind(this)}>
                                    <span className="btnText">{counterpart.translate("auth.sign_up_btn")}</span>
                                </button>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ClaimBts;