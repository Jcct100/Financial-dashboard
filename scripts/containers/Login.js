import { connect } from 'react-redux';
import { setToken } from '../actions';

import LoginForm from '../components/LoginForm';

const mapStateToProps = (state) => {
    return {
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (token, details) => {
            dispatch(setToken(token, details));
        }
    };
};

const Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default Login;
