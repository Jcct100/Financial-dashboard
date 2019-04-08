import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import SignaturePad from 'react-signature-pad';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faAngleUp,
    faAngleDown,
    faCheck
} from '@fortawesome/free-solid-svg-icons';

import queryString from 'query-string';

import Loading from './Loading';
import Modal from './Modal';

import { getBookings, patchBooking } from '../api';
import { addZero, formatDate } from '../utilities';

class Register extends Component {
    constructor(props) {
        super(props);

        const date = new Date();

        this.state = {
            loading: true,
            modalOpen: false,
            modalType: null,
            currentBooking: null,
            attendanceType: null,
            timeHours: addZero(date.getHours()),
            timeMinutes: addZero(date.getMinutes()),
            registerTitle: 'Register',
            allSchools: false,
            noBookings: false,
            session: null,
            lastUpdated: null,
            count: 0,
            totalBookings: 0
        };
    }

    componentWillMount() {
        this.getRegister();
    }

    componentWillUnmount() {
        this.props.resetBookings();
    }

    onClubClick(booking) {
        this.setState({
            modalOpen: true,
            modalType: 'club',
            currentBooking: booking
        });
    }

    onAttendanceClick(inOrOut, booking) {
        const date = new Date();

        // Open modal to input time
        this.setState({
            modalOpen: true,
            modalType: 'in-or-out',
            currentBooking: booking.ID,
            attendanceType: inOrOut,
            timeHours: addZero(date.getHours()),
            timeMinutes: addZero(date.getMinutes())
        });
    }

    onSignatureClick(booking) {
        this.setState({
            modalOpen: true,
            modalType: 'signature',
            currentBooking: booking
        });
    }

    getRegister() {
        let date = 'today';
        let school = null;
        let session = null;

        if (this.props.location.search) {
            const queryParams = queryString.parse(this.props.location.search);

            date = queryParams.date || date;
            school = queryParams.school || school;
            session = queryParams.session || session;
        }

        this.setState({ session });

        getBookings(date, school, session)
            .then((res) => {
                /* eslint-disable no-underscore-dangle */
                if (res._query.school_name) {
                    this.setState({
                        registerTitle: `${res._query.school_name}: ${formatDate(res._query.date)} ${res._query.session.toUpperCase()}`,
                        allSchools: false
                    });
                } else {
                    this.setState({
                        registerTitle: `All schools: ${formatDate(res._query.date)} ${res._query.session.toUpperCase()}`,
                        allSchools: true
                    });
                }
                /* eslint-enable no-underscore-dangle */

                // If there are no bookings
                if (res.bookings.length < 1) {
                    this.setState({ noBookings: true });
                } else {
                    const totalBookings = res.bookings.length;
                    this.setState({ totalBookings });

                    let count = 0;

                    // add live count
                    for (let i = 0; i < res.bookings.length; i++) {
                        const signIn = res.bookings[i].attendance.time_in;
                        const signOut = res.bookings[i].attendance.time_out;

                        if (signIn && !signOut) {
                            count++;
                        }
                    }

                    this.setState({ count });
                }

                const now = new Date();
                const lastUpdated = `${addZero(now.getHours())}:${addZero(now.getMinutes())}`;

                this.props.setBookings(res.bookings);
                this.setState({
                    loading: false,
                    lastUpdated
                });
            })
            .catch((error) => {
                console.log('getBookings', error);
            });
    }

    syncRegister() {
        this.setState({ loading: true });
        this.getRegister();
    }

