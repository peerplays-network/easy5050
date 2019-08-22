import React from 'react';
import PropTypes from 'prop-types';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import { Map } from 'immutable';
import 'react-tippy/dist/tippy.css'
import {
  Tooltip,
} from 'react-tippy';

const BenefactorField = ({
    input,
    meta: {
        touched,
        error,
        active
    },
    foundNames,
    isLoadingNames,
    userActiveWithDelay,
    onSetBenefactorName,
    getFormattedName
}) => {

    const foundNamesArray = foundNames.get(input.name) || [];

    active = userActiveWithDelay.get(input.name);

    return (
    <div className="text-uppercase width-100">


        <label htmlFor="benefactor" className="createDrawLabel">
                        <Translate content="creating_lottery.benefactors" /></label>
            <Tooltip
             // options
              title="The user who will receive the proceeds of the lottery"
              position="right"
              arrow="true"
            >            
                <input
                { ...input }
                type="text"
                autoComplete="off"
                className="form-control"
                placeholder={ counterpart.translate('creating_lottery.enter_user_name') }
                />
            </Tooltip>
       
        <div className="ddMenu">
                <ul className="ddMenu__list no-list">
                    {
                        active && foundNamesArray.length ? foundNamesArray.map(user => (
                            <li key={ user.name } className="ddMenu__li">
                                <a
                                    role="button"
                                    className="ddMenu__item"
                                    onClick={
                                        () => onSetBenefactorName(input.name, user)
                                    }
                                >
                                    {getFormattedName(user.name, input.value.toLowerCase())}
                                    
                                </a>
                            </li>
                        )) : null
                    }
                </ul>
            </div>
            {
                        error && touched ? <span className="error__hint pos-abs">
                          { error }
                                           </span> : null
                    }
    </div>);
};

BenefactorField.propTypes = {
    input: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
    meta: PropTypes.shape({
        touched: PropTypes.bool.isRequired,
        error: PropTypes.string,
        touched: PropTypes.bool.isRequired
    }),
    state: PropTypes.shape({ 
        foundNames: PropTypes.instanceOf(Map),
        isLoadingNames: PropTypes.bool.isRequired,
        userActiveWithDelay: PropTypes.instanceOf(Map)
    }),
    onSetBenefactorName: PropTypes.func.isRequired,
    getFormattedName: PropTypes.func.isRequired
};

export default BenefactorField;