import React from 'react';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';

const HistoryThead = ({
    field: {
        label,
        name,
        path
    },
    sortedField,
    direction,
    sortAccountHistory
}) => {

    const sortHistory = (e) => {
        e.preventDefault();
        sortAccountHistory(name, direction === 'asc' ? 'desc' : 'asc', path);
    }

    return (
        <div>
            <a href="" onClick={sortHistory} className={`table__sortingTrigger ${
            sortedField === name ? direction : '' }`}
            >
                <Translate component="div" className="Col-Header" content={`history.${label}`} />
                
                <div className="small-frame">
                    <div className={`up-arrow  ${
                        sortedField === name && direction == 'asc'
                        ? 'selected'
                        : 'unselected'
                    }`}
                    >
                        &#9650;
                    </div>
                    <div className={`down-arrow ${
                        sortedField === name && direction == 'desc'
                        ? 'selected'
                        : 'unselected'
                    }`}
                    >
                        &#9660;
                    </div>
                </div>
            </a>
        </div>
    );
};

HistoryThead.propTypes = {
    field: PropTypes.shape({
        label: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        path: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape()
        ])
    }),
    sortedField: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    sortAccountHistory: PropTypes.func.isRequired
};

export default HistoryThead;
