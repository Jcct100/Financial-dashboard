const user = (state = {
    token: null,
    details: {}
}, action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return Object.assign({}, state, {
                token: action.token,
                details: action.details
            });

        case 'LOGOUT_USER':
            return {
                token: null,
                details: {}
            };

        default:
            return state;
    }
};

export default user;
