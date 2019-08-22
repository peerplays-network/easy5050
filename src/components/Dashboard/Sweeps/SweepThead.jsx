import React from 'react';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';

const SweepsThead = ({
  sortedField,
  direction,
  sortUserLotteries,
  field: { name, label, path }
}) => {
  const sortLotteries = (e) =>{
    e.preventDefault();
    sortUserLotteries(name, direction === 'asc' ? 'desc' : 'asc', path);
  };

  return (
    <th scope="col">
      <a href="" onClick={sortLotteries} className={`table__sortingTrigger ${
          sortedField === name ? direction : ''
        }`}
      >
        <div className="table-head-container">
          <Translate component="div" content={`sweeps.${label}`} className="Col-Header" />
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
        </div>
      </a>
    </th>
  );
};

SweepsThead.propTypes = {
  sortedField: PropTypes.string.isRequired,
  direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
  sortUserLotteries: PropTypes.func.isRequired,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    path: PropTypes.oneOfType([PropTypes.array, PropTypes.shape()]).isRequired
  })
};

export default SweepsThead;
