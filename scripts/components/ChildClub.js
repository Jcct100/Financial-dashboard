import React from 'react';
import PropTypes from 'prop-types';

import { capitalise } from '../utilities';

const ChildClub = ({ child, clubs }) => {
    return (
        <div className="child-club">
            <div className="child-club__heading">
                <h1>Club Information</h1>
            </div>

            {clubs.length < 1 ? (<p className="child-club__error">{`${child.full_name} does not attend any clubs.`}</p>) : null}

            <div className="child-club__message-box">
                {clubs.map((club) => {
                    return (
                        <div key={club.club_id} className="child-club__message-box--content">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="child-club__message-box--club-label">
                                        Club name:
                                        </td>
                                        <td className="child-club__message-box--club-data">
                                            {club.club_name}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="child-club__message-box--club-label">
                                        Day:
                                        </td>
                                        <td className="child-club__message-box--club-data">
                                            {club.days.map((day) => {
                                                return capitalise(day);
                                            }).join(', ')}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

ChildClub.propTypes = {
    child: PropTypes.object.isRequired,
    clubs: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ChildClub;
