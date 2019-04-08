import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Loading from './Loading';
import UserCard from './UserCard';

import { getFamilyByParent } from '../api';

class ParentFamily extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        getFamilyByParent(this.props.parent.ID)
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
            <div className="parent__family">
                <UserCard
                    type="parent"
                    id={this.props.parent.ID}
                    fullName={this.props.parent.full_name}
                    addBorderColors
                />
                {
                    this.props.family.children.map((child) => {
                        return (
                            <UserCard
                                key={child.ID}
                                type="child"
                                id={child.ID}
                                fullName={child.full_name}
                                dateOfBirth={child.personal.dateOfBirth}
                            />
                        );
                    })
                }
            </div>
        );
    }
}

ParentFamily.propTypes = {
    parent: PropTypes.object.isRequired,
    family: PropTypes.object,
    setFamily: PropTypes.func.isRequired
};

export default ParentFamily;
