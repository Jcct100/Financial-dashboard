import React from 'react';
import { Link } from 'react-router-dom';

import { capitalise } from '../utilities';

const UserCard = (user) => {
    return (
        <Link
            to={`/${user.type}/${user.id}`}
            className={`card user-card ${user.addBorderColors ? 'user-card--border-colours' : ''}`}
        >
            <div className="card__header">
                <span className="user-card__type">{ capitalise(user.type) }</span>
                <span className="user-card__icon">{ user.fullName.charAt(0).toUpperCase() }</span>
            </div>
            <div className="card__body">
                <p>{`ID: ${user.id}`}</p>
                <p>{`Full Name: ${user.fullName}` }</p>
                <p>{user.dateOfBirth ? `Date of birth: ${user.dateOfBirth}` : ''}</p>
            </div>
        </Link>
    );
};

export default UserCard;
