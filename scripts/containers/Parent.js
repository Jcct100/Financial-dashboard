import { connect } from 'react-redux';
import {
    setSelectedParent,
    resetSelectedParent,
    updateSelectedParent,
    setSelectedParentFamily,
    setSelectedParentOrders,
    setSelectedParentNotes,
    addSelectedParentNote
} from '../actions';

import ParentPage from '../components/ParentPage';

const mapStateToProps = (state) => {
    return {
        selectedParent: state.selectedParent.parent,
        family: state.selectedParent.family,
        orders: state.selectedParent.orders,
        notes: state.selectedParent.notes
    };
};

const mapStateToDispatch = (dispatch) => {
    return {
        setParent: (parent) => {
            dispatch(setSelectedParent(parent));
        },

        resetParent: () => {
            dispatch(resetSelectedParent());
        },

        updateParent: (parent) => {
            dispatch(updateSelectedParent(parent));
        },

        setFamily: (family) => {
            dispatch(setSelectedParentFamily(family));
        },

        setOrders: (orders) => {
            dispatch(setSelectedParentOrders(orders));
        },

        setParentNotes: (notes) => {
            dispatch(setSelectedParentNotes(notes));
        },

        addParentNote: (note) => {
            dispatch(addSelectedParentNote(note));
        }
    };
};

const Parent = connect(
    mapStateToProps,
    mapStateToDispatch
)(ParentPage);

export default Parent;
