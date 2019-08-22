import React from "react";
import Translate from "react-translate-component";

const NavLinkText = props => {
  return (
    <div className="flex">
      <div id="divDashboard" className="margin-right-sm">
        <i className={"fas " + props.icon} />
      </div>
      <span>
        <Translate
          component="span"
          content={props.text}
          className="uppercase"
        />
      </span>
    </div>
  );
};

export default NavLinkText;
