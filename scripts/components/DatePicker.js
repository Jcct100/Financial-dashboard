import Datetime from 'react-datetime';
import React from 'react';
import PropTypes from 'prop-types';

const DatePicker = ({ handleOnChange }) => {
    return (
        <div>
            <Datetime
                timeFormat={false}
                onChange={handleOnChange}
                viewMode="months"
                dateFormat="YYYY-MM"
                input={false}
                closeOnSelect
            />
        </div>
    );
};

DatePicker.propTypes = {
    handleOnChange: PropTypes.func.isRequired
};

export default DatePicker;
