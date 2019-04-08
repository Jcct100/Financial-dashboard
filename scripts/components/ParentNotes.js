import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import Notes from './Notes';

import { getParentNotes } from '../api';

class ParentNotes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        getParentNotes(this.props.parent.ID)
            .then((res) => {
                this.props.setParentNotes(res);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    addNote(note) {
        this.props.addParentNote(note);
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <Notes
                id={this.props.parent.ID}
                type="parent"
                notes={this.props.notes}
                addNote={(note) => { this.addNote(note); }}
            />
        );
    }
}

ParentNotes.propTypes = {
    parent: PropTypes.object.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    setParentNotes: PropTypes.func.isRequired,
    addParentNote: PropTypes.func.isRequired
};

export default ParentNotes;
