import React from 'react';
import { Field, Fields, reduxForm } from 'redux-form';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { ChainValidation } from 'peerplaysjs-lib';
import AccountRepository from '../../repositories/AccountRepository';
import classNames from 'classnames';
import { saveAs } from '../../libs/filesaver.js';
import copy from 'copy-to-clipboard';
import RandomString from 'randomstring';
import Logo from './Logo';
import tutorialWizard1 from '../../../assets/images/step1of4.png';
import tutorialWizard2 from '../../../assets/images/step2of4.png';
import tutorialWizard3 from '../../../assets/images/step3of4.png';
import tutorialWizard4 from '../../../assets/images/step4of4.png';

const renderTermsField = ({ className, className1, className2 }) => {
  const note1 = counterpart('terms_conditions.participate_note_1');
  const bullet2 = counterpart('terms_conditions.participate_bullet_2');
  const bullet3 = counterpart('terms_conditions.participate_bullet_3');
  const create1 = counterpart('terms_conditions.create_note_1');
  const create_bullet_1 = counterpart('terms_conditions.create_bullet_1');
  const create_bullet_2 = counterpart('terms_conditions.create_bullet_2');
  const create_bullet_3 = counterpart('terms_conditions.create_bullet_3');
  const create_bullet_6 = counterpart('terms_conditions.create_bullet_6');
  return (
    <div>
      <div className="darkGrey mt-4">
        <h3 className="text-golden text-uppercase text-bold text-center mt-3 ">
          <Translate content="terms_conditions.terms_label" />
        </h3>
        
      </div>
      <div className="container ">
        <div className={className}>
          <Translate
            content="terms_conditions.participate_terms_of_use"
            component="label"
            className={className1}
          />
          <Translate
            content="terms_conditions.in_canada"
            component="label"
            className={className1}
          />
          <br />
          <label
            className={className2}
            dangerouslySetInnerHTML={{ __html: note1 }}
          />
          <br />
          <Translate
            content="terms_conditions.participate_note_2"
            component="label"
            className={className2}
          />
          <Translate
            content="terms_conditions.participate_bullet_1"
            component="label"
            className={className2}
          />
          <label
            className={className2}
            dangerouslySetInnerHTML={{ __html: bullet2 }}
          />
          <label
            className={className2}
            dangerouslySetInnerHTML={{ __html: bullet3 }}
          />
          <br />
          <Translate
            content="terms_conditions.participate_note_3"
            component="label"
            className={className2}
          />
          <br />
          <Translate
            content="terms_conditions.outside_canada"
            component="label"
            className={className1}
          />
          <br />
          <Translate
            content="terms_conditions.participate_note_4"
            component="label"
            className={className2}
          />
          <hr />
          <Translate
            content="terms_conditions.create_terms_of_use"
            component="label"
            className={className1}
          />
          <Translate
            content="terms_conditions.in_canada"
            component="label"
            className={className1}
          />
          <br />
          <label
            className={className2}
            dangerouslySetInnerHTML={{ __html: create1 }}
          />
          <br />
          <Translate
            content="terms_conditions.create_note_2"
            component="label"
            className={className2}
          />
          <ul>
            <li>
              <label
                className={className2}
                dangerouslySetInnerHTML={{ __html: create_bullet_1 }}
              />
            </li>
            <li>
              <label
                className={className2}
                dangerouslySetInnerHTML={{ __html: create_bullet_2 }}
              />
            </li>
            <li>
              <label
                className={className2}
                dangerouslySetInnerHTML={{ __html: create_bullet_3 }}
              />
            </li>
            <li>
              <Translate
                content="terms_conditions.create_bullet_4"
                component="label"
                className={className2}
              />
            </li>
            <li>
              <Translate
                content="terms_conditions.create_bullet_5"
                component="label"
                className={className2}
              />
            </li>
            <li>
              <label
                className={className2}
                dangerouslySetInnerHTML={{ __html: create_bullet_6 }}
              />
            </li>
            <li>
              <Translate
                content="terms_conditions.create_bullet_7"
                component="label"
                className={className2}
              />
              <Translate
                content="terms_conditions.create_sbullet_1"
                component="label"
                className={className2}
              />
              <Translate
                content="terms_conditions.create_sbullet_2"
                component="label"
                className={className2}
              />
            </li>
          </ul>
          <Translate
            content="terms_conditions.create_note_3"
            component="label"
            className={className2}
          />
          <br />
          <Translate
            content="terms_conditions.outside_canada"
            component="label"
            className={className1}
          />
          <br />
          <Translate
            content="terms_conditions.create_note_4"
            component="label"
            className={className2}
          />
        </div>
      </div>
    </div>
  );
};

