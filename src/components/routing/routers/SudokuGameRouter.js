import {Redirect, Route} from "react-router-dom";
import SudokuGame from "components/views/SudokuGame";
import PropTypes from 'prop-types';

const SudokuGameRouter = props => {
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <SudokuGame/>
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

SudokuGameRouter.propTypes = {
  base: PropTypes.string
}

export default SudokuGameRouter;