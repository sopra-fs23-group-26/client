import {Redirect, Route} from "react-router-dom";
import Platform from "components/views/Platform";
import PropTypes from 'prop-types';

const PlatformRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of UserlistRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <Platform/>
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

PlatformRouter.propTypes = {
  base: PropTypes.string
}

export default PlatformRouter;
