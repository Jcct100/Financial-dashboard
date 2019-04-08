import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Tabs, TabList, Tab, TabPanel
} from 'react-tabs';

import Loading from './Loading';
import ContactInformation from './ContactInformation';
import ChildFamily from './ChildFamily';
import ChildMedicalInformation from './ChildMedicalInformation';
import ChildNotes from './ChildNotes';
import ChildClub from './ChildClub';


import { getChild } from '../api';

class ChildPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        if (!this.props.selectedChild) {
            this.getChildData(this.props.match.params.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        // If the current child id does not match the next child id
        // Get the new child
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getChildData(nextProps.match.params.id);
            this.setState({ loading: true });
        }
    }

    componentWillUnmount() {
        this.props.resetChild();
    }

    getChildData(id) {
        getChild(id)
            .then((res) => {
                this.props.setChild(res);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="child">
                <h1 className="page__title">{`Child - ${this.props.selectedChild.full_name}`}</h1>

                <Tabs>
                    <TabList>
                        <Tab>Family</Tab>
                        <Tab>Contact Information</Tab>
                        <Tab>Medical</Tab>
                        <Tab>Clubs</Tab>
                        <Tab>Notes</Tab>
                    </TabList>

                    <TabPanel><ChildFamily child={this.props.selectedChild} family={this.props.family} setFamily={this.props.setFamily} /></TabPanel>
                    <TabPanel><ContactInformation user={this.props.selectedChild} type="child" family={this.props.family} /></TabPanel>
                    <TabPanel><ChildMedicalInformation child={this.props.selectedChild.medical} /></TabPanel>
                    <TabPanel><ChildClub child={this.props.selectedChild} clubs={this.props.selectedChild.attended_clubs} /></TabPanel>
                    <TabPanel><ChildNotes child={this.props.selectedChild} notes={this.props.notes} setChildNotes={this.props.setChildNotes} addChildNote={this.props.addChildNote} /></TabPanel>
                </Tabs>
            </div>
        );
    }
}

ChildPage.propTypes = {
    selectedChild: PropTypes.object,
    family: PropTypes.object,
    setChild: PropTypes.func.isRequired,
    setFamily: PropTypes.func.isRequired,
    resetChild: PropTypes.func.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    addChildNote: PropTypes.func.isRequired,
    setChildNotes: PropTypes.func.isRequired,
    match: PropTypes.object
};

export default ChildPage;
