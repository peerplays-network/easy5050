import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Translate from 'react-translate-component';
import { Route, Switch } from 'react-router-dom';

import Creation from './Creation';
import Purchase from './Purchase';

@connect(
  state => ({
    location: state.router.location.pathname.split('/')[1]
  }),
  dispatch => ({})
)
class TermsBar extends React.Component {
  render() {
    const { location } = this.props;

    if (location == 'terms') {
      return (
        <div className="darkGrey filters center pt-2 pb-2">
          <NavLink to={`/terms/purchase`} activeClassName="activeBar">
            <Translate
              component="div"
              content="terms_conditions.participate_terms_of_use"
            />
          </NavLink>
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;
          <NavLink to={`/terms/creation`} activeClassName="activeBar">
            <Translate
              component="div"
              content="terms_conditions.create_terms_of_use"
            />
          </NavLink>
        </div>
      );
    }

    return null;
  }
}

export default TermsBar;
