import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Toggle from 'react-toggle';

import { patchParent } from '../api';

class ContactInformation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false
        };
    }

    onToggle(parent, value) {
        const data = {
            is_offender: value
        };

        this.setState({ isLoading: true });

        patchParent(parent, data)
            .then((res) => {
                this.props.updateParent(res);
                this.setState({ isLoading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ isLoading: false });
            });
    }

    render() {
        const PersonalDetails = () => {
            if (this.props.type === 'parent') {
                return (
                    <table className="tab-table">
                        <tbody>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Full name:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.full_name || '-' }</td>
                            </tr>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Email:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.email || '-' }</td>
                            </tr>
                        </tbody>
                    </table>
                );
            }
            return (
                <table className="tab-table">
                    <tbody>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">First name:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.personal.first_name || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">Last name:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.personal.last_name || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">Preferred name:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.personal.preferredName || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">Date of birth:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.personal.dateOfBirth || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">Year group:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.year_group || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">School:</td>
                            <td className="tab-table__cell tab-table__value">{ this.props.user.school_name || '-' }</td>
                        </tr>
                        <tr className="tab-table__row">
                            <td className="tab-table__cell tab-table__key">Form/ Class:</td>
                            <td className="tab-table__cell tab-table__value">{this.props.user.formClass || '-'}</td>
                        </tr>
                    </tbody>
                </table>
            );
        };

        const ParentOffenderToggle = () => {
            if (this.props.type === 'parent') {
                return (
                    <tr className="tab-table__row">
                        <td className="tab-table__cell tab-table__cell--parent-offender" colSpan="2">
                            <div className="parent-offender">
                                <span id="parent-offender__label" className="parent-offender__label">Mark as an offender</span>
                                <Toggle
                                    icons={false}
                                    className="parent-offender__toggle"
                                    defaultChecked={this.props.user.is_offender}
                                    disabled={this.state.isLoading}
                                    aria-labelledby="parent-offender__label"
                                    onChange={(evt) => { this.onToggle(this.props.user.ID, evt.target.checked); }}
                                />
                            </div>
                        </td>
                    </tr>
                );
            }
            return null;
        };

        return (
            <div className="contact-information">
                <div className="contact-information__personal-details">
                    <h2>Personal Details</h2>

                    <PersonalDetails />
                </div>

                <div className="contact-information__contact-details">
                    <h2>Contact</h2>

                    <table className="tab-table">
                        <tbody>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Address Line 1:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.address1 || '-' }</td>
                            </tr>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Address Line 2:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.address2 || '-' }</td>
                            </tr>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Address Line 3:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.address3 || '-' }</td>
                            </tr>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">City:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.city || '-' }</td>
                            </tr>
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Postcode:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.postcode || '-' }</td>
                            </tr>
                            <tr className="tab-table__row" />
                            <tr className="tab-table__row">
                                <td className="tab-table__cell tab-table__key">Phone:</td>
                                <td className="tab-table__cell tab-table__value">{ this.props.user.contact.phone || '-' }</td>
                            </tr>

                            {this.props.user.contact.phone2
                                ? (
                                    <tr className="tab-table__row">
                                        <td className="tab-table__cell tab-table__key">Alternate phone:</td>
                                        <td className="tab-table__cell tab-table__value">{this.props.user.contact.phone2 || '-'}</td>
                                    </tr>
                                )
                                : null
                            }

                            <ParentOffenderToggle />
                        </tbody>
                    </table>

                    { this.props.type === 'child' && this.props.family.parent
                        ? (
                            <div className="contact-information__parents-details">
                                <h2>Parent's Details</h2>

                                <table className="tab-table">
                                    <tbody>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Name:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.full_name || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Address Line 1:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.address1 || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Address Line 2:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.address2 || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Address Line 3:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.address3 || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">City:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.city || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Postcode:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.postcode || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row" />
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Phone:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.phone || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Alternate phone:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.contact.phone2 || '-'}</td>
                                        </tr>
                                        <tr className="tab-table__row">
                                            <td className="tab-table__cell tab-table__key">Email:</td>
                                            <td className="tab-table__cell tab-table__value">{this.props.family.parent.email || '-'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                        : null
                    }
                </div>
            </div>
        );
    }
}

ContactInformation.propTypes = {
    user: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    family: PropTypes.object,
    updateParent: PropTypes.func
};

export default ContactInformation;
