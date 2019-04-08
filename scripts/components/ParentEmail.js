// Form validation - https://medium.com/front-end-hacking/html5-form-validation-in-react-65712f778196
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { sendParentEmail } from '../api';
import { validateEmail } from '../utilities';

import Loading from './Loading';

class ParentEmail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isValidated: false,
            isLoading: false,
            emailSent: false
        };
    }

    onSubmit(event) {
        event.preventDefault();

        // If the call of the validate method was successful, we can proceed with form submission. Otherwise we do nothing.
        if (this.validate()) {
            this.setState({ isLoading: true });

            const formData = new FormData(event.target);

            const cc = formData.get('cc') ? formData.get('cc').split(',').map((email) => { return email.trim(); }) : [];
            const bcc = formData.get('bcc') ? formData.get('bcc').split(',').map((email) => { return email.trim(); }) : [];

            const data = {
                subject: formData.get('subject'),
                cc,
                bcc,
                content: {
                    plain_text: formData.get('content').replace(/(?:\r\n|\r|\n)/g, '<br />')
                }
            };

            sendParentEmail(this.props.parent.ID, data)
                .then(() => {
                    this.setState({
                        isLoading: false,
                        emailSent: true
                    });
                })
                .catch((error) => {
                    console.warn(error);
                    this.setState({ isLoading: false });
                });
        }

        this.setState({ isValidated: true });
    }

    validate() {
        const formLength = this.formEl.length;

        if (this.formEl.checkValidity() === false) {
            for (let i = 0; i < formLength; i++) {
                // The i-th child of the form corresponds to the forms i-th input element
                const elem = this.formEl[i];

                /*
                * errorLabel placed next to an element is the container we want to use
                * for validation error message for that element
                */
                const errorLabel = elem.parentNode.querySelector('.form__validation');

                /*
                * A form element contains also any buttuns contained in the form.
                * There is no need to validate a button, so, we'll skip that nodes.
                */
                if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                    /*
                    * Each note in html5 form has a validity property.
                    * It contains the validation state of that element.
                    * The elem.validity.valid property indicates whether the element qualifies its validation rules or no.
                    * If it does not qualify, the elem.validationMessage property will contain the localized validation error message.
                    * We will show that message in our error container if the element is invalid, and clear the previous message, if it is valid.
                    */
                    if (!elem.validity.valid) {
                        errorLabel.textContent = elem.validationMessage;
                    } else {
                        errorLabel.textContent = '';
                    }

                    // Validate cc/bcc
                    if ((elem.name === 'cc' || elem.name === 'bcc') && elem.value) {
                        // Split the emails string into an array of emails
                        const emails = elem.value.split(',').map((email) => {
                            return email.trim();
                        });

                        let validEmails = true;
                        // Loop over the emails and validate each of them
                        for (const email of emails) {
                            if (!validateEmail(email)) {
                                validEmails = false;
                            }
                        }

                        if (!validEmails) {
                            elem.classList += ' invalid';
                            errorLabel.textContent = 'Please check the format of the email(s)';
                        } else {
                            elem.classList = 'form__control';
                        }
                    }
                }
            }

            // Return false, as the formEl.checkValidity() method said there are some invalid form inputs.
            return false;
        }
        // Custom cc/bcc validation
        let validCCAndBCC = true;

        // The form is valid, so we clear all the error messages
        for (let i = 0; i < formLength; i++) {
            const elem = this.formEl[i];
            const errorLabel = elem.parentNode.querySelector('.form__validation');

            if (errorLabel && elem.nodeName.toLowerCase() !== 'button') {
                errorLabel.textContent = '';
            }

            // Validate cc/bcc
            if ((elem.name === 'cc' || elem.name === 'bcc') && elem.value) {
                // Split the emails string into an array of emails
                const emails = elem.value.split(',').map((email) => {
                    return email.trim();
                });

                let validEmails = true;
                // Loop over the emails and validate each of them
                for (const email of emails) {
                    if (!validateEmail(email)) {
                        validEmails = false;
                    }
                }

                if (!validEmails) {
                    elem.classList += ' invalid';
                    errorLabel.textContent = 'Please check the format of the email(s)';

                    validCCAndBCC = false;
                } else {
                    elem.classList = 'form__control';
                }
            }
        }

        if (!validCCAndBCC) {
            return false;
        }

        // Return true, as the form is valid for submission
        return true;
    }

    render() {
        const ConfirmationMessage = () => {
            return (
                <h2 className="parent__confirmation-message">{`Your email to ${this.props.parent.full_name || this.props.parent.email} has been successfully submitted.`}</h2>
            );
        };

        return (
            <div className="parent__email">
                {this.state.isLoading ? <Loading /> : null}

                <form
                    className={`form parent__email-form ${this.state.isValidated ? 'was-validated' : ''} ${this.state.isLoading ? 'loading' : ''} ${this.state.emailSent ? 'completed' : ''}`}
                    ref={(form) => { this.formEl = form; }}
                    onSubmit={(event) => { return this.onSubmit(event); }}
                    noValidate
                >
                    <div className="form__group">
                        <label className="form__label" htmlFor="email">Email address:</label>
                        <input id="email" className="form__control" name="email" type="email" required readOnly={!!this.props.parent.email} defaultValue={this.props.parent.email ? this.props.parent.email : ''} />
                    </div>

                    <div className="form__group">
                        <label className="form__label" htmlFor="subject">Subject:</label>
                        <input id="subject" className="form__control" name="subject" type="text" required />
                        <span className="form__validation" />
                    </div>

                    <div className="form__group">
                        <label className="form__label" htmlFor="cc">CC:</label>
                        <input id="cc" className="form__control" name="cc" type="text" />
                        <span className="form__validation" />
                    </div>

                    <div className="form__group">
                        <label className="form__label" htmlFor="bcc">BCC:</label>
                        <input id="bcc" className="form__control" name="bcc" type="text" />
                        <span className="form__validation" />
                    </div>

                    <textarea id="content" className="form__content" name="content" cols="30" rows="10" required />

                    <button type="submit" className="button form__submit">Send</button>
                </form>

                {this.state.emailSent ? <ConfirmationMessage /> : null }
            </div>
        );
    }
}

ParentEmail.propTypes = {
    parent: PropTypes.object.isRequired
};

export default ParentEmail;
