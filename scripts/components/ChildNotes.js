import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import Notes from './Notes';

import { getChildNotes } from '../api';

class ChildNotes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        getChildNotes(this.props.child.ID)
            .then((res) => {
                this.props.setChildNotes(res);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    addNote(note) {
        this.props.addChildNote(note);
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <Notes id={this.props.child.ID} type="child" notes={this.props.notes} addNote={(note) => { this.addNote(note); }} />
        );
    }
}

ChildNotes.propTypes = {
    child: PropTypes.object.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    setChildNotes: PropTypes.func.isRequired,
    addChildNote: PropTypes.func.isRequired
};

export default ChildNotes;