    submitClub() {
        if (!this.club || !this.club.value) {
            return;
        }

        const data = {
            club_id: this.club.value
        };

        patchBooking(this.state.currentBooking.ID, data)
            .then((res) => {
                this.closeModal();

                this.props.updateBooking(res);
                this.syncRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    clearAttendance() {
        const data = {
            [this.state.attendanceType]: null
        };

        patchBooking(this.state.currentBooking, data)
            .then((res) => {
                this.setState({
                    modalOpen: false,
                    currentBooking: null,
                    attendanceType: null
                });

                this.props.updateBooking(res);
                this.syncRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    sumbitAttendace() {
        const data = {
            [this.state.attendanceType]: `${addZero(this.hoursInput.value)}:${addZero(this.minutesInput.value)}`
        };

        patchBooking(this.state.currentBooking, data)
            .then((res) => {
                this.closeModal();

                this.props.updateBooking(res);
                this.syncRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    sumbitSignature() {
        if (this.signaturePad.isEmpty()) {
            return;
        }

        const data = {
            signature: btoa(this.signaturePad.toDataURL('image/svg+xml'))
        };

        // Set attendance time out if the signature is signed
        if (this.state.currentBooking.session === 'pm') {
            const date = new Date();

            data.time_out = `${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
        }

        patchBooking(this.state.currentBooking.ID, data)
            .then((res) => {
                this.closeModal();

                this.props.updateBooking(res);
                this.syncRegister();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    displaySignature(booking) {
        this.setState({
            modalOpen: true,
            modalType: 'display-signature',
            currentBooking: booking
        });
    }

    closeModal() {
        this.setState({
            modalOpen: false,
            modalType: null,
            currentBooking: null,
            attendanceType: null
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        // The contents of the modal will change depending on the state
        const ModalContents = () => {
            if (this.state.modalType === 'in-or-out') {
                return (
                    <div className="attendance-modal">
                        <div className="attendance-input attendance-input--hours">
                            <button
                                type="button"
                                className="attendance-input__button attendance-input__button--increase"
                                onClick={() => {
                                    let timeHours = this.hoursInput.value;
                                    if (parseInt(timeHours, 10) < 23) {
                                        timeHours = parseInt(timeHours, 10) + 1;
                                    } else {
                                        timeHours = 0;
                                    }

                                    this.hoursInput.value = addZero(timeHours);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleUp} />
                            </button>
                            <input
                                type="number"
                                readOnly
                                className="attendance-input__field"
                                value={this.state.timeHours}
                                ref={(input) => { this.hoursInput = input; }}
                            />
                            <button
                                type="button"
                                className="attendance-input__button attendance-input__button--decrease"
                                onClick={() => {
                                    let timeHours = this.hoursInput.value;
                                    if (parseInt(timeHours, 10) <= 0) {
                                        timeHours = 23;
                                    } else {
                                        timeHours = parseInt(timeHours, 10) - 1;
                                    }

                                    this.hoursInput.value = addZero(timeHours);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleDown} />
                            </button>
                        </div>

                        <div className="attendance-input attendance-input--minutes">
                            <button
                                type="button"
                                className="attendance-input__button attendance-input__button--increase"
                                onClick={() => {
                                    let timeMinutes = this.minutesInput.value;
                                    if (parseInt(timeMinutes, 10) < 59) {
                                        timeMinutes = parseInt(timeMinutes, 10) + 1;
                                    } else {
                                        timeMinutes = 0;
                                    }

                                    this.minutesInput.value = addZero(timeMinutes);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleUp} />
                            </button>
                            <input
                                type="number"
                                readOnly
                                className="attendance-input__field"
                                value={this.state.timeMinutes}
                                ref={(input) => { this.minutesInput = input; }}
                            />
                            <button
                                type="button"
                                className="attendance-input__button attendance-input__button--decrease"
                                onClick={() => {
                                    let timeMinutes = this.minutesInput.value;
                                    if (parseInt(timeMinutes, 10) <= 0) {
                                        timeMinutes = 59;
                                    } else {
                                        timeMinutes = parseInt(timeMinutes, 10) - 1;
                                    }

                                    this.minutesInput.value = addZero(timeMinutes);
                                }}
                            >
                                <FontAwesomeIcon icon={faAngleDown} />
                            </button>
                        </div>

                        <div className="attendance-modal__buttons">
                            <button type="button" className="button attendance-modal__button attendance-modal__button--submit" onClick={() => { this.sumbitAttendace(); }}>Ok</button>
                            <button type="button" className="button button--inverse attendance-modal__button attendance-modal__button--clear" onClick={() => { this.clearAttendance(); }}>Clear</button>
                        </div>
                    </div>
                );
            } if (this.state.modalType === 'signature') {
                return (
                    <div className="m-signature-pad__container">
                        <div className="m-signature-pad__header">
                            <span className="m-signature-pad__id">
                                {`ID: ${this.state.currentBooking.ID}`}
                            </span>
                            <span className="m-signature-pad__name">
                                {`Name: ${this.state.currentBooking.helper_display.child_full_name}`}
                            </span>
                        </div>
                        <SignaturePad ref={(pad) => { this.signaturePad = pad; }} />
                        <div className="m-signature-pad__footer">
                            <button
                                type="button"
                                className="button m-signature-pad__button m-signature-pad__button--clear"
                                onClick={() => { this.signaturePad.clear(); }}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                className="button m-signature-pad__button m-signature-pad__button--done"
                                onClick={() => { this.sumbitSignature(); }}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                );
            } if (this.state.modalType === 'display-signature') {
                return (
                    <div className="display-signature-modal">
                        <img src={atob(this.state.currentBooking.signature.base64)} alt="" />
                        <button type="button" className="button" onClick={() => { this.closeModal(); }}>Close</button>
                    </div>
                );
            } if (this.state.modalType === 'club') {
                return (
                    <div className="club-modal">
                        <select id="club-select" className="club-modal__select" ref={(input) => { this.club = input; }} defaultValue="">
                            <option className="club-modal__option" value="" disabled>Select a club</option>
                            {
                                this.state.currentBooking.club.available_clubs.map((club) => {
                                    return (
                                        <option key={club.club_id} className="club-modal__option" value={club.club_id}>{club.club_name}</option>
                                    );
                                })
                            }
                        </select>

                        <div className="club-modal__buttons">
                            <button type="button" className="button club-modal__button club-modal__button--ok" onClick={() => { this.submitClub(); }}>Ok</button>
                            <button type="button" className="button club-modal__button club-modal__button--cancel" onClick={() => { this.closeModal(); }}>Cancel</button>
                        </div>
                    </div>
                );
            }
            return null;
        };

        const RegisterModal = () => {
            if (!this.state.modalOpen) {
                return null;
            }

            return (
                <Modal onClose={() => { return this.closeModal(); }} type={this.state.modalType}>
                    <ModalContents />
                </Modal>
            );
        };

        if (this.state.noBookings) {
            return (
                <div className="register">
                    <div className="register__top">
                        <h1 className="register__title">{`No bookings for ${this.state.registerTitle}`}</h1>

                        <div className="register__sync">
                            <p>
                                {`Last updated: ${this.state.lastUpdated}`}
                            </p>
                            <button type="button" className="button" onClick={() => { this.syncRegister(); }}>Update</button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={`register ${this.state.session ? `register--${this.state.session}` : ''}`}>
                <div className="register__top">
                    <div>
                        <h1 className="register__title">{this.state.registerTitle}</h1>
                        <p>
                            {'Live Count:'}
                            <span className="register__count">
                                {this.state.count}
                            </span>
                            <span className="register__total-bookings">
                                {` / ${this.state.totalBookings}`}
                            </span>
                        </p>
                    </div>

                    <div className="register__sync">
                        <p>
                            {`Last updated: ${this.state.lastUpdated}`}
                        </p>
                        <button type="button" className="button" onClick={() => { this.syncRegister(); }}>Update</button>
                    </div>
                </div>

                <table className="register__table">
                    <thead>
                        <tr className="register__header">
                            <th className="register__heading">Name</th>
                            {this.state.allSchools ? (<th className="register__heading">School</th>) : null}
                            <th className="register__heading">Slot</th>
                            <th className="register__heading">Year</th>
                            <th className="register__heading">Club</th>
                            <th className="register__heading">Attendence</th>
                            <th className="register__heading">Epipen?</th>
                            <th className="register__heading">Parents Signature</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            this.props.bookings.map((booking) => {
                                return (
                                    <tr key={booking.ID} className="register__booking">
                                        {/* Name */}
                                        <td className={`register__field register__field--name ${booking.helper_display.booking_has_emergency_note ? 'register__field--has-emergency-note' : ''}`}>
                                            <Link to={`/child/${booking.child_id}`}>{booking.helper_display.child_full_name}</Link>
                                        </td>

                                        {/* School */}
                                        {this.state.allSchools
                                            ? (
                                                <td className="register__field register__field--school">
                                                    <span style={{ color: `${booking.helper_display.school_colour_theme}` }}>{booking.helper_display.school_letter_code}</span>
                                                </td>
                                            )
                                            : null
                                        }

                                        {/* Slot */}
                                        <td className="register__field register__field--slot">
                                            <span>{booking.helper_display.time_label}</span>
                                        </td>

                                        {/* Year group */}
                                        <td className="register__field register__field--year-group">
                                            {booking.helper_display.child_year_group}
                                        </td>

                                        {/* Club */}
                                        <td className="register__field register__field--club">
                                            {booking.club.club_set ? booking.club.club_name : <button type="button" className="club-button" onClick={() => { this.onClubClick(booking); }}><FontAwesomeIcon icon={faPlus} /></button>}
                                        </td>

                                        {/* Attendance */}
                                        <td className="register__field register__field--attendance">
                                            <table className="register__sub-table sub-table">
                                                <thead>
                                                    <tr>
                                                        <td>In</td>
                                                        <td>Out</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className={`attendance-button attendance-button--in ${booking.attendance.time_in ? 'attendance-button--filled-in' : ''}`}
                                                                onClick={() => { this.onAttendanceClick('time_in', booking); }}
                                                            >
                                                                {booking.attendance.time_in || <FontAwesomeIcon icon={faPlus} />}
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <button
                                                                type="button"
                                                                className={`attendance-button attendance-button--out ${booking.attendance.time_out ? 'attendance-button--filled-in' : ''}`}
                                                                onClick={() => { this.onAttendanceClick('time_out', booking); }}
                                                                disabled={this.state.session === 'am'}
                                                            >
                                                                {booking.attendance.time_out || <FontAwesomeIcon icon={faPlus} />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>

                                        {/* Epipen */}
                                        <td className="register__field register__field--epipen">
                                            <div className={`register__epipen-required ${booking.helper_display.child_has_allergy_requiring_epipen ? 'register__epipen-required--true' : ''}`} />
                                        </td>

                                        {/* Signature */}
                                        <td className="register__field register__field-signature">
                                            <div className="register__signature">
                                                {
                                                    booking.signature.base64
                                                        ? <button type="button" className="register__signature-button register__signature-button--completed" onClick={() => { this.displaySignature(booking); }}><FontAwesomeIcon icon={faCheck} /></button>
                                                        : <button type="button" className="register__signature-button" onClick={() => { this.onSignatureClick(booking); }}><FontAwesomeIcon icon={faPlus} /></button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>

                <RegisterModal />
            </div>
        );
    }
}

Register.propTypes = {
    bookings: PropTypes.arrayOf(PropTypes.object),
    setBookings: PropTypes.func.isRequired,
    resetBookings: PropTypes.func.isRequired,
    updateBooking: PropTypes.func.isRequired,
    location: PropTypes.object
};

export default Register;
