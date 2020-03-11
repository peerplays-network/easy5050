import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <div className="logo__box black">
        <div className="container text-center">
            <Link to="/sign-in" className="align-items-center black">
                <img className="easy5050" src="/images/canada_games_logo.png" alt="" />
          </Link>
      </div>
  </div>
);
