const selectedChild = (state = {
    child: null,
    family: null,
    notes: []
}, action) => {
    switch (action.type) {
        case 'SET_SELECTED_CHILD':
            return {
                child: {
                    ...state.child,
                    ...action.selectedChild
                },
                family: state.family,
                notes: state.notes
            };

        case 'SET_SELECTED_CHILD_FAMILY':
            return {
                child: state.child,
                family: action.family,
                notes: state.notes
            };

        case 'RESET_SELECTED_CHILD':
            return {
                child: null,
                family: null,
                notes: []
            };

        case 'SET_SELECTED_CHILD_NOTES':
            return {
                child: state.child,
                family: state.family,
                notes: action.notes
            };

        case 'ADD_SELECTED_CHILD_NOTE':
            return {
                child: state.child,
                family: state.family,
                notes: [
                    action.note,
                    ...state.notes
                ]
            };

        default:
            return state;
    }
};

export default selectedChild;
