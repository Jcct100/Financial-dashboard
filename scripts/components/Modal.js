import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Modal extends Component {
    handleClick(evt) {
        // If the click is inside the modal body (i.e the content of the modal)
        // return out of this
        if (!evt.target.classList.contains('modal')) {
            return;
        }

        // The outside of the modal has been clicked
        // So close the modal
        this.props.onClose();
    }

    render() {
        return (
            <div className={`modal modal--${this.props.type}`} onClick={(evt) => { this.handleClick(evt); }}>
                <div className="modal__body">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Modal.propTypes = {
    children: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Modal;
