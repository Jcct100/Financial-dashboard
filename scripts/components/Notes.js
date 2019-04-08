import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Toggle from 'react-toggle';

import Modal from './Modal';
import Note from './Note';

import { postChildNote, postParentNote } from '../api';

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: false
        };
    }

    onClick() {
        this.setState({ modalOpen: true });
    }

    closeModal() {
        this.setState({ modalOpen: false });
    }

    submitForm() {
        const data = {
            content: this.textarea.value,
            is_emergency: this.is_emergency.state.checked
        };

        if (this.props.type === 'child') {
            postChildNote(this.props.id, data)
                .then((res) => {
                    this.props.addNote(res);
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            postParentNote(this.props.id, data)
                .then((res) => {
                    this.props.addNote(res);
                    this.closeModal();
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    render() {
        const NotesModal = () => {
            if (!this.state.modalOpen) {
                return null;
            }

            return (
                <Modal type="notes" onClose={() => { this.closeModal(); }}>
                    <div className="note-form">
                        <div className="note-form__body">
                            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                            <textarea cols="30" rows="10" ref={(textarea) => { this.textarea = textarea; }} className="note-form__textarea" autoFocus="true" />
                        </div>

                        <div className="note-form__footer">
                            <div className="note-form__emergency-toggle">
                                <span className="note-form__label">Emergency</span>
                                <Toggle icons={false} ref={(toggle) => { this.is_emergency = toggle; }} />
                            </div>

                            <button type="button" className="button note-form__button" onClick={() => { this.submitForm(); }}>Add</button>
                        </div>
                    </div>
                </Modal>
            );
        };

        return (
            <div className={`notes notes--${this.props.type}`}>
                <div className="note note--add-note add-note">
                    <div className="note__details" />

                    <div className="note__contents">
                        <button type="button" className="add-note__button" onClick={() => { this.onClick(); }}>
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>

                {/* Emergency notes */}
                {this.props.notes.filter((note) => { return note.child_emergency; }).map((note) => {
                    return (
                        <Note key={note.note_id} note={note} />
                    );
                })}

                {/* Non-emergency notes */}
                {this.props.notes.filter((note) => { return !note.child_emergency; }).map((note) => {
                    return (
                        <Note key={note.note_id} note={note} />
                    );
                })}

                <NotesModal />
            </div>
        );
    }
}

Notes.propTypes = {
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    type: PropTypes.oneOf(['child', 'parent']).isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    addNote: PropTypes.func.isRequired
};

export default Notes;
