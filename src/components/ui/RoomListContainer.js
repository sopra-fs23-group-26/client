import 'styles/ui/RoomListContainer.scss';
import PropTypes from "prop-types";

const RoomListContainer = props => (
    <div {...props} className={`room-list-container ${props.className ?? ''}`}>
        {props.children}
    </div>
);

RoomListContainer.propTypes = {
    children: PropTypes.node,
};

export default RoomListContainer;