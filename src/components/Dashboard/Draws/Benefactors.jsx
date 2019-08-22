import React from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import { Field, FormSection, change, unregisterField, registerField } from 'redux-form';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';

import AppActions from 'actions/AppActions';

import LotteryService from 'services/LotteryService';

import constants from 'constants/createDraw';

import PercentField from './Fields/PercentField';
import BenefactorField from './Fields/BenefactorField';

@connect(
    state => ({
        values: state.form.drawApplicationForm.values,
        benefactors: Object
        .entries(state.form.drawApplicationForm.values)
        .filter(benefactor => ~benefactor[0].indexOf('benefactor'))
        .map(benefactor => benefactor[1]),
        benefactorsLength: Object
        .entries(state.form.drawApplicationForm.values)
        .filter(field => ~field[0].indexOf('benefactor'))
        .length,
        registeredBenefactorsFields: Object
        .entries(state.form.drawApplicationForm.registeredFields)
        .filter((field, index) => ~field[0].indexOf('benefactor') && index % 2)
        .map(benefactor => benefactor[1])
    }),
    dispatch => ({
        changeBenefactor: (inputName, newAccount) => {

            dispatch(change('drawApplicationForm', inputName, newAccount.name));
            dispatch(change('drawApplicationForm', `${ inputName.split('.')[0] }.id`, newAccount.id || ''));
        },
        getAllAccounts: searchedString => dispatch(AppActions.getAllAccounts(searchedString)),
        removeField: fieldName => {

            dispatch(change('drawApplicationForm', fieldName, ''));
            dispatch(unregisterField('drawApplicationForm', `${ fieldName }.name`));
            dispatch(unregisterField('drawApplicationForm', `${ fieldName }.percent`));
            dispatch(unregisterField('drawApplicationForm', `${ fieldName }.name`));
            dispatch(unregisterField('drawApplicationForm', `${ fieldName }.percent`));
        },
        addField: fieldName => {

            dispatch(registerField('drawApplicationForm', fieldName, 'Field'));
            dispatch(change('drawApplicationForm', fieldName, ''));
        },
        resetForm: benefactorsNames => {
            benefactorsNames.forEach(name => {

                dispatch(unregisterField('drawApplicationForm', `${ name }.name`));
                dispatch(unregisterField('drawApplicationForm', `${ name }.percent`));
                dispatch(unregisterField('drawApplicationForm', `${ name }.name`));
                dispatch(unregisterField('drawApplicationForm', `${ name }.percent`));
            });
        }
    })
)

class Benefactors extends React.Component {

    constructor(props) {
        super(props);

        this.initialState = {
            foundNames: Map({}),
            isLoadingNames: false,

            userActiveWithDelay: Map({})
        };

        this.state = this.initialState;

        this.getFormattedName = this.getFormattedName.bind(this);
        this.onSetBenefactorName = this.onSetBenefactorName.bind(this);
        this.onLoadFilteringUser = this.onLoadFilteringUser.bind(this);
        this.onBlurUserField = this.onBlurUserField.bind(this);
        this.onFocusUserField = this.onFocusUserField.bind(this);
    }

    componentWillReceiveProps(newProps) {

        if (newProps.resetCounter !== this.props.resetCounter || !newProps.benefactorsLength) {
            this.setState({
                userActiveWithDelay: this.state.userActiveWithDelay
            });
        }

        if (newProps.resetCounter !== this.props.resetCounter) {
            newProps.resetForm(newProps.registeredBenefactorsFields.slice(1).map(benefactor => benefactor.name.split('.')[0]));
        }
    }

    onIncreaseAmountOfBenefactors() {

        const { registeredBenefactorsFields } = this.props;
        const lastBenefactorNumber =
        registeredBenefactorsFields.length ?
            registeredBenefactorsFields[registeredBenefactorsFields.length - 1].name.split('.')[0].split('benefactor')[1] : 0;

        this.props.addField(`benefactor${ Number(lastBenefactorNumber) + 1 }.name`);
        this.props.addField(`benefactor${ Number(lastBenefactorNumber) + 1 }.percent`);
    }

    onDeleteBenefactor(fieldName) {

        this.setState(prevState => ({
            foundNames: prevState.foundNames.remove(`${ fieldName }.name`)
        }));

        this.props.removeField(fieldName);
    }

