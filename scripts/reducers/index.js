import { combineReducers } from 'redux';

import user from './user';
import bookings from './bookings';
import selectedParent from './selectedParent';
import selectedChild from './selectedChild';

export default combineReducers({
    user,
    bookings,
    selectedParent,
    selectedChild
});
