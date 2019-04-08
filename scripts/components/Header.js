import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';

import PropTypes from 'prop-types';
import queryString from 'query-string';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { searchPeople, addBooking } from '../api';
import { capitalise } from '../utilities';


class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            searchQuery: '',
            searchResults: [],
            menuOpen: false,
            showRegisterAddButton: false,
            isLoggedIn: false
        };
    }

    componentWillReceiveProps(nextProps) {
        const params = queryString.parse(nextProps.location.search);

        const showRegisterAddButton = params.date === 'today';
        const isLoggedIn = nextProps.location.pathname !== '/login';

        this.setState({
            showRegisterAddButton,
            isLoggedIn
        });
    }

    onChange(evt) {
        const query = evt.target.value;

        if (query === '') {
            this.setState({
                searching: false,
                searchQuery: '',
                searchResults: []
            });
            return;
        }

        this.setState({
            searching: true,
            searchQuery: query
        });

        searchPeople(query)
            .then((data) => {
                this.setState({
                    searching: false,
                    searchResults: data
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    onDropdownClick() {
        /* eslint-disable-next-line react/no-access-state-in-setstate */
        this.setState({ menuOpen: !this.state.menuOpen });
    }

    onLinkClick() {
        this.setState({
            menuOpen: false,
            searching: false,
            searchQuery: '',
            searchResults: []
        });
    }

    onButtonClick(evt, id) {
        evt.preventDefault();
        evt.stopPropagation();

        const params = queryString.parse(this.props.location.search);

        const data = {
            session: params.session
        };

        addBooking(id, data)
            .then(() => {
                this.onLinkClick();
            })
            .catch((error) => {
                console.log(error);
                this.onLinkClick();
            });
    }

    render() {
        return (
            <header className={`header ${this.state.isLoggedIn ? 'header--logged-in' : 'header--logged-out'}`}>
                <nav className="header__nav">
                    <Link className="header__logo" onClick={() => { this.onLinkClick(); }} to="/">WAC</Link>

                    <button type="button" className="header__dropdown-toggle" onClick={() => { this.onDropdownClick(); }}>
                        <FontAwesomeIcon icon={faAngleDown} />
                    </button>

                    <div className={`header__menu ${this.state.menuOpen ? 'header__menu--open' : ''}`}>
                        <Link className="header__link" onClick={() => { this.onLinkClick(); }} to="/registers">Registers</Link>
                        {window.userCapabilities && window.userCapabilities.finance ? <Link className="header__link" onClick={() => { this.onLinkClick(); }} to="/finance">Finance</Link> : null }
                        <Link className="header__link" onClick={() => { this.onLinkClick(); }} to="/logout">Logout</Link>
                    </div>
                </nav>

                <div className="header__search search">
                    <input type="text" className="search__input" onChange={(evt) => { this.onChange(evt); }} placeholder="Search..." value={this.state.searchQuery} />
                    <div className="search__container">
                        <div className={`search__spinner  ${this.state.searching ? 'search__spinner--loading' : ''}`} />
                        <div className={`search__results  ${this.state.searching ? 'search__results--loading' : ''}`}>
                            {this.state.searchResults.map((result) => {
                                return (
                                    <Link key={result.item_id} className="search__result" onClick={() => { this.onLinkClick(); }} to={`/${result.item_type}/${result.item_id}`}>
                                        <span className="search__label search__label--type">{capitalise(result.item_type)}</span>
                                        <span className="search__label search__label--id">{result.item_id}</span>
                                        <span className="search__label search__label--name">{result.item_title}</span>

                                        {(result.item_type === 'child' && this.state.showRegisterAddButton) ? <button type="button" className="button search__add-button" onClick={(evt) => { this.onButtonClick(evt, result.item_id); }}>Add</button> : null}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    location: PropTypes.object
};

export default withRouter(Header);
