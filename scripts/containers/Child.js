import { connect } from 'react-redux';
import {
    setSelectedChild,
    setSelectedChildFamily,
    resetSelectedChild,
    setSelectedChildNotes,
    addSelectedChildNote
} from '../actions';

import ChildPage from '../components/ChildPage';

const mapStateToProps = (state) => {
    return {
        selectedChild: state.selectedChild.child,
        family: state.selectedChild.family,
        notes: state.selectedChild.notes
    };
};

const mapStateToDispatch = (dispatch) => {
    return {
        setChild: (child) => {
            dispatch(setSelectedChild(child));
        },

        setFamily: (family) => {
            dispatch(setSelectedChildFamily(family));
        },

        resetChild: () => {
            dispatch(resetSelectedChild());
        },

        setChildNotes: (notes) => {
            dispatch(setSelectedChildNotes(notes));
        },

        addChildNote: (note) => {
            dispatch(addSelectedChildNote(note));
        }
    };
};

const Child = connect(
    mapStateToProps,
    mapStateToDispatch
)(ChildPage);

export default Child;
