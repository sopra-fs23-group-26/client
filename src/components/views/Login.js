import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";


const FormField = props => {
  return (
    <div className="login field">
      <label className="login label">
        {props.label}
      </label>
      <input
        className="login input"
        placeholder="enter here to log in..."
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
  onChange: PropTypes.func
};

const Login = props => {
  localStorage.removeItem('token');
  const history = useHistory();
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post('/login', requestBody);
      if(response.data){
        const user = new User(response.data);
        localStorage.setItem('token', user.token);
        localStorage.setItem('userinfo', JSON.stringify(user));
        history.push(`/platform`);
      }else{
        alert("Error: Wrong user name or password");
      }
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  return (
    <BaseContainer>
      <div className="login container">
        <h2>Login</h2>
        <div className="login form">
          <FormField
            label="username"
            value={username}
            onChange={un => setUsername(un)}
          />
          <FormField
            label="password"
            value={password}
            type="password"
            onChange={n => setPassword(n)}
          />
          <div className="login button-container">
            <Button
              disabled={!username || !password}
              width="40%"
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <Button
              width="40%"
              onClick={() => history.push(`/Register`)}
            >
              Register
            </Button>
          </div>
        </div>
      </div>
    </BaseContainer>
  );
};

export default Login;
