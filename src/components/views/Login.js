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
        localStorage.setItem('id', user.id)
        localStorage.setItem('status', user.status)
        localStorage.setItem('userinfo', JSON.stringify(user));
        history.push(`/platform`);
      }else{
        alert("Error: Wrong user name or password");
      }
    } catch (error) {
      alert(`${error.response.data.message} You cannot login.`);
    }
  };

  return (
    <LoginContainer>
      <div className="login container">
        <h1 className="login title">Sign in to WeGame</h1>
        <div className="login form">
          <FormField
            value={username}
            onChange={un => setUsername(un)}
            placeholder="username"
            type="text"
          />
          <FormField
            value={password}
            onChange={n => setPassword(n)}
            placeholder="password"
            type="password"
          />

          <div className="login button-container">
            <LoginButton
              disabled={!username || !password}
              onClick={() => doLogin()}
            >
              Log In
            </LoginButton>
            {/*<Button*/}
            {/*  width="40%"*/}
            {/*  onClick={() => history.push(`/Register`)}*/}
            {/*>*/}
            {/*  Register*/}
            {/*</Button>*/}
          </div>
          <div className="Create a new account" style={{textAlign: 'center', cursor: 'pointer'}} onClick={() => history.push("/register")}>
            <p >    <span style={{color: 'black'}}>No account?</span>
              <span > Create one</span></p>
          </div>
        </div>
      </div>
    </LoginContainer>
  );
};

export default Login;