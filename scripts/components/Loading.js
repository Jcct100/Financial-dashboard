import React from 'react';

const Loading = () => {
    return (
        <div className="loading-spinner">
            <div className="loading-spinner__cube--1 loading-spinner__cube" />
            <div className="loading-spinner__cube--2 loading-spinner__cube" />
            <div className="loading-spinner__cube--4 loading-spinner__cube" />
            <div className="loading-spinner__cube--3 loading-spinner__cube" />
        </div>
    );
};

export default Loading;
