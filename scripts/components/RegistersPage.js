import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { getSchools, getExportedRegister } from '../api';

class RegistersPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            schools: [],
            redirectUrl: null
        };
    }

    componentWillMount() {
        getSchools()
            .then((res) => {
                this.setState({ schools: res });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    todaysRegister() {
        let redirectUrl = `/register?date=today&session=${this.todaysSession.value}`;

        if (this.todaysSchool.value) {
            redirectUrl += `&school=${this.todaysSchool.value}`;
        }

        this.setState({ redirectUrl });
    }

    exportRegister() {
        if (!this.exportDate.value || !this.exportSchool.value || !this.exportSession.value) {
            return;
        }

        const date = this.exportDate.value;
        const school = this.exportSchool.value;
        const session = this.exportSession.value;

        getExportedRegister(date, school, session);
    }

    searchRegister() {
        const date = this.searchDate.value;
        const school = this.searchSchool.value || null;
        const session = this.searchSession.value;

        let redirectUrl = `/register?date=${date}&session=${session}`;

        if (school !== null) {
            redirectUrl += `&school=${school}`;
        }

        this.setState({ redirectUrl });
    }

    render() {
        if (this.state.redirectUrl) {
            return (
                <Redirect to={this.state.redirectUrl} />
            );
        }

        return (
            <div className="registers">
                <h1 className="registers__title">Registers</h1>

                <div className="registers__block todays-register">
                    <h2 className="registers__sub-title">Today's WAC</h2>

                    <div className="registers__block-body">
                        <div className="registers__selects">
                            <select
                                ref={(select) => { this.todaysSchool = select; }}
                                className="registers__select todays-register__select todays-register__select--school"
                                defaultValue=""
                            >
                                <option value="">All Schools</option>
                                {this.state.schools.map((school) => {
                                    return (
                                        <option
                                            key={school.ID}
                                            value={school.ID}
                                        >
                                            {school.name}
                                        </option>
                                    );
                                })}
                            </select>

                            <select ref={(select) => { this.todaysSession = select; }} className="registers__select todays-register__select todays-register__select--session" defaultValue="am">
                                <option value="am">AM</option>
                                <option value="pm">PM</option>
                            </select>
                        </div>

                        <button type="button" className="button button--inverse registers__button" onClick={() => { this.todaysRegister(); }}>Go</button>
                    </div>
                </div>

                <div className="registers__block search-register">
                    <h2 className="registers__sub-title">Search for a register</h2>

                    <div className="registers__block-body search-register__body">
                        <input type="date" ref={(input) => { this.searchDate = input; }} className="registers__date-input search-register__date-input" defaultValue={new Date().toISOString().substr(0, 10)} />

                        <select ref={(select) => { this.searchSchool = select; }} className="registers__select search-register__select search-register__select--school" defaultValue="">
                            <option value="">All Schools</option>
                            {this.state.schools.map((school) => {
                                return (
                                    <option key={school.ID} value={school.ID}>{school.name}</option>
                                );
                            })}
                        </select>

                        <select ref={(select) => { this.searchSession = select; }} className="registers__select search-register__select search-register__select--session" defaultValue="am">
                            <option value="am">AM</option>
                            <option value="pm">PM</option>
                        </select>

                        <button type="button" className="button button--inverse registers__button search-register__button" onClick={() => { this.searchRegister(); }}>Search</button>
                    </div>
                </div>

                <div className="registers__block export-register">
                    <h2 className="registers__sub-title">Export a register</h2>

                    <div className="registers__block-body export-register__body">
                        <input type="date" ref={(input) => { this.exportDate = input; }} className="registers__date-input export-register__date-input" defaultValue={new Date().toISOString().substr(0, 10)} />

                        <select ref={(select) => { this.exportSchool = select; }} className="registers__select export-register__select export-register__select--school">
                            {this.state.schools.map((school) => {
                                return (
                                    <option key={school.ID} value={school.ID}>{school.name}</option>
                                );
                            })}
                        </select>

                        <select ref={(select) => { this.exportSession = select; }} className="registers__select export-register__select export-register__select--session">
                            <option value="am">AM</option>
                            <option value="pm">PM</option>
                        </select>

                        <button type="button" className="button button--inverse registers__button export-register__button" onClick={() => { this.exportRegister(); }}>Export</button>
                    </div>
                </div>

            </div>
        );
    }
}

export default RegistersPage;
