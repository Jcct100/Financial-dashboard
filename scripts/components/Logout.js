import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class Logout extends Component {
    componentWillMount() {
        this.props.logoutUser();
    }

    render() {
        return (
            <Redirect to="/" />
        );
    }
}

Logout.propTypes = {
    logoutUser: PropTypes.func.isRequired
};

export default Logout;