    onLoadFilteringUser(e) {

        this.props.changeBenefactor(e.target.name, {
            name: e.target.value
        });

        if (!e.target.value) {

            return this.setState(prevState => ({
                foundNames: prevState.foundNames.set(e.target.name, [])
            }));
        }

        return this.props.getAllAccounts(e.target.value.toLowerCase())
        .then(accountList => {

            const { benefactors } = this.props;

            accountList = this.filterUsers(e.target.value.toLowerCase(), accountList, benefactors);

            this.setState(prevState => ({
                foundNames: prevState.foundNames.set(e.target.name, accountList),
                userActiveWithDelay: prevState.userActiveWithDelay.set(e.target.name, true)
            }));
        });
    }

    onBlurUserField(e) {
        setTimeout(() => {
            this.setState(prevState => ({
                userActiveWithDelay: prevState.userActiveWithDelay.set(e.target.name, false),
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
            userActiveWithDelay: prevState.userActiveWithDelay.set(e.target.name, true)
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
                { name.substr(0, test.index) }
                <span className="find">
                    { searchValue }
                </span>
                { name.substr(test.index + searchValue.length) }
            </span>
        );
    }

    filterUsers(filteringString, users, benefactors) {
        
        return users
        .map(user => ({
            name: user[0],
            id: user[1]
        }))
        .filter(user => {
            return ~user.name.indexOf(filteringString) && 
                    !benefactors.find(benefactor => benefactor.name === user.name && benefactor.id === user.id);
        });
    }

    render() {

        const { foundNames, isLoadingNames, userActiveWithDelay } = this.state;
        const { registeredBenefactorsFields } = this.props;

        return (
            <section className="form__section">
                <div className="form__sectionHeading">
                    <Translate component="div" content="creating_lottery.benefactors" className="form__sectionTitle" />
                </div>
                <FormSection
                    name="benefactor0"
                    className="row flex align-bottom three"
                >
                    <Field
                        name="name"
                        component={ BenefactorField }
                        numberOfRow={ 0 }
                        foundNames={ foundNames }
                        isLoadingNames={ isLoadingNames }
                        userActiveWithDelay={ userActiveWithDelay }
                        getFormattedName={ this.getFormattedName }
                        onSetBenefactorName={ this.onSetBenefactorName }
                        onChange={ this.onLoadFilteringUser }
                        onBlur={ this.onBlurUserField }
                        onFocus={ this.onFocusUserField }
                    />
                    <Field
                        name="percent"
                        component={ PercentField }
                    />
                    {
                        <div className="row__item">
                            <button
                                className="btn btn-add"
                                type="button"
                                onClick={ this.onIncreaseAmountOfBenefactors.bind(this) }
                            >
                                <i className="icon-plus" />
                                &nbsp;
                                <Translate component="span" content="creating_lottery.add_another" />
                            </button>
                        </div>
                    }
                </FormSection>
                {
                    registeredBenefactorsFields.slice(1).map((item, index) => (
                        <FormSection
                            name={ item.name.split('.')[0] }
                            key={ String(index) }
                            className="row flex align-bottom three"
                        >
                            <Field
                                name="name"
                                component={ BenefactorField }
                                numberOfRow={ index }
                                foundNames={ foundNames }
                                isLoadingNames={ isLoadingNames }
                                userActiveWithDelay={ userActiveWithDelay }
                                getFormattedName={ this.getFormattedName }
                                onSetBenefactorName={ this.onSetBenefactorName }
                                onChange={ this.onLoadFilteringUser }
                                onBlur={ this.onBlurUserField }
                                onFocus={ this.onFocusUserField }
                            />
                            <Field
                                name="percent"
                                component={ PercentField }
                            />
                            <div className="row__item">
                                <a
                                    role="button"
                                    className="btn btn-del pointer"
                                    onClick={ this.onDeleteBenefactor.bind(this, item.name.split('.')[0]) }
                                >
                                    <i className="icon-remove" />
                                </a>
                            </div>
                        </FormSection>
                    ))
                }
            </section>
        );
    }
}

Benefactors.PropTypes = {
    drawApplicationForm: PropTypes.shape({
        resolution: PropTypes.oneOf(Object.values(constants.RADIO_BUTTONS)),
        time: PropTypes.string,
        endDate: PropTypes.number,
        name: PropTypes.string,
        tickets: PropTypes.string,
        date: PropTypes.string,
        price: PropTypes.string,
        benefactor0: PropTypes.shape({
            name: PropTypes.string,
            percent: PropTypes.string
        }),
        winnerPercent0: PropTypes.string
    }).isRequired,
    benefactorsLength: PropTypes.number.isRequired,
    resetCounter: PropTypes.number.isRequired,
    registeredBenefactorsFields: PropTypes.array.isRequired,
    benefactors: PropTypes.array.isRequired,

    changeBenefactor: PropTypes.func.isRequired,
    getAllAccounts: PropTypes.func.isRequired,
    addField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
};

export default Benefactors;
