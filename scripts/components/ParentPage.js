import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
    Tabs,
    TabList,
    Tab,
    TabPanel
} from 'react-tabs';

import Loading from './Loading';
import ContactInformation from './ContactInformation';
import ParentFamily from './ParentFamily';
import ParentOrders from './ParentOrders';
import ParentNotes from './ParentNotes';
import ParentEmail from './ParentEmail';

import { getParent } from '../api';

class ParentPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };
    }

    componentWillMount() {
        if (!this.props.selectedParent) {
            this.getParentData(this.props.match.params.id);
        }
    }

    componentWillReceiveProps(nextProps) {
        // If the current parent id does not match the next parent id
        // Get the new parent
        if (this.props.match.params.id !== nextProps.match.params.id) {
            this.getParentData(nextProps.match.params.id);
            this.setState({ loading: true });
        }
    }

    componentWillUnmount() {
        this.props.resetParent();
    }

    getParentData(id) {
        getParent(id)
            .then((res) => {
                this.props.setParent(res);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="parent">
                <h1 className="page__title">{`Parent - ${this.props.selectedParent.full_name}`}</h1>

                <Tabs>
                    <TabList>
                        <Tab>Family</Tab>
                        <Tab>Contact Information</Tab>
                        <Tab>Orders</Tab>
                        <Tab>Notes</Tab>
                        <Tab>Send Email</Tab>
                    </TabList>

                    <TabPanel><ParentFamily parent={this.props.selectedParent} family={this.props.family} setFamily={this.props.setFamily} /></TabPanel>
                    <TabPanel><ContactInformation user={this.props.selectedParent} type="parent" updateParent={this.props.updateParent} family={this.props.family} /></TabPanel>
                    <TabPanel><ParentOrders parent={this.props.selectedParent} orders={this.props.orders} setOrders={this.props.setOrders} /></TabPanel>
                    <TabPanel><ParentNotes parent={this.props.selectedParent} notes={this.props.notes} setParentNotes={this.props.setParentNotes} addParentNote={this.props.addParentNote} /></TabPanel>
                    <TabPanel><ParentEmail parent={this.props.selectedParent} /></TabPanel>
                </Tabs>
            </div>
        );
    }
}

ParentPage.propTypes = {
    selectedParent: PropTypes.object,
    setParent: PropTypes.func.isRequired,
    resetParent: PropTypes.func.isRequired,
    updateParent: PropTypes.func.isRequired,
    orders: PropTypes.arrayOf(PropTypes.object),
    setOrders: PropTypes.func.isRequired,
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    addParentNote: PropTypes.func.isRequired,
    setParentNotes: PropTypes.func.isRequired,
    family: PropTypes.object,
    setFamily: PropTypes.func.isRequired,
    match: PropTypes.object
};

export default ParentPage;
