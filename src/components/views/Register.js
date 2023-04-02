import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {LoginButton} from 'components/ui/LoginButton';
import 'styles/views/Login.scss';
import LoginContainer from "components/ui/LoginContainer";
import PropTypes from "prop-types";


const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder={props.placeholder}
        value={props.value}
        type={props.type?props.type:'text'}
        onChange={e => props.onChange(e.target.value)}
      />
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string.isRequired
};

const Register = props => {
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [repeatPassword, setRepeatPassword] = useState(null);


  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, password, repeatPassword});
      const response = await api.post('/users', requestBody);

      // heqing: there is another case: the password and repeatPassword are not equal
      if(!response.data){
        alert(`register error`)
        return false;
      }
      const user = new User(response.data);

      localStorage.setItem('token', user.token);
      localStorage.setItem('id', user.id)
      localStorage.setItem('userinfo', JSON.stringify(user));

      history.push(`/platform`);
    } catch (error) {
      alert(`Something went wrong during the register: \n${handleError(error)}`);
    }
  };

  return (
    <LoginContainer>
      <div className="login container">
        <h1 className="login title">Sign up to WeGame</h1>
        <div className="login form">
          <FormField
            value={username}
            onChange={un => setUsername(un)}
            placeholder="Username"
            type="text"
          />
          <FormField
            value={password}
            onChange={un => setPassword(un)}
            placeholder="Password"
            type="password"
          />
          <FormField
            value={repeatPassword}
            onChange={un => setRepeatPassword(un)}
            placeholder="Repeat Password"
            type="password"
          />

          <div className="login button-container">
            <LoginButton
              disabled={!username || !password || !repeatPassword}
              width="100%"
              onClick={() => doRegister()}
            >
              Submit
            </LoginButton>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Register;