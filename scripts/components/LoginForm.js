import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { loginUser } from '../api';

class LoginForm extends Component {
    handleSubmit(evt) {
        evt.preventDefault();

        const data = {
            username: this.username.value,
            password: this.password.value
        };

        this.login(data);
    }

    login(data) {
        // POST to api endpoint to get auth token
        loginUser(data)
            .then((res) => {
                // Store the token at the root
                const { token } = res;
                const details = {
                    displayName: res.user_display_name,
                    email: res.user_email,
                    niceName: res.user_nicename,
                    capabilities: res.wac.caps
                };

                window.userCapabilities = res.wac.caps;

                this.props.updateUser(token, details);
            })
            .catch((error) => {
                // Failed to login
                if (error.response.data.message) {
                    this.error.innerHTML = error.response.data.message;
                }
            });
    }

    render() {
        // Redirect to the previous page if a token is found
        if (this.props.user.token) {
            return (
                <Redirect to={this.props.location.state ? this.props.location.state.from : '/'} />
            );
        }

        // This is to make logging into the dev environment easier
        const FakeLogin = () => {
            if (process.env.REACT_APP_ENV !== 'dev') return null;

            return (
                <button
                    type="button"
                    className="button login-form__submit"
                    onClick={(evt) => {
                        evt.preventDefault();

                        const data = {
                            username: 'fakestaff',
                            password: 'fakestaff1'
                        };

                        this.login(data);
                    }}
                >
                    {'Fake Log in'}
                </button>
            );
        };

        return (
            <div className="login">
                <h1>Log In</h1>

                <form onSubmit={(evt) => { return this.handleSubmit(evt); }} className="login__form login-form">
                    <div className="input-group username">
                        <label htmlFor="username" className="login-form__label">Username</label>
                        <input name="username" type="text" className="login-form__input" ref={(input) => { this.username = input; }} />
                    </div>

                    <div className="input-group password">
                        <label htmlFor="password" className="login-form__label">Password</label>
                        <input name="password" type="password" className="login-form__input" ref={(input) => { this.password = input; }} />
                    </div>

                    <p className="login__error" ref={(error) => { this.error = error; }} />

                    <button type="submit" className="button login-form__submit">Log in</button>

                    <FakeLogin />
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    user: PropTypes.object,
    updateUser: PropTypes.func.isRequired,
    location: PropTypes.object
};

export default LoginForm;
