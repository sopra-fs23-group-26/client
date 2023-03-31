import {Redirect, Route} from "react-router-dom";
import ResetPassword from "components/views/ResetPassword";
import PropTypes from 'prop-types';

const ResetPasswordRouter = props => {

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}/resetpassword`}>
        <ResetPassword/>
      </Route>
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/resetpassword`}/>
      </Route>
    </div>
  );
};

ResetPasswordRouter.propTypes = {
  base: PropTypes.string
}

export default ResetPasswordRouter;