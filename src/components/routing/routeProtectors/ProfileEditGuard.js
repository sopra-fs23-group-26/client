import {Redirect} from "react-router-dom";
import PropTypes from "prop-types";

export const ProfileEditGuard = props => {
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to="/"/>;
};

ProfileEditGuard.propTypes = {
  children: PropTypes.node
};