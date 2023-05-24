import 'styles/ui/RoomButton.scss';

export const RoomButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`room-button ${props.className}`}>
        {props.children}
    </button>
);