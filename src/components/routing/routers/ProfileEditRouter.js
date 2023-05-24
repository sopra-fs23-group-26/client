import {Redirect, Route} from "react-router-dom";
import ProfileEdit from "components/views/ProfileEdit";
import PropTypes from 'prop-types';

const ProfileEditRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of UserlistRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <ProfileEdit/>
      </Route>
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}`}/>
      </Route>
    </div>
  );
};
/*
* Don't forget to export your component!
 */

ProfileEditRouter.propTypes = {
  base: PropTypes.string
}

export default ProfileEditRouter;