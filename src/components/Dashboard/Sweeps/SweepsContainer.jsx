import React from 'react';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { List } from 'immutable';
import PropTypes from 'prop-types';
import moment from 'moment';
import counterpart from 'counterpart';

import LotteryActions from 'actions/LotteryActions';
import AsideActions from 'actions/AsideActions';
import DashboardActions from 'actions/DashboardActions';

import Create from '../Draws/CreateContainer'
import CurrentSweeps from './CurrentSweeps';
import PreviousSweeps from './PreviousSweeps';

import { NavLink } from 'react-router-dom';
import {
  Tooltip,
} from 'react-tippy';
import '../../../../assets/scss/styles.css';

function mapStateToProps (state) {
  const textFilter = state.sweeps.get('previousLotteriesTextFilter');
  return {
    textFilter
  }
}

function mapDispatchToProps (dispatch) {
  return {
    filterChange: text =>
      dispatch(LotteryActions.filterPreviousUserLotteries(text))
  }
}

@connect(mapStateToProps, mapDispatchToProps)   
export default class SweepsContainer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            createDrawModalVisible: false,
        };
    }

// <NavLink
//             id="fifty"
//             to={`/draws/mydraws`}//to={`/draws/create`}
//             className="nav__item"
//             activeClassName="activeMenu"
//           >

    openModal() {
        this.setState({
            createDrawModalVisible: true
        });
    }

    closeModal() {
        this.setState({
            createDrawModalVisible: false
        })
    }

    textFilterChange(text) {
        this.props.filterChange(text);
        //this.props.textFilterChange(text);
        //this.setState({textFilter: e.target.value});
    }

    render() {
        const { textFilter } = this.props
      return(
        <div>
          <CurrentSweeps />
            <div className="darkGrey filters">
            <Create 
                visible={this.state.createDrawModalVisible}
                hide={this.closeModal.bind(this)}
            />
              <div className="container padding-zero">
                <div className="d-flex margin-zero row m-0">
                  <div className="col-md-5 d-flex align-items-center margin-zero sweeps-header pt-3 pb-3">
                    <span><Translate content="sweeps.previous-draws" /></span>
                  </div>
                  <div className="col-md-4 d-flex align-items-center pt-3 pb-3">
                        <button className="btn-forward" onClick={this.openModal.bind(this)}><Translate content="sweeps.create-draw-btn" /></button>
                  </div>
                  <div className="col-md-3 criteriaTextSearch margin-zero">
                    <input
                      id="textFilter"
                      className="txtSearch drawNameSearch colorMyBackBlack input-page-string text-uppercase"
                      type="text"
                      value={textFilter}
                      onChange={(e) => {this.props.filterChange(e.target.value);}}
                      placeholder={counterpart.translate(
                        'navigation.search_placeholder'
                      )}
                    />
                    <Tooltip
                    // options
                    title="Enter the name of a draw to narrow down your search"
                    position="bottom"
                    arrow="true"
                    distance="20"
                    >
                      <i className="fas fa-search ml-2" />
                    </Tooltip>
                  </div>
                </div> 
              </div> 
            </div>
              <PreviousSweeps 
              textFilter={this.props.textFilter} // red herring code
              />
          </div>
        );
    }
}
