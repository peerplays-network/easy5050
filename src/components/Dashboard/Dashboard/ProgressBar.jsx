import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProgressBar extends Component {
    render() {
        return (
            <div className="progress-container d-inline-flex">
                <div className={(this.props.value >= 80) ? "progress glowGold" : "progress"}>
                    <div style={{width: this.props.value+'%'}}>
                        <div
                            className={(this.props.value >= 80 || this.props.timeValue <= 7200000 && this.props.timeValue > 0) ? "progress-bar glowGoldBar" : "progress-bar bg-golden"} 
                            role="progressbar" 
                            aria-valuenow={this.props.value} 
                            aria-valuemin="0" 
                            aria-valuemax="100"
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ProgressBar.propTypes = {
    value: PropTypes.number.isRequired
};

export default ProgressBar;