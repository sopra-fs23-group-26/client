import 'styles/ui/LoginContainer.scss';
import PropTypes from "prop-types";

const LoginContainer = props => (
    <div {...props} className={`login-container ${props.className ?? ''}`}>
        {props.children}
    </div>
);

LoginContainer.propTypes = {
    children: PropTypes.node,
};

export default LoginContainer;