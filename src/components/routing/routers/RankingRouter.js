import {Redirect, Route} from "react-router-dom";
import Ranking from "components/views/Ranking";
import PropTypes from 'prop-types';

const RankingRouter = props => {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <Ranking/>
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

RankingRouter.propTypes = {
  base: PropTypes.string
}


export default RankingRouter;