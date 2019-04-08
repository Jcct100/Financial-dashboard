import { connect } from 'react-redux';
import {
    setBookings,
    resetBookings,
    updateBooking
} from '../actions';

import RegisterPage from '../components/Register';

const mapStateToProps = (state) => {
    return {
        bookings: state.bookings
    };
};

const mapStateToDispatch = (dispatch) => {
    return {
        setBookings: (bookings) => {
            dispatch(setBookings(bookings));
        },

        resetBookings: () => {
            dispatch(resetBookings());
        },

        updateBooking: (booking) => {
            dispatch(updateBooking(booking));
        }
    };
};

const Register = connect(
    mapStateToProps,
    mapStateToDispatch
)(RegisterPage);

export default Register;
