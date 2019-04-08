const bookings = (state = [], action) => {
    switch (action.type) {
        case 'SET_BOOKINGS':
            return [
                ...action.bookings
            ];

        case 'RESET_BOOKINGS':
            return [];

        case 'UPDATE_BOOKING':
            return state.map((booking) => {
                if (booking.ID !== action.booking.ID) {
                    return booking;
                }

                return {
                    ...booking,
                    ...action.booking
                };
            });

        default:
            return state;
    }
};

export default bookings;
