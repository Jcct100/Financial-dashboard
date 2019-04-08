import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getFamily } from '../api';

import Loading from './Loading';
import UserCard from './UserCard';

class ChildFamily extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        getFamily(this.props.child.ID)
            .then((res) => {
                this.props.setFamily(res);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="child__family">
                <UserCard type="parent" id={this.props.family.parent.ID} fullName={this.props.family.parent.full_name} />
                {
                    this.props.family.children.map((child) => {
                        const selectedChild = this.props.child.ID === child.ID;

                        return (
                            <UserCard key={child.ID} type="child" id={child.ID} fullName={child.full_name} dateOfBirth={child.personal.dateOfBirth} addBorderColors={selectedChild} />
                        );
                    })
                }
            </div>
        );
    }
}

ChildFamily.propTypes = {
    child: PropTypes.object.isRequired,
    family: PropTypes.object,
    setFamily: PropTypes.func.isRequired
};

export default ChildFamily;
