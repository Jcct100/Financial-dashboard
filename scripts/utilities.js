// General Functions
export const capitalise = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export const addZero = (time) => {
    if (parseInt(time, 10) < 10) {
        /* eslint-disable-next-line  no-param-reassign */
        time = `0${parseInt(time, 10)}`;
    }

    if (typeof time === 'number') {
        return time.toString();
    }

    return time;
};

export const validateEmail = (email) => {
    const regex = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
    return regex.test(email);
};
