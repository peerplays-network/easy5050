import React from 'react';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import { Field, change, registerField, unregisterField } from 'redux-form';
import PropTypes from 'prop-types';

import AppActions from 'actions/AppActions';

@connect(
    state => ({
        winnerPercents: Object.values(state.form.drawApplicationForm.registeredFields).filter(field => ~field.name.indexOf('winnerPercent')),
        globalFee: state.app.globalProperties ?state.app.globalProperties.parameters.extensions[1].sweeps_distribution_percentage / 100 : '-',
        ticketsAmount: state.form.drawApplicationForm.values.tickets
    }),
    dispatch => ({
        removeField: fieldName => {
            dispatch(change('drawApplicationForm', fieldName, ''));
            dispatch(unregisterField('drawApplicationForm', fieldName));
            dispatch(unregisterField('drawApplicationForm', fieldName));
        },
        addField: fieldName => {
            dispatch(registerField('drawApplicationForm', fieldName, 'Field'));
            dispatch(change('drawApplicationForm', fieldName, ''));
        },
        resetForm: winnerPercentsNames => {
            winnerPercentsNames.forEach(name => {
                dispatch(unregisterField('drawApplicationForm', name));
                dispatch(unregisterField('drawApplicationForm', name));
            });
        },
        setGlobalProperties: () => dispatch(AppActions.setGlobalProperties())
    })
)

export default class Winners extends React.Component {

    componentWillMount() {
        this.props.setGlobalProperties();
    }

    componentWillReceiveProps(newProps) {

        if (newProps.resetCounter !== this.props.resetCounter) {

            this.props.resetForm(newProps.winnerPercents.slice(1).map(field => field.name));
        }
    }

    shouldComponentUpdate(newProps) {

        return (
            !fromJS(newProps.winnerPercents).equals(fromJS(this.props.winnerPercents)) ||
            newProps.globalFee !== this.props.globalFee ||
            newProps.ticketsAmount !== this.props.ticketsAmount
        );
    }

    onIncreaseAmountOfPercents(fieldName) {

        const { ticketsAmount, winnerPercents } = this.props;

        if (ticketsAmount > winnerPercents.length) {
            this.props.addField(fieldName);
        }
    }

    onDeletePercent(fieldName) {
        this.props.removeField(fieldName);
    }

    percentField = ({ input, lastFieldNumber, index, meta: { error, touched } }) => {

        return (
            <div className="row flex align-bottom three">
                <div className="row__item">
                    <Translate content="creating_lottery.%_of_jackpot" component="div" className="label" />
                    <div className="field__wrap w-400">
                        <input
                            { ...input }
                            className={ `field ${ touched && error ? 'error' : '' }` }
                            type="text"
                            autoComplete="off"
                            placeholder={ counterpart.translate('creating_lottery.enter_value') }
                        />
                        {   
                            error && touched ?
                                <span className="error__text pos-abs">
                                    { error }
                                </span> : null
                        }
                    </div>
                </div>
                <div className="row__item">
                    {
                        !index ?
                        <button
                            className="btn btn-add"
                            type="button"
                            onClick={ this.onIncreaseAmountOfPercents.bind(this, `winnerPercent${ lastFieldNumber + 1 }`) }
                        >
                            <i className="icon-plus" />
                            &nbsp;
                            <Translate component="span" content="creating_lottery.add_another" />
                        </button> :
                        <div className="row__item">
                            <a
                                role="button"
                                className="btn btn-del pointer"
                                onClick={ this.onDeletePercent.bind(this, input.name) }
                            >
                                <i className="icon-remove" />
                            </a>
                        </div>
                    }
                </div>
            </div>
        )
    }

    render() {

        const { winnerPercents, globalFee } = this.props;

        return (
            <section className="form__section">
                <div className="form__sectionHeading">
                    <Translate content="creating_lottery.winners" component="div" className="form__sectionTitle" />
                </div>
                <Translate
                    content="creating_lottery.rake_of_the_jackpot"
                    component="div"
                    className="form__sectionNote"
                    span={ <span className="mark">{ globalFee } %</span> }
                />
                <Field
                    name="winnerPercent0"
                    component={ this.percentField }
                    lastFieldNumber={
                        winnerPercents.length ? Number(winnerPercents[winnerPercents.length - 1].name.split('winnerPercent')[1]) : 0
                    }
                    index={ 0 }
                />
                {
                    winnerPercents.slice(1).map((field, index) => (
                        <Field
                            name={ field.name }
                            component={ this.percentField }
                            key={ field.name }
                            index={ index + 1 }
                        />
                    ))
                }
            </section>
        );
    }

    static propTypes = {
        resetCounter: PropTypes.number.isRequired,

        addField: PropTypes.func.isRequired,
        removeField: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired
    }
}