const renderField = ({
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  iconClass,
  meta: { touched, error, dirty }
}) => {
  return (
    <div className="container pt-4">
      <label className="text-uppercase signinLabel">
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
          attributes={{ placeholder: placeholder }}
          tabIndex={tabIndex}
          className={touched && error ? className + ' error' : className}
        />
      </div>
      {touched && error && <div className="error__hint">{error}</div>}
      {!error && errors && errors.length ? (
        errors.map(err => {
          return (
            <div className="error__hint" key={err}>
              {err}
            </div>
          );
        })
      ) : (
        <div className="error__hint">&nbsp;</div>
      )}
    </div>
  );
};

const renderPasswordField = ({
  onClickCopy,
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  meta: { touched, error, dirty, value }
}) => {
  return (
    <div className="text-uppercase container pt-4">
      <label className="signinLabel">
        <Translate content="sign_up.your_password_is" />
      </label>
      <div className="d-flex align-item-center position-relative">
        <i className="fas fa-unlock-alt signinIcon" aria-hidden="true" />
        <Translate
          component="input"
          autoComplete="off"
          readOnly
          {...input}
          type={type}
          attributes={{ placeholder: placeholder }}
          tabIndex={tabIndex}
          className={
            touched && error
              ? className + ' error'
              : className + ' padding-right-4'
          }
        />

        <button
          className="btn btn-fsz-18 js-copy-btn"
          id="button_copy"
          type="button"
          onClick={onClickCopy.bind(this, input.value)}
        >
          <Translate content="sign_up.copy_btn" />
        </button>
      </div>
      {touched && error && <div className="error__hint">{error}</div>}
    </div>
  );
};

const renderRetypePasswordField = ({
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  meta: { touched, error, dirty }
}) => {
  return (
    <div className="text-uppercase container">
      <label className="signinLabel">
        <Translate content="sign_up.reenter_password" />
      </label>
      <div className="d-flex align-item-center">
        <i className="fas fa-unlock-alt signinIcon" aria-hidden="true" />
        <Translate
          component="input"
          autoComplete="off"
          {...input}
          type={type}
          placeholder={placeholder}
          tabIndex={tabIndex}
          className={touched && error ? className + ' error' : className}
          attributes={{ placeholder: placeholder }}
        />
      </div>
      {touched && error && <div className="error__hint">{error}</div>}
    </div>
  );
};

const renderCheckboxField = ({
  id,
  pseudoText,
  tabIndex,
  className,
  errors,
  placeholder,
  input,
  label,
  type,
  meta: { touched, error, dirty }
}) => {
  return (
    <div
      className={classNames('form-check c-black', { checked: input.checked })}
    >
      <input
        id={id}
        autoComplete="off"
        {...input}
        type={type}
        placeholder={placeholder}
        tabIndex={tabIndex}
        className={touched && error ? className + ' error' : className}
      />
      <label className="text-left form-check-label text-white" htmlFor={id}>
        {pseudoText}
      </label>
      {/*(dirty) && error && <span className="error__hint">{error}</span>*/}
      {/*!error && errors && errors.length ? errors.map((err) => { return <span className="error__hint" key={err}>{err}</span>}) : null*/}
    </div>
  );
};

const hiddenField = ({ input }) => (
  <div style={{ display: 'none' }}>
    <input {...input} type="text" />
  </div>
);

const renderRecoveryButtonFields = fields => {
  return (
    <div>
      <div className="loginCreate__btnWrap text-center">
        <button
          className="btn-forward"
          id="button_download_recovery"
          type="button"
          onClick={fields.onClick.bind(this, fields.password.input.value)}
          disabled={!fields.password.meta.valid}
        >
          <Translate className="btnText" content="sign_up.download_btn" />
        </button>
      </div>
    </div>
  );
};

