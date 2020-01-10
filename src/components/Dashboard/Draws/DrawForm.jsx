import React from 'react';
import { reduxForm } from 'redux-form';
import { reset, SubmissionError, submit } from 'redux-form';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Translate from 'react-translate-component';
import ModalActions from 'actions/ModalActions';
import LotteryActions from 'actions/LotteryActions';

import BigNumber from 'bignumber.js';
import moment from 'moment';
import constants from 'constants/createDraw';
import Helper from './Helper';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';
import Info from './Info';
import tutorialWizard1 from '../../../../assets/images/step1of2.png';
import tutorialWizard2 from '../../../../assets/images/step2of2.png';

import validation from './validation';

@connect(
  state => ({
    balance: state.app.balance,
    coreAsset: state.app.coreAsset,
    precision: state.app.coreAsset.get('precision'),
    commonFormError: state.form.drawApplicationForm.syncErrors
      ? state.form.drawApplicationForm.syncErrors.commonFormError
      : ''
  }),
  dispatch => ({
    createNewLottery: () => dispatch(submit('drawApplicationForm'))
  })
)
class DrawForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      balanceError: false,
      continue: false
    };
    this.radioButtons = constants.RADIO_BUTTONS;

    this.onResetForm = this.onResetForm.bind(this);
    this.onSubmitLottery = this.onSubmitLottery.bind(this);
  }

  componentWillMount() {
    this.onResetForm();
  }

  onSubmitLottery() {
    const {
      commonFormError
    } = this.props;

    const errorBalance = this.displayInsufficientBalance();
    const balance = new BigNumber(this.props.balance)/(Math.pow(10, this.props.precision));

    if (balance < errorBalance) {
      this.setState({balanceError: true});
    } else if (!commonFormError) {
      this.setState({balanceError: false});
      this.props.hide();
      this.hideModal();
      this.props.createNewLottery();
    }
  }

  onResetForm() {
    const { reset } = this.props;

    reset('drawApplicationForm');
  }

  continueClicked(e) {
    e.preventDefault();
    this.setState({ continue: !this.state.continue });
  }

  hideModal() {
    this.props.hide();
    this.onResetForm();
    this.setState({ continue: false });
  }

  displayInsufficientBalance() {
    const insufficientFunds = 20;
    return insufficientFunds;
  }

  render() {

    const createDrawStyle = {
      height: 'auto',
      top: '1%',
      bottom: 'auto',
      padding: 2,
      width: 800
    };
    const {
      handleSubmit,
      commonFormError,
      error,
      submitErrors,
      invalid,
      pristine
    } = this.props;

    let step1Paragraph = (
      <div className="pt-3">
        <p>
          Step 1: This is the first step to create a draw. The information
          needed is:
        </p>
        <ul>
          <li>The Draw Name used to identify your draw.</li>
          <li>A short Description to explain your draw</li>
          <li>The resolution condition determines how your draw will end</li>
          <li>
            Depending on the resolution condition you may be required to choose
            a resolution date.
          </li>
        </ul>
      </div>
    );

    let step2Paragraph = (
      <div className="pt-3">
        <p>
          Step 2: Here you specify the price of each ticket, how many tickets
          will be available to be sold in your draw and what user will receive
          the benefactor portion of the proceeds from the draw.
        </p>
      </div>
    );

    let imageDisplayed;
    let displayInsufficientBalance = this.displayInsufficientBalance()
    this.state.continue === false ? (imageDisplayed = tutorialWizard1) : (imageDisplayed = tutorialWizard2);

    let modalContent = (
      <div className="row m_0">
        <div className="col-6 d-flex p-0 flex-column align-items-stretch">
          <img
            src={imageDisplayed}
            alt="step"
            className="d-block width-100 mb-3"
          />
          <div className="px-3 text-white mb-3">
            <div className="px-3">
              <h3 className="text-golden text-uppercase text-bold text-center">
                Create a Draw
              </h3>
            </div>
            {this.state.continue === false ? step1Paragraph : step2Paragraph}
          </div>
        </div>

        <div className="col-6 p-0 darkGrey-mirror">
          <form onSubmit={handleSubmit(this.onSubmitLottery)} className="form">
            <div className="form_wrapper">
              <h3 className="text-golden text-uppercase text-bold text-center drawInformationMargin">
                Draw Information
              </h3>
              <Info
                continue={this.state.continue}
                continueClicked={this.continueClicked.bind(this)}
                radioButtons={this.radioButtons}
              />
              {error || submitErrors ? (
                <span className="error__hint" id="error_submitError">
                  {~error.indexOf('Insufficient Balance')
                    ? 'Insufficient Balance'
                    : ~error.indexOf('asset_symbol_itr')
                      ? 'Duplicate lottery name'
                      : error}
                  {submitErrors}
                </span>
              ) : null}{' '}
              {commonFormError ? (
                <span className="error__text">{commonFormError}</span>
              ) : null}
            </div>
            <div className="container d-flex justify-content-center margin-top-md">
              {this.state.continue === false ? (
                <div className="width-100 justify-content-center formMargin-create">
                  <button
                    className={'btn-back'}
                    type="button"
                    onClick={this.hideModal.bind(this)}
                  >
                    Cancel
                  </button> &nbsp;
                  <button
                    className={'btn-forward'}
                    onClick={this.continueClicked.bind(this)}
                    type="button"
                    disabled={commonFormError || invalid || pristine}
                  >
                    Continue
                  </button>
                </div>
              ) : (
                <div className="justify-content-center width-100">
                  <button
                    className={'btn-back'}
                    type="button"
                    onClick={this.continueClicked.bind(this)}
                  >
                    Back
                  </button>&nbsp;
                  <button
                    className={'btn-forward'}
                    type="submit"
                    disabled={commonFormError || invalid || pristine}
                  >
                    <Translate content="creating_lottery.create_draw" />
                  </button>
                  {this.state.balanceError ?
                    <span className="error__hint balance-error" id="error_submitError">{`Insufficient Funds! ${displayInsufficientBalance} PPY is needed`}</span>
                      : null 
                    }
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );

    return (
      <div className="rodalDialog">
        <Rodal
          animation="slideDown"
          customStyles={createDrawStyle}
          visible={this.props.visible}
          onClose={this.hideModal.bind(this)}
        >
          <div className="black">{modalContent}</div>
        </Rodal>
      </div>
    );
  }

  static propTypes = {
    commonFormError: PropTypes.string,
    error: PropTypes.string,
    reset: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  };

  static defaultProps = {
    commonFormError: '',
  };
}

export default reduxForm({
  form: 'drawApplicationForm',
  validate: (values, props) => {
    let requiredFields = constants.REQUIRED_FIELDS;
    const errors = {};
    if (values.resolution === props.initialValues.resolution) {
      requiredFields = requiredFields.filter(field => field !== 'date');
      props.initialValues.time = '11:00';
    } else {
      requiredFields = constants.REQUIRED_FIELDS;
      props.initialValues.date = moment()
        .add(3, 'days')
        .format('MM/DD/YYYY');
      props.initialValues.time = '11:00';
    }

    if (values.resolution === 'All tickets sold') {
      props.initialValues.date = moment()
        .add(6, 'months')
        .format('MM/DD/YY');
      props.initialValues.time = '12:00 AM';
    }

    validation(values, requiredFields, errors);

    return errors;
  },
  shouldError: ({ props }) => {
    return !props.pristine;
  },
  onSubmit: (values, dispatch) => {
    let type = 0;

    switch (values.resolution) {
      case 'All tickets sold':
        type = 0;
        break;

      case 'On resolution date':
        type = 1;
        break;

      case 'Either one':
        type = 2;
        break;
    }

    if (type == 0) {
      values.date = moment()
        .add(6, 'months')
        .format('MM/DD/YY');
      values.time = '12:00 AM';
    }

    let descriptionObj = {
      lottoName: values.description,
      description: values.drawDescription,
      drawType: type
    };
    descriptionObj = JSON.stringify(descriptionObj);
    let formattedValues = JSON.parse(JSON.stringify(values));
    formattedValues.description = descriptionObj;
    formattedValues.name = Helper.randomizeLottoName();

    dispatch(LotteryActions.createNewLottery(formattedValues));
  },

  destroyOnUnmount: false,
  returnRejectedSubmitPromise: true,
  keepDirtyOnReinitialize: true,
  enableReinitialize: true,
  initialValues: {
    name: Helper.randomizeLottoName(),
    resolution: 'All tickets sold',
    time: '11:00',
    winnerPercent0: '50',
    date: moment().add(3, 'days')
  }
})(DrawForm);
