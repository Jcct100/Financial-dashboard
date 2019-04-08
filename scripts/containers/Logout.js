import { connect } from 'react-redux';
import { logoutUser } from '../actions';

import Logout from '../components/Logout';

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        logoutUser: () => {
            dispatch(logoutUser());
        }
    };
};

const LogoutContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Logout);

export default LogoutContainer;
