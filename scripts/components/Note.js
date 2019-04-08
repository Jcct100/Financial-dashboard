import React from 'react';
import PropTypes from 'prop-types';

const Note = ({ note }) => {
    return (
        <div className={`note ${note.child_emergency ? 'note--emergency' : ''}`}>
            <div className="note__details">
                <p className="note__label note__label--date">{note.date.date_label}</p>
                <p className="note__label note__label--time">{note.date.time_label}</p>
                <p className="note__label note__label--author">{note.author.author_display_name}</p>
            </div>
            <div className="note__contents">
                <p className="note__content">{note.content}</p>
            </div>
        </div>
    );
};

Note.propTypes = {
    note: PropTypes.object.isRequired
};

export default Note;
