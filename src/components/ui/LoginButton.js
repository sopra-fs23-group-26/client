import "styles/ui/LoginButton.scss";

export const LoginButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`primary-button ${props.className}`}>
        {props.children}
    </button>
);
