import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';

const PercentField = ({ input, meta: { touched, error }}) => {

    const numberOfRow = Number(input.name.split('percentForBenefactor')[1]);

    return (
        <div className="row__item">
            <Translate component="div" className="label" content="creating_lotery.%_of_jackpot" />
            <div className="field__wrap w-400">
                <input
                    { ...input }
                    type="text"
                    autoComplete="off"
                    className={ `field ${ touched && error ? 'error' : '' }` }
                    placeholder={ counterpart.translate('creating_lotery.enter_value') }
                />
                {
                    error && touched ?
                        <span className="error__text pos-abs">
                            { error }
                        </span> : null
                }
            </div>
        </div>
    );
};

PercentField.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string.isRequired
    }),
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string
    })
};

export default PercentField;
