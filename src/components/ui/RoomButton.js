import 'styles/ui/RoomButton.scss';
import PropTypes from "prop-types";


export const RoomButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`room-button ${props.className}`}>
        {props.children}
    </button>
);