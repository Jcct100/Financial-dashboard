import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';

import { createStore } from 'redux';
import { Provider } from 'react-redux';
/* eslint-disable-next-line import/no-extraneous-dependencies */
import { devToolsEnhancer } from 'redux-devtools-extension';
import rootReducer from './reducers';

import Header from './components/Header';
import FinancePage from './components/FinancePage';
import RegistersPage from './components/RegistersPage';
import Register from './containers/Register';
import Parent from './containers/Parent';
import Child from './containers/Child';
import Login from './containers/Login';
import Logout from './containers/Logout';

const store = process.env.REACT_APP_ENV === 'dev' ? createStore(rootReducer, devToolsEnhancer()) : createStore(rootReducer);

// If the user is not logged in it will redirect to the login page
const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                return store.getState().user.token ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }}
                    />
                );
            }}
        />
    );
};

PrivateRoute.propTypes = {
    component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    location: PropTypes.object
};

const Root = () => {
    return (
        <Provider store={store}>
            <Router basename="/">
                <div className="content-area">
                    <Header />

                    <div className="page">
                        <Switch>
                            <PrivateRoute exact path="/" component={RegistersPage} />
                            <PrivateRoute exact path="/finance" component={FinancePage} />
                            <PrivateRoute exact path="/registers" component={RegistersPage} />
                            <PrivateRoute exact path="/register" component={Register} />
                            <PrivateRoute path="/parent/:id" component={Parent} />
                            <PrivateRoute path="/child/:id" component={Child} />
                            <PrivateRoute exact path="/logout" component={Logout} />
                            <PrivateRoute exact path="/finance" component={FinancePage} />
                            <Route exact path="/login" component={Login} />
                            <Redirect to="/" />
                        </Switch>
                    </div>
                </div>
            </Router>
        </Provider>
    );
};

export default Root;
