import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const RankingGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to="/login"/>;
};

RankingGuard.propTypes = {
  children: PropTypes.node
};