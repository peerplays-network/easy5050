import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AsideActions from 'actions/AsideActions';

import SweepsAside from './Sweeps/SweepsAside';

@connect(
    state => ({
        isOpened: state.aside.get('isOpened'),
        currentLocation: state.router.location.pathname,
        sweepAdvancedInfo: state.aside.get('sweepAdvancedInfo'),
        coreAsset: state.app.coreAsset
    }),
    dispatch => ({
        hideAside: () => dispatch(AsideActions.hideAside())
    })
)

export default class Aside extends React.Component {

    render() {

        const { isOpened, currentLocation, hideAside, sweepAdvancedInfo, coreAsset } = this.props;

        return (
            <aside className={ `aside ${ isOpened ? 'active' : '' }`}>
                <div className="aside__backdrop js-hide-aside" onClick={ hideAside } />
                {
                    currentLocation === '/draws/mydraws' && sweepAdvancedInfo.size ? <SweepsAside
                        hideAside={ hideAside }
                        core={coreAsset.toJS()}
                        info={ sweepAdvancedInfo.toJS() }
                    /> : null
                }
            </aside>
        )
    }

    static propTypes = {
        isOpened: PropTypes.bool.isRequired,
        currentLocation: PropTypes.string.isRequired,
    
        hideAside: PropTypes.func.isRequired
    }
}

