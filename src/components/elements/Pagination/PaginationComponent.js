import React, { Component } from 'react';
import Translate from 'react-translate-component';
import PropTypes from 'prop-types';
import constants from 'constants/tables';

class PaginationComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-flex align-items-center justify-content-around">
        <Translate
          component="span"
          content="navigation.pages"
          className="text-uppercase text-dark"
        />
        <div className="d-flex align-items-center">
          <i
            className={
              this.props.currentPage > 1
                ? 'fas fa-chevron-left font-size-bigger mx-3 enabled'
                : 'fas fa-chevron-left font-size-bigger mx-3 disabled'
            }
            onClick={this.props.onSetPreviousPage}
          />
          <span className="text-dark">
            {this.props.amountOfItems ? this.props.currentPage : 1}
            &nbsp;
            <Translate component="span" content="navigation.of" />
            &nbsp;
            {Math.ceil(
              (this.props.amountOfItems ? this.props.amountOfItems : 1) /
                constants.LIMIT
            )}
          </span>

          <i
            className={
              this.props.currentPage >=
              Math.ceil(this.props.amountOfItems / constants.LIMIT)
                ? 'fas fa-chevron-right font-size-bigger mx-3 disabled'
                : 'fas fa-chevron-right font-size-bigger mx-3 enabled'
            }
            onClick={this.props.onSetNextPage}
          />
        </div>
      </div>
    );
  }
}

PaginationComponent.propTypes = {
  currentPage: PropTypes.number,
  onSetPreviousPage: PropTypes.func,
  amountOfItems: PropTypes.number,
  onSetNextPage: PropTypes.func
};

export default PaginationComponent;
