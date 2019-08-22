import React from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import Translate from 'react-translate-component';
import { ChainValidation } from 'peerplaysjs-lib';
import SignInActions from '../../actions/SignInActions';
import AccountRepository from '../../repositories/AccountRepository';

const renderField = ({
  id,
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  iconClass,
  reset,
  meta: { touched, error, dirty }
}) => (
  <div className="text-uppercase container">
    <label className="signinLabel">
      <Translate content={placeholder} />
    </label>
    <div className="d-flex align-item-center black">
      <i className={iconClass} aria-hidden="true" />
      <Translate
        component="input"
        autoFocus={tabIndex === '1'}
        autoComplete="off"
        {...input}
        type={type}
        tabIndex={tabIndex}
        className={touched && error ? className + ' error' : className}
        attributes={{ placeholder: placeholder }}
      />
    </div>
    {touched &&
      
      error && (
        <div className="error__hint_validation" id="error_name">
          {error}
        </div>
      )}
    {!error && errors && errors.length ? (
      errors.map(err => {
        return (
          <div className="error__hint_validation" key={err}>
            {err}
          </div>
        );
      })
    ) : (
      <div className="error__hint_validation">&nbsp;</div>
    )}
  </div>
);

const renderPasswordField = ({
  id,
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  iconClass,
  meta: { touched, error, dirty }
}) => (
  <div className="text-uppercase container">
    <label className="signinLabel">
      <Translate content={placeholder} />
    </label>
    <div className="d-flex align-item-center">
      <i className={iconClass} aria-hidden="true" />
      <Translate
        component="input"
        autoFocus={tabIndex === '1'}
        autoComplete="off"
        {...input}
        type={type}
        tabIndex={tabIndex}
        className={ touched && error ? className + ' error' : className}
        attributes={{ placeholder: placeholder }}
      />
    </div>
    {touched &&
      error && (
        <div className="error__hint_validation" id="error_password">
          {error}
          {id}
        </div>
      )}
    {!error && errors && errors.length ? (
      errors.map(err => {
        return (
          <div className="error__hint_validation" key={err}>
            {err}
          </div>
        );
      })
    ) : (
      <div className="error__hint_validation">&nbsp;</div>
    )}
  </div>
);

const normalizeAccount = (value, previousValue) => {
  if (!value.length) {
    return value;
  }

  if (/[^A-Za-z0-9-]/.test(value)) {
    return previousValue && previousValue.toLowerCase();
  }

  if(value.length > 63)
    return previousValue;

  return value;
};

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
  }
  onResetForm() {
    const { reset } = this.props;
    reset('loginForm')
  }

  shouldComponentUpdate(newProps) {
    if(this.props != newProps){
      if(this.props.visible !== newProps.visible)
        this.onResetForm()

      return true;
    }
      
  }

  resetLoginWindow() {
    localStorage.setItem('login', null);
  }

  render() {
    const {
      handleSubmit,
      btnStatus,
      errors,
      invalid,
      asyncValidating,
      submitting,
      pristine
    } = this.props;

    let RestoreBtn;

    switch (btnStatus) {
      case 'default':
        RestoreBtn = (
          <button
            className="btn-forward"
            id="button_signin"
            type="submit"
            onClick={this.resetLoginWindow.bind(this)}
            disabled={invalid || submitting || asyncValidating || pristine || errors.length !== 0}
          >
            <Translate className="btnText" content="sign_in.login_btn" />
          </button>
        );
        break;
      case 'loading':
        RestoreBtn = (
          <button
            className="btn-forward btn-loader"
            id="button_signin"
            type="button"
            disabled={true}
          >
            <span className="loader loader-white loader-xs" />
            <Translate className="btnText" content="sign_in.login_btn" />
          </button>
        );
        break;
      case 'done':
        RestoreBtn = (
          <button className="btn-forward" id="button_signin" disabled={true}>
            <span className="loaderIcon icon-verify" />
            <Translate className="btnText" content="buttons.done" />
          </button>
        );
        break;
    }

    return (
      <form onSubmit={handleSubmit} className="pt-4 pb-4">
        <Field
          name="accountName"
          className="form-control signinInput"
          errors={errors}
          iconClass="fas fa-user signinIcon"
          component={renderField}
          placeholder="sign_in.login_form_login_account_placeholder"
          type="text"
          normalize={normalizeAccount}
          tabIndex="1"
        />

        <br />
        <Field
          name="password"
          className="form-control signinInput"
          iconClass="fas fa-unlock-alt signinIcon"
          component={renderPasswordField}
          placeholder="sign_in.login_form_login_password_placeholder"
          type="password"
          tabIndex="2"
        />
        <br />
        <div className="container d-flex justify-content-between text-white">
          <div>
            <Translate content="sign_in.terms-message" /><strong><Translate content="sign_in.terms-message-tandc" /></strong>
          </div>
          {RestoreBtn}
        </div>
      </form>
    );
  }
}

// Decorate the form component
LoginForm = reduxForm({
  form: 'loginForm', // a unique name for this form,
  validate: function submit(values) {
    let errors = {};

    let accountError = ChainValidation.is_account_name_error(
      values.accountName
    );

    if (!values.accountName) {
      errors.accountName = <Translate content="errors.field_is_required" />;
    }
    if (!values.password_retype)
      errors.password_retype = <Translate content="errors.field_is_required" />;
    if (values.accountName && values.accountName.length < 1)
      errors.accountName = <Translate content="errors.username_min_length" />;
    else if (values.accountName && values.accountName.length >= 64)
      errors.accountName = <Translate content="errors.username_max_length" />;
    else if (
      values.accountName &&
      values.accountName.substr(values.accountName.length - 1) === '-'
    )
      errors.accountName = <Translate content="errors.username_dash_end" />;
    else if (
      values.accountName &&
      accountError == 'Account name should have only one dash in a row.'
    ) {
      errors.accountName = <Translate content="errors.username_double_dash" />; // no 2 dashes;
    } else if (
      values.accountName &&
      accountError == 'Account name should start with a letter.'
    ) {
      errors.accountName = <Translate content="errors.username_start_letter" />; // start with letter;
    }

    let MAX_PASSWORD_CHARACTERS = 52;

    if (!values.password || values.password.length < MAX_PASSWORD_CHARACTERS || values.password.length > MAX_PASSWORD_CHARACTERS) {
      errors.password = (
        <Translate
          content="errors.password_must_be_X_characters_or_more"
          cnt={MAX_PASSWORD_CHARACTERS}
        />
      );
    }
    if (!values.password) {
      errors.password = <Translate content="errors.field_is_required" />;
    }

    return errors;
  },
  asyncValidate: (values, dispatch) => {
    return AccountRepository.lookupAccounts(values.accountName, 100).then(
      result => {
        let account = result.find(a => a[0] === values.accountName);

        if (!account) {
          dispatch(SignInActions.setLoginAccount(null));
          throw {
            accountName: <Translate content="errors.account_not_found" />
          };
        } else {
          dispatch(SignInActions.setLoginAccount(account));
        }
      }
    );
  },
  asyncBlurFields: ['accountName'],
  enableReinitialize: true
})(LoginForm);

export default LoginForm;
