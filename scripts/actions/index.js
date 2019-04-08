// User
export const setToken = (token = null, details = {}) => {
    return {
        type: 'SET_TOKEN',
        token,
        details
    };
};

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER'
    };
};

// Parent
export const setSelectedParent = (selectedParent = null) => {
    return {
        type: 'SET_SELECTED_PARENT',
        selectedParent
    };
};

export const resetSelectedParent = () => {
    return {
        type: 'RESET_SELECTED_PARENT'
    };
};

export const updateSelectedParent = (selectedParent = null) => {
    return {
        type: 'UPDATE_SELECTED_PARENT',
        selectedParent
    };
};

export const setSelectedParentFamily = (family = null) => {
    return {
        type: 'SET_SELECTED_PARENT_FAMILY',
        family
    };
};

export const setSelectedParentOrders = (orders = []) => {
    return {
        type: 'SET_SELECTED_PARENT_ORDERS',
        orders
    };
};

export const setSelectedParentNotes = (notes = []) => {
    return {
        type: 'SET_SELECTED_PARENT_NOTES',
        notes
    };
};

export const addSelectedParentNote = (note = {}) => {
    return {
        type: 'ADD_SELECTED_PARENT_NOTE',
        note
    };
};

// Child
export const setSelectedChild = (selectedChild = null) => {
    return {
        type: 'SET_SELECTED_CHILD',
        selectedChild
    };
};

export const setSelectedChildFamily = (family = null) => {
    return {
        type: 'SET_SELECTED_CHILD_FAMILY',
        family
    };
};

export const resetSelectedChild = () => {
    return {
        type: 'RESET_SELECTED_CHILD'
    };
};

export const setSelectedChildNotes = (notes = []) => {
    return {
        type: 'SET_SELECTED_CHILD_NOTES',
        notes
    };
};

export const addSelectedChildNote = (note = {}) => {
    return {
        type: 'ADD_SELECTED_CHILD_NOTE',
        note
    };
};

// Bookings
export const setBookings = (bookings = []) => {
    return {
        type: 'SET_BOOKINGS',
        bookings
    };
};

export const resetBookings = () => {
    return {
        type: 'RESET_BOOKINGS'
    };
};

export const updateBooking = (booking = null) => {
    return {
        type: 'UPDATE_BOOKING',
        booking
    };
};
