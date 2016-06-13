import { Component, PropTypes } from "react";

import Discover from "apollos/core/blocks/discover";

const Template = () => {
  return (
    <div className="background--light-primary locked-ends locked-sides scrollable soft-double-bottom">
      <div className="soft-bottom">
        <Discover />
      </div>
    </div>
  );
}

const Routes = [
  {
    path: "/discover",
    component: Template,
  },
];

export default {
  Routes,
};
