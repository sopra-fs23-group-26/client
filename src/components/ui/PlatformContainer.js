import 'styles/ui/PlatformContainer.scss';
import PropTypes from "prop-types";

const PlatformContainer = props => (
    <div {...props} className={`platform-container ${props.className ?? ''}`}>
        {props.children}
    </div>
);

PlatformContainer.propTypes = {
    children: PropTypes.node,
};

export default PlatformContainer;