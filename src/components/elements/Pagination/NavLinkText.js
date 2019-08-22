import React from 'react';
import Translate from 'react-translate-component';

const NavLinkText = props => {
  return (
    <div className={'flex ' + props.padding}>
      <div
        id="divDashboard"
        className={
          props.textTransform
            ? 'margin-right-md ' + props.textTransform
            : 'margin-right-md'
        }
      >
        <i className={props.icon} />
      </div>
      <span>
        <Translate
          component="span"
          content={props.text}
          className={!props.textTransform ? 'uppercase' : props.textTransform}
        />
      </span>
    </div>
  );
};

export default NavLinkText;