const normalizeAccount = (value, previousValue) => {
  if (!value.length) {
    return value;
  }

  if (/[^A-Za-z0-9-]/.test(value) || value.length > 63) {
    return previousValue && previousValue.toLowerCase();
  }

  return value.toLowerCase();
};

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTermsHidden: false,
      isUserNameHidden: true,
      isPasswordCopyHidden: true,
      isPasswordHidden: true
    };
  }

  componentWillMount() {
    this.handleInitialize();
  }

  handleInitialize() {
    this.props.initialize({
      password: RandomString.generate({
        length: 52,
        charset: 'alphanumeric'
      }),
      password_retype: '',
      secure: false,
      understand: false
    });
  }

  toggleUsername() {
    this.setState({
      isTermsHidden: !this.state.isTermsHidden,
      isUserNameHidden: !this.state.isUserNameHidden,
      isPasswordHidden: true,
      isPasswordCopyHidden: true
    });
    this.props.asyncValidate();
  }

  togglePasswordCopy() {
    this.setState({
      isTermsHidden: true,
      isUserNameHidden: !this.state.isUserNameHidden,
      isPasswordCopyHidden: !this.state.isPasswordCopyHidden,
      isPasswordHidden: true
    });
  }

  togglePassword() {
    this.setState({
      isTermsHidden: true,
      isUserNameHidden: true,
      isPasswordCopyHidden: !this.state.isPasswordCopyHidden,
      isPasswordHidden: !this.state.isPasswordHidden
    });
  }
  onClickDownload(val) {
    let blob = new Blob([val], {
      type: 'text/plain'
    });

    saveAs(blob, 'account-recovery-file.txt');
    this.props.change('downloadedfile', 'yes');
  }

  onClickCopy(password) {
    copy(password);
  }

  onClickLogin(e) {
    this.props.onClickLogin();
    e.preventDefault();
  }

  render() {
    const password_info = counterpart('sign_up.password_info_text');

    const {
      handleSubmit,
      registerStatus,
      errors,
      invalid,
      asyncValidating,
      submitting
    } = this.props;
    let syncError = this.props.invalid;

    if (this.props.fValues.registerAccountForm) {
      if (
        this.props.fValues.registerAccountForm.values['password_retype'] !==
          this.props.fValues.registerAccountForm.values['password'] ||
        this.props.fValues.registerAccountForm.values['secure'] == false ||
        this.props.fValues.registerAccountForm.values['understand'] == false
      ) {
        syncError = true;
      } else {
        syncError = false;
      }
    }

    let CreateButton;

    switch (registerStatus) {
      case 'default':
        CreateButton = (
          <button
            className="btn-forward accountbtnContainer"
            id="button_create_account"
            type="submit"
            disabled={syncError || invalid || submitting || asyncValidating}
          >
            <Translate content="sign_up.create_btn" />
          </button>
        );

        break;
      case 'loading':
        CreateButton = (
          <button
            className="btn btn-fsz-18 btn-loader accountbtnContainer"
            id="button_create_account"
            type="button"
            disabled={true}
          >
            <span className="loader loader-white loader-xs" />
            <Translate content="sign_up.create_btn" />
          </button>
        );

        break;
      case 'done':
        CreateButton = (
          <button
            className="btn btn-fsz-18 accountbtnContainer"
            id="button_create_account"
            disabled={true}
          >
            <span className="loaderIcon icon-verify" />
            <Translate className="btnText" content="sign_up.done" />
          </button>
        );

        break;
    }

    let step1Paragraph = (
      <div>
        <p><Translate content="sign_up.step1" /></p>
        <p><Translate content="sign_up.step1-message" />
          </p>
      </div>
    );

    let step2Paragraph = (
      <div>
        <p><Translate content="sign_up.step2" /></p>
        <p><Translate content="sign_up.step2-message1" /></p>
        <p><Translate content="sign_up.step2-message2" /></p>
        <ul className="signup-rules-landing">
          <li><Translate content="sign_up.step2-bullet1" /></li>
          <li><Translate content="sign_up.step2-bullet2" /></li>
          <li><Translate content="sign_up.step2-bullet3" /></li>
          <li><Translate content="sign_up.step2-bullet4" /></li>
        </ul>
      </div>
    );

    let step3Paragraph = (
      <div>
        <p><Translate content="sign_up.step3" /></p>
        <p><Translate content="sign_up.step3-message1" /></p>
        <p><Translate content="sign_up.step3-message2" />
        </p>
      </div>
    );

    let step4Paragraph = (
      <div>
        <p><Translate content="sign_up.step4" /></p>
        <p><Translate content="sign_up.step4-message1" /></p>
        <p><Translate content="sign_up.step4-message2" /></p>
      </div>
    );
    let imageDisplayed;
    !this.state.isTermsHidden ? imageDisplayed = tutorialWizard1 : null;
    !this.state.isUserNameHidden ? (imageDisplayed = tutorialWizard2) : null;
    !this.state.isPasswordCopyHidden ? imageDisplayed = tutorialWizard3 : null;
    !this.state.isPasswordHidden ? (imageDisplayed = tutorialWizard4) : null;

    return (
      <div className="row no-margin height-35">
        <div className="col-6 d-flex p-0 flex-column align-items-stretch">
          <img
            src={imageDisplayed}
            alt="croupier"
            className="d-block width-100 mb-3"
          />
          <div className="px-3 text-white">
            <div>
              <h3 className="text-golden text-uppercase text-bold text-center">
              <Translate content="sign_up.sign-up-header" />
              </h3>
              
            </div>
            {!this.state.isTermsHidden && step1Paragraph}
            {!this.state.isUserNameHidden && step2Paragraph}
            {!this.state.isPasswordCopyHidden && step3Paragraph}
            {!this.state.isPasswordHidden && step4Paragraph}
          </div>
        </div>
        <div className="col-6 p-0 darkGrey-mirror">
          <form onSubmit={handleSubmit} className="width-100">
            <Field name="downloadedfile" component={hiddenField} />
            {!this.state.isTermsHidden && (
              <div id="termsSection">
                <Field
                  name="termsConditions"
                  className="form-control termsInput"
                  className1="d-block text-capitalize text-center font-weight-bold"
                  className2="d-block text-normal"
                  component={renderTermsField}
                />
                <div className="container d-flex justify-content-center margin-top-md">
                  <button
                    className="btn-back accountbtnContainer"
                    type="button"
                    id="button_decline"
                    onClick={this.props.declineTerms}
                  >
                    <Translate content="sign_up.decline_btn_text" />
                  </button>
                  <button
                    className="btn-forward accountbtnContainer"
                    type="button"
                    id="button_accept"
                    onClick={this.toggleUsername.bind(this)}
                  >
                    <Translate content="sign_up.accept_btn_text" />
                  </button>
                </div>
              </div>
            )}
            {!this.state.isUserNameHidden && (
              <div className="mx-auto">
                <div className="darkGrey">
                  <h3 className="text-golden text-uppercase text-bold text-center mt-3 ">
                    Username
                  </h3>
                  
                </div>
                <Field
                  name="accountName"
                  className="form-control signinInput"
                  errors={errors}
                  iconClass="fas fa-user signinIcon"
                  component={renderField}
                  placeholder="sign_up.account_placeholder"
                  type="text"
                  normalize={normalizeAccount}
                  tabIndex="2"
                />
                <div className="container d-flex justify-content-center margin-top-md">
                  <button
                    className="btn-back accountbtnContainer"
                    type="button"
                    id="button_back"
                    onClick={this.toggleUsername.bind(this)}
                  >
                    <Translate content="sign_up.back_btn_text" />
                  </button>
                  <button
                    className="btn-forward accountbtnContainer"
                    type="button"
                    id="button_continue"
                    onClick={this.togglePasswordCopy.bind(this)}
                    disabled={invalid || submitting || asyncValidating}
                  >
                    <Translate content="sign_up.continue_btn_text" />
                  </button>
                </div>
              </div>
            )}

            {!this.state.isPasswordCopyHidden && (
              <div>
                <div className="darkGrey">
                  <h3 className="text-golden text-uppercase text-bold text-center mt-3 ">
                    Password
                  </h3>
                  
                </div>
                <Field
                  name="password"
                  className="form-control signinInput"
                  errors={errors}
                  component={renderPasswordField}
                  placeholder="sign_up.password_placeholder"
                  type="text"
                  onClickCopy={this.onClickCopy.bind(this)}
                  tabIndex="3"
                />

                <Field
                  name="password_retype"
                  className="form-control signinInput"
                  errors={errors}
                  component={renderRetypePasswordField}
                  placeholder="sign_up.password_placeholder"
                  type="text"
                  tabIndex="4"
                />
                <div className="container d-flex justify-content-center margin-top-md">
                  <button
                    className="btn-back accountbtnContainer"
                    type="button"
                    id="button_back"
                    onClick={this.togglePasswordCopy.bind(this)}
                  >
                    <Translate content="sign_up.back_btn_text" />
                  </button>
                  <button
                    className="btn-forward accountbtnContainer"
                    type="button"
                    id="button_continue"
                    onClick={this.togglePassword.bind(this)}
                    disabled={
                      this.props.fValues.registerAccountForm.values[
                        'password_retype'
                      ] !==
                      this.props.fValues.registerAccountForm.values['password']
                    }
                  >
                    <Translate content="sign_up.continue_btn_text" />
                  </button>
                </div>
              </div>
            )}

            {!this.state.isPasswordHidden && (
              <div>
                <div className="darkGrey mt-4">
                  <h3 className="text-golden text-uppercase text-bold text-center  mt-3 ">
                  <Translate content="sign_up.save-password" />
                  </h3>
                  
                </div>
                <div className="pt-4 pb-4 text-center px-4">
                  <label className="text-white"><Translate content="sign_up.your-password" /></label>
                  <span className="hilite-yellow">
                    {this.props.fValues.registerAccountForm.values['password']}
                  </span>
                </div>

                <div className="container recoveryContainer">
                  <Fields
                    names={['password']}
                    component={renderRecoveryButtonFields}
                    onClick={this.onClickDownload.bind(this)}
                  />
                </div>
                <div className="container checkContainer">
                  <div className="loginCreate__check">
                    <Field
                      name="understand"
                      id="understand"
                      component={renderCheckboxField}
                      className="form-check-input"
                      type="checkbox"
                      pseudoText={<Translate content="sign_up.pseudoText1" />}
                    />
                  </div>

                  <div className="loginCreate__check">
                    <Field
                      name="secure"
                      id="secure"
                      component={renderCheckboxField}
                      className="form-check-input"
                      type="checkbox"
                      pseudoText={<Translate content="sign_up.pseudoText2" />}
                    />
                  </div>
                </div>
                <div className="container text-center accountbtnContainer">
                  <div className="container d-flex justify-content-center margin-top-md">
                    <button
                      className="btn-back accountbtnContainer"
                      type="button"
                      id="button_back"
                      onClick={this.togglePassword.bind(this)}
                      disabled={
                        submitting ||
                        asyncValidating ||
                        registerStatus == 'loading'
                      }
                    >
                      <Translate content="sign_up.back_btn_text" />
                    </button>
                    {CreateButton}
                  </div>

                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

// Decorate the form component
export default (SignUpForm = reduxForm({
  form: 'registerAccountForm', // a unique name for this form,
  fields: [
    'accountName',
    'password',
    'password_retype',
    'secure',
    'understand'
  ],
  validate: function submit(values) {
    let errors = {},
      MAX_PASSWORD_CHARACTERS = 22;

    let accountError = ChainValidation.is_account_name_error(
      values.accountName
    );

    if (!values.accountName)
      errors.accountName = <Translate content="errors.field_is_required" />;
    else if (values.accountName && values.accountName.length >= 64)
      errors.accountName = <Translate content="errors.username_max_length" />;
    else if (
      values.accountName &&
      values.accountName.substr(values.accountName.length - 1) === '-'
    )
    errors.accountName = <Translate content="errors.username_dash_end" />;
    else if (
      values.accountName &&
      values.accountName.endsWith('-dividend-distribution')
    )
      errors.accountName = <Translate content="errors.username_dividend" />;
    else if (
      values.accountName &&
      accountError == 'Account name should have only one dash in a row.'
    ) {
      errors.accountName = <Translate content="errors.username_double_dash" />; // no 2 dashes;
    } else if (values.accountName[0].toLowerCase() == values.accountName[0].toUpperCase()) {
      errors.accountName = <Translate content="errors.username_start_letter" />; // start with letter;
    } else {
      if (
        values.accountName &&
        !ChainValidation.is_cheap_name(values.accountName)
      ) {
         errors.accountName = <Translate content="errors.login_error" />;//<Translate content="errors.premium_name_faucet" />;
      }
    }

    if (!values.password || values.password.length < MAX_PASSWORD_CHARACTERS) {
      errors.password = (
        <Translate
          content="errors.password_must_be_X_characters_or_more"
          cnt={MAX_PASSWORD_CHARACTERS}
        />
      );
    }

    if (values.password_retype && values.password !== values.password_retype) {
      errors.password_retype = (
        <Translate content="errors.password_retype_match" />
      );
    }

    if (!values.downloadedfile) {
      errors.secure = <Translate content="errors.must_download_recovery" />;
    }

    if (!values.understand) {
      errors.understand = <Translate content="errors.field_is_required" />;
    }

    if (!values.secure) {
      errors.secure = <Translate content="errors.field_is_required" />;
    }

    return errors;
  },
  asyncValidate: values => {
    return AccountRepository.lookupAccounts(values.accountName, 100).then(
      result => {
        let account = result.find(a => a[0] === values.accountName);

        if (account) {
          throw { accountName: <Translate content="errors.name_is_taken" /> };
        }
      }
    );
  },
  asyncBlurFields: ['accountName'],
  destroyOnUnmount: false,
})(SignUpForm));
