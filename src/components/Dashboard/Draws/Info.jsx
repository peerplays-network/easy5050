import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Field, change, unregisterField, registerField } from 'redux-form';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import $ from 'jquery';
import moment from 'moment';
import PropTypes from 'prop-types';
import LotteryService from 'services/LotteryService';
import AppActions from 'actions/AppActions';
import DashboardActions from 'actions/DashboardActions';
import constants from 'constants/createDraw';
import BenefactorField from './Fields/BenefactorField';
import 'react-tippy/dist/tippy.css';
import { Tooltip } from 'react-tippy';

import Datetime from 'react-datetime';
require('react-datetime');

@connect(
  state => ({
    formValues: state.form.drawApplicationForm.values,
    values: state.form.drawApplicationForm.values,
    lotteriesByHash: state.dashboard.get('lotteriesByHash')
  }),
  dispatch => ({
    changeDate: newDate =>
      dispatch(change('drawApplicationForm', 'date', newDate)),
    changeTime: newTime =>
      dispatch(change('drawApplicationForm', 'time', newTime)),
    fetchLotteries: cb => dispatch(DashboardActions.fetchLotteries(cb)),
    changeBenefactor: (inputName, newAccount) => {
      dispatch(
        change('drawApplicationForm', 'benefactorname', newAccount.name)
      );
      dispatch(change('drawApplicationForm', 'benefactorid', newAccount.id));
      // dispatch(change('drawApplicationForm', `${ inputName.split('.')[0] }.id`, newAccount.id || ''));
    },
    getAllAccounts: searchedString =>
      dispatch(AppActions.getAllAccounts(searchedString)),
    resetBenefactorId: () =>
      dispatch(change('drawApplicationForm', 'benefactorid', '')),
    setNameUnique: nameUnique =>
      dispatch(change('drawApplicationForm', 'nameunique', nameUnique))
  })
)
class Info extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      foundNames: Map({}),
      isLoadingNames: false,
      userActiveWithDelay: Map({}),
      showDateTimeRow: false,
    };

    this.state = this.initialState;

    this.getFormattedName = this.getFormattedName.bind(this);
    this.onSetBenefactorName = this.onSetBenefactorName.bind(this);
    this.onLoadFilteringUser = this.onLoadFilteringUser.bind(this);
    this.onNameFieldChanged = this.onNameFieldChanged.bind(this);
    this.onDescFieldChanged = this.onDescFieldChanged.bind(this);
    this.onBlurUserField = this.onBlurUserField.bind(this);
    this.onFocusUserField = this.onFocusUserField.bind(this);
  }

  componentDidMount() {
    const { formValues, radioButtons } = this.props;

    if (formValues.resolution !== radioButtons.all_tickets_sold) {
      this.setPickers();
    }
  }

  componentWillMount() {
    this.props.fetchLotteries();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.formValues.resolution !== this.props.formValues.resolution) {
      //let dtrow = $('#datetimerow');
      if (
        newProps.formValues.resolution ===
        this.props.radioButtons.all_tickets_sold
      ) {
        
        this.setState({showDateTimeRow: false})
        return this.destroyPickers();
      }
      this.setState({showDateTimeRow: true})
      this.setPickers();
    }
  }

  onLoadFilteringUser(e) {
    this.props.resetBenefactorId();
    this.props.changeBenefactor(e.target.name, {
      name: e.target.value
    });

    if (!e.target.value) {
      return this.setState(prevState => ({
        foundNames: prevState.foundNames.set(e.target.name, [])
      }));
    }
    let me = this;
    return this.props
      .getAllAccounts(e.target.value.toLowerCase())
      .then(accountList => {
        accountList = this.filterUsers(
          e.target.value.toLowerCase(),
          accountList
        );

        accountList.forEach(function(ac) {
          if (ac.name.toLowerCase() === e.target.value.toLowerCase()) {
            me.props.changeBenefactor('benefactorname', ac);
          }
        });

        this.setState(prevState => ({
          foundNames: prevState.foundNames.set(e.target.name, accountList),
          userActiveWithDelay: prevState.userActiveWithDelay.set(
            e.target.name,
            true
          )
        }));
      });
  }

  onNameFieldChanged(e) {
    this.props.setNameUnique('');

    if (e.target.value.length > 2) {
      if (
        this.props.lotteriesByHash.find(function(obj) {
          return obj.get('symbol') === e.target.value;
        }) === undefined
      ) {
        this.props.setNameUnique('Yes');
      }
    }
  }

  onDescFieldChanged(e) {
    this.props.setNameUnique('');

    if (e.target.value.length > 2) {
      this.props.setNameUnique('Yes');
    }
  }

  onBlurUserField(e) {
    setTimeout(() => {
      this.setState(prevState => ({
        userActiveWithDelay: prevState.userActiveWithDelay.set(
          e.target.name,
          false
        ),
        foundNames: prevState.foundNames.set(e.target.name, [])
      }));
    }, 200);
  }

  onFocusUserField(e) {
    const existentBenefactor = this.props.values[e.target.name.split('.')[0]];

    if (existentBenefactor && existentBenefactor.id) {
      return;
    }

    this.setState(prevState => ({
      userActiveWithDelay: prevState.userActiveWithDelay.set(
        e.target.name,
        true
      )
    }));

    this.onLoadFilteringUser(e);
  }

  onSetBenefactorName(inputName, account) {
    this.setState(prevState => ({
      foundNames: prevState.foundNames.set(inputName, [])
    }));

    this.props.changeBenefactor(inputName, account);
  }

  getFormattedName(name, searchValue) {
    const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
    name = name.replace(matchOperatorsRe, '\\$&');
    const test = name.match(new RegExp(searchValue));

    if (!test) {
      return null;
    }

    return (
      <span>
        {name.substr(0, test.index)}
        <span className="find">{searchValue}</span>
        {name.substr(test.index + searchValue.length)}
      </span>
    );
  }

  filterUsers(filteringString, users) {
    return users
      .map(user => ({
        name: user[0],
        id: user[1]
      }))
      .filter(user => ~user.name.indexOf(filteringString));
  }

  getRadioValue(value) {
    if (value === 'creating_lottery.all_tickets_sold')
      return 'The draw will end once all tickets are sold out';
    else if (value === 'creating_lottery.on_resolution_date')
      return 'The draw will end once the end date has been reached';
    else
      return 'The draw will end once all tickets are sold or the end date has been reached';
  }

  textField = ({
    label,
    placeholder,
    value,
    input,
    meta: { touched, error }
  }) => (
    <div className="text-uppercase width-100">
      <label className="createDrawLabel">
        <Translate content={label} />
      </label>

      {/*input.name === 'tickets' ? (
        <label htmlFor="total_tickets" className="createDrawLabel min5">
          <Translate content="creating_lottery.min_five" />
        </label>
      ) : null*/}

      <Tooltip
        // options
        title="Enter the draw name that you want displayed on the dashboard"
        position="right"
        arrow="true"
      >
        <input
          {...input}
          type="text"
          className="form-control"
          placeholder={counterpart.translate(placeholder)}
          autoComplete="off"
          maxLength="40"
        />
      </Tooltip>

      {error && touched ? (
        <span className="error__hint pos-abs" id={error.split(' ').join('_')}>
          {error}
        </span>
      ) : null}
    </div>
  );

  totalTickets = ({
    label,
    placeholder,
    value,
    input,
    meta: { touched, error }
  }) => (
    <div className="text-uppercase col-6 d-flex flex-column pr-0">
      <label className="createDrawLabel">
        <Translate content={label} />
      </label>

      <Tooltip
        // options
        title="Enter the total ammount of tickets that will be purchasable for your draw"
        position="right"
        arrow="true"
      >
        <input
          {...input}
          type="text"
          className="form-control"
          placeholder={counterpart.translate(placeholder)}
          autoComplete="off"
        />
      </Tooltip>

      {error && touched ? (
        <span className="error__hint pos-abs" id={error.split(' ').join('_')}>
          {error}
        </span>
      ) : null}
    </div>
  );

  ticketPriceField = ({
    label,
    placeholder,
    value,
    input,
    meta: { touched, error }
  }) => (
    <div className="text-uppercase col-6 d-flex flex-column pl-0">
      <label className="createDrawLabel">
        <Translate content={label} />
      </label>

      <Tooltip
        // options
        title="The price per ticket in PPY that users will have to pay"
        position="right"
        arrow="true"
      >
        <input
          {...input}
          type="text"
          className="form-control"
          placeholder={counterpart.translate(placeholder)}
          autoComplete="off"
          min={5}
        />
      </Tooltip>

      {error && touched ? (
        <span className="error__hint pos-abs" id="error_ticketPrice">
          {error}
        </span>
      ) : null}
    </div>
  );

  descField = ({
    label,
    placeholder,
    value,
    input,
    meta: { touched, error }
  }) => (
    <div className="text-uppercase width-100 mt-2 ">
      <label className="createDrawLabel">
        <Translate content={label} />
      </label>

      {/*input.name === 'tickets' ? (
        <label htmlFor="total_tickets" className="createDrawLabel min5">
          Minimum 5
        </label>
      ) : null*/}
      <Tooltip
        // options
        title="Tell us about your organization or reason for doing the draw"
        position="right"
        arrow="true"
      >
        <textarea
          {...input}
          type="text"
          className="form-control"
          placeholder={counterpart.translate(placeholder)}
          autoComplete="off"
          maxLength="300"
          style={{ height: '120px' }}
        />
      </Tooltip>
      {error && touched ? (
        <span className="error__hint pos-abs" id="error_ticketQuantity">
          {error}
        </span>
      ) : null}
    </div>
  );

  nameField = ({
    label,
    placeholder,
    value,
    input,
    meta: { touched, error }
  }) => (
    <div className="text-uppercase width-100">
      <label className="createDrawLabel">
        <Translate content={label} />
      </label>
      <input
        {...input}
        type="text"
        className="form-control"
        placeholder={counterpart.translate(placeholder)}
        autoComplete="off"
      />

      {error && touched ? (
        <span className="error__hint pos-abs" id="error_name">
          {error}
        </span>
      ) : null}
    </div>
  );

  hiddenField = ({ input, meta: { touched, error } }) => (
    <div>
      <input {...input} type="text" style={{ display: 'none' }} />
      {error ? (
        <span className="error__hint pos-abs" id="error_benefactor">
          {error}
        </span>
      ) : null}
    </div>
  );

  radioField = ({ label, value, input }) => (
    <div className="d-block">
      <Tooltip
        // options
        title={this.getRadioValue(label)}
        position="right"
        arrow="true"
      >
          <input
            {...input}
            type="radio"
            className=""
            name="resolution"
            value={input.value}
          />
          <label className="control control--radio">
            <Translate content={label} />
          </label>
      </Tooltip>
    </div>
  );

  dateField = ({ input, meta: { touched, error } }) => (
    <Tooltip
      // options
      title="Date that the draw will end"
      position="right"
      arrow="true"
    >
      <div className="col-6-sm">
        <input
          {...input}
          type="date"
          id="draw_date"
          name="date"
          className="form-control pl-2 pr-2"
        />
        {error && touched ? (
          <span className="error__hint pos-abs error__date" id="error_date">
            {error}
          </span>
        ) : null}
      </div>
    </Tooltip>
  );

  timeField = ({ input, meta: { touched, error } }) => (
    <div className="col-6-sm">
      <Tooltip
        // options
        title="Time of day that the draw should end"
        position="right"
        arrow="true"
      >
        <input
          {...input}
          type="time"
          id="draw_time"
          name="time"
          className="form-control pl-2 pr-2"
        />
        {error && touched ? (
          <span className="error__hint pos-abs error__date" id="error_date">
            {error}
          </span>
        ) : null}
      </Tooltip>
    </div>
  );

  setPickers() {
    let timepicker = $('#draw_time'),
      datepicker = $('#draw_date');

    if (!timepicker.val()) {
      timepicker.val('11:00');
    }
    this.props.changeTime(
      timepicker !== undefined && timepicker.val()
        ? timepicker.val()
        : '11:00'
    );

    if (!datepicker.val()) {
      datepicker.val(
        moment()
          .add(3, 'days')
          .format('YYYY-MM-DD')
      );
    }
    this.props.changeDate(
      datepicker !== undefined && datepicker.val()
        ? datepicker.val()
        : moment()
            .add(3, 'days')
            .format('YYYY-MM-DD')
    );
    timepicker.on('input', function(e) {
      if ('' == this.value) {
        this.value = '11:00';
      }
    });
    datepicker.on('input', function(e) {
      if ('' == this.value) {
        this.value = moment()
          .add(3, 'days')
          .format('YYYY-MM-DD');
      }
    });
  }

  destroyPickers() {
    let timepicker = $('#draw_time'),
      datepicker = $('#draw_date');

    this.props.changeTime('');
    timepicker.val('');
    this.props.changeDate('');
  }
  normalizeNameField = (value, previousValue) => {
    if (!value) {
      return value;
    }
    return value;
    // const upperCaseValue = value.toUpperCase();
    // return upperCaseValue;
  };

  normalizeTicketField = (value, previousValue) => {
    if (!value) {
      return value;
    }

    if (value > 100000) {
      return previousValue;
    }

    const onlyNums = value.replace(/[^\d]/g, '');
    if (onlyNums.length <= 3) {
      return onlyNums;
    }
    return onlyNums;
  };

  normalizePriceField = (value, previousValue) => {

    if (value.search(/[^0-9.]/) != -1) {
      return previousValue;
    }
    let decimalCount = value.split('.');
    
    if (decimalCount.length > 2) {
      return previousValue;
    }
    if (decimalCount[1]) {
      if (decimalCount[1].length > 5) {
        return previousValue;
      }
    }

    if (value > 10000) {
      return previousValue
    }

    if (value.length > 1) {
      if (value[0] == 0 && value[1] != '.') {
        return previousValue;
      }
    }


    // console.warn(value[0]);
    return value;
  };

  render() {
    const { foundNames, isLoadingNames, userActiveWithDelay } = this.state;
    return (
      <section className="form__section">
        {this.props.continue === false ? (
          <div>
            <div className="row">
              <Field
                name="description"
                component={this.textField}
                label="creating_lottery.draw_name"
                placeholder="creating_lottery.enter_draw_name"
                normalize={this.normalizeNameField}
                onChange={this.onDescFieldChanged}
              />
              <Field
                name="drawDescription"
                component={this.descField}
                label="creating_lottery.draw_description"
                placeholder="creating_lottery.enter_draw_description"
              />
              <Field name="nameunique" component={this.hiddenField} />
            </div>
            <div className="row">
              <label className="text-uppercase createDrawLabel d-block mt-2">
                <Translate content="creating_lottery.resolution_conditions" />
              </label>
              <div className="justify-content-between ticketMargin">
                {Object.entries(this.props.radioButtons).map(
                  (radioButton, index) => (
                    <Field
                      key={radioButton[0]}
                      component={this.radioField}
                      label={`creating_lottery.${radioButton[0]}`}
                      name="resolution"
                      value={radioButton[1]}
                      type="radio"
                      checked={!index}
                    />
                  )
                )}
              </div>
              <hr />
              {this.state.showDateTimeRow ? <div
                className="text-uppercase row"
              >
                <label className="createDrawLabel d-block">
                  <Translate content="creating_lottery.draw_resolution_date_time" />
                </label>
                <div className="d-flex align-items-center row m_0">
                  <Field
                    name="date"
                    component={this.dateField}
                    props={{
                      onChange: date => {
                        console.warn('date changed: ' + date);
                        this.props.changeDate(date);
                      },
                      inputProps: { name: 'date' },
                      timeFormat: false,
                      value: this.props.formValues.date
                    }}
                  />

                  <Field name="time" component={this.timeField} />
                </div>
              </div> : null}
            </div>
          </div>
        ) : (
          <div>
            <div className="row mb-4">
              <Field
                component={this.ticketPriceField}
                name="price"
                label="creating_lottery.ticket_price"
                placeholder="creating_lottery.enter_ticket_price"
                normalize={this.normalizePriceField}
              />
              <Field
                name="tickets"
                component={this.totalTickets}
                label="creating_lottery.total_tickets"
                placeholder="creating_lottery.enter_total_tickets"
                normalize={this.normalizeTicketField}
              />
            </div>
            <div className="row">
              <Field
                name="benefactorname"
                component={BenefactorField}
                foundNames={foundNames}
                isLoadingNames={isLoadingNames}
                userActiveWithDelay={userActiveWithDelay}
                getFormattedName={this.getFormattedName}
                onSetBenefactorName={this.onSetBenefactorName}
                onChange={this.onLoadFilteringUser}
                onBlur={this.onBlurUserField}
                onFocus={this.onFocusUserField}
              />
            </div>
            <div className="row">
              <div className="text-uppercase" />
              <Field name="benefactorid" component={this.hiddenField} />
            </div>
          </div>
        )}
      </section>
    );
  }
}

Info.PropTypes = {
  formValues: PropTypes.shape({
    resolution: PropTypes.oneOf(Object.values(constants.RADIO_BUTTONS)),
    time: PropTypes.string,
    endDate: PropTypes.number,
    name: PropTypes.string,
    tickets: PropTypes.string,
    date: PropTypes.string,
    price: PropTypes.string,
    benefactor: PropTypes.string
  }).isRequired,

  changeDate: PropTypes.func.isRequired,
  changeTime: PropTypes.func.isRequired,

  drawApplicationForm: PropTypes.shape({
    resolution: PropTypes.oneOf(Object.values(constants.RADIO_BUTTONS)),
    time: PropTypes.string,
    endDate: PropTypes.number,
    name: PropTypes.string,
    tickets: PropTypes.string,
    date: PropTypes.string,
    price: PropTypes.string,
    benefactor: PropTypes.string
  }).isRequired,
  changeBenefactor: PropTypes.func.isRequired,
  getAllAccounts: PropTypes.func.isRequired
};

export default Info;
