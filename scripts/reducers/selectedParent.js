const selectedParent = (state = {
    parent: null,
    family: null,
    orders: [],
    notes: []
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_PARENT':
        case 'UPDATE_SELECTED_PARENT':
            return {
                parent: {
                    ...state.parent,
                    ...action.selectedParent
                },
                family: state.family,
                orders: state.orders,
                notes: state.notes
            };

        case 'RESET_SELECTED_PARENT':
            return {
                parent: null,
                family: null,
                orders: [],
                notes: []
            };

        case 'SET_SELECTED_PARENT_FAMILY':
            return {
                parent: state.parent,
                family: action.family,
                orders: state.orders,
                notes: state.notes
            };

        case 'SET_SELECTED_PARENT_ORDERS':
            return {
                parent: state.parent,
                family: state.family,
                orders: action.orders,
                notes: state.notes
            };

        case 'SET_SELECTED_PARENT_NOTES':
            return {
                parent: state.parent,
                family: state.family,
                orders: state.orders,
                notes: action.notes
            };

        case 'ADD_SELECTED_PARENT_NOTE':
            return {
                parent: state.parent,
                family: state.family,
                orders: state.orders,
                notes: [
                    action.note,
                    ...state.notes
                ]
            };

        default:
            return state;
    }
};

export default selectedParent;
