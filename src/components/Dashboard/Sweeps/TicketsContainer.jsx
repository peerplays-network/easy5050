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

import CurrentTickets from './CurrentTickets';
import PreviousTickets from './PreviousTickets';

import { NavLink } from 'react-router-dom';
import {
  Tooltip,
} from 'react-tippy';
import '../../../../assets/scss/styles.css';

function mapStateToProps (state) {
    const textFilter = state.sweeps.get('previousTicketsTextFilter');
    return {
      textFilter
    }
  }
  
  function mapDispatchToProps (dispatch) {
    return {
      filterChange: text =>
        dispatch(LotteryActions.filterPreviousUserTickets(text))
    }
  }
  
  @connect(mapStateToProps, mapDispatchToProps)   
export default class TicketsContainer extends React.Component {

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
          <CurrentTickets />
            <div className="darkGrey filters">
              <div className="container padding-zero">
                <div className="d-flex margin-zero row m-0">
                  <div className="col-md-9 d-flex align-items-center margin-zero sweeps-header pt-3 pb-3">
                    <span><Translate content="sweeps.previous-tickets" /></span>
                  </div>
                  <div className="col-md-3 criteriaTextSearch margin-zero">
                    <input
                      id="textFilter"
                      className="txtSearch drawNameSearch colorMyBackBlack input-page-string text-uppercase"
                      type="text"
                      value={textFilter}
                      onChange={(e) => {this.props.filterChange(e.target.value)}}
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
              <PreviousTickets 
              textFilter={this.props.textFilter}
              />
          </div>
        );
    }
}