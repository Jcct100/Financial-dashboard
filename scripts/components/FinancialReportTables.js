
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CSVLink } from 'react-csv';
import { toCSV } from 'react-csv/lib/core';
import { saveAs } from 'file-saver';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMinus,
    faTimes,
    faCheck,
    faFileDownload,
    faAngleRight,
    faAngleLeft
} from '@fortawesome/free-solid-svg-icons';
import { putBookingData, bookingData } from '../api';

class FinancialReportTables extends Component {
    constructor(props) {
        super(props);

        this.state = {
            csvData: [],
            attendDidntBook: [],
            min: 0,
            max: 0,
            forwardedArrow: false
        };
    }

    componentWillMount() {
        if (this.props.type === 'attendDidntBook') {
            this.setState({
                attendDidntBook: this.props.data.rows,
                min: this.props.min,
                max: this.props.max,
                forwardedArrow: this.props.forwardedArrow
            });
        }
    }

    showData = () => {
        const tablesData = [];
        const maxRows = this.props.viewAll ? this.props.data.rows.length : 3;

        for (let i = 0; i < maxRows; i++) {
            if (this.props.data.rows[i] !== undefined) {
                tablesData.push(this.props.data.rows[i]);
            }
        }
        return tablesData;
    }

    handleClick = (evt) => {
        evt.preventDefault();
    }

    removeBookings = (id) => {
        putBookingData(id, { action: 'DIDNT_BOOK_CLEARED' })
            .then(() => {
                bookingData(
                    {
                        pageNumber: this.props.currentPage,
                        startMonth: this.props.startMonth,
                        startYear: this.props.startYear,
                        endMonth: this.props.endMonth,
                        endYear: this.props.endYear
                    }
                )
                    .then((res) => {
                        this.setState({
                            attendDidntBook: res.data.rows
                        }, this.checkLimit);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
    }

    checkLimit = () => {
        const limit = 50;
        const count = this.state.attendDidntBook.length;

        this.setState(() => {
            return {
                forwardedArrow: count === limit,
                max: ((this.props.currentPage - 1) * 50) + count,
                min: count > 0 ? (((this.props.currentPage - 1) * 50) + 1) : 0
            };
        });
    }

    render() {
        let Table;
        switch (this.props.type) {
            case 'wac-report':
                Table = () => {
                    return (
                        <div className="finance-dashboard__wacReport">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="finance-dashboard__wacReport-table-header" colSpan="2">

                                            <h2 className="finance-dashboard__wacReport-labels">
                                                {this.props.data.title}
                                            </h2>

                                            <div className="finance-dashboard__wacReport-buttonAndIconWrapper">
                                                <div
                                                    className="finance-dashboard__wacReport-buttonAndIconWrapper-downloadIcon"
                                                >
                                                    <CSVLink
                                                        className="hidden"
                                                        filename={this.props.csvFilename}
                                                        data={this.state.csvData}
                                                        ref={(csv) => { this.csvElement = csv; }}
                                                        target="_blank"
                                                        onClick={(evt) => {
                                                            evt.preventDefault();
                                                            evt.stopPropagation();

                                                            this.props.downloadCSV()
                                                                .then((csvData) => {
                                                                    this.setState({ csvData }, () => {
                                                                        const blob = new Blob([toCSV(csvData, [], this.csvElement.props.separator)]);
                                                                        saveAs(blob, this.props.csvFilename);
                                                                    });
                                                                });
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faFileDownload} />
                                                    </CSVLink>
                                                </div>

                                                <div
                                                    className="finance-dashboard__wacReport-buttonAndIconWrapper-view-all"
                                                    onClick={this.props.toggleView}
                                                >
                                                    {this.props.viewAll ? <FontAwesomeIcon icon={faTimes} /> : 'View All'}
                                                </div>
                                            </div>

                                        </th>
                                    </tr>
                                </thead>

                                {this.showData().map((income) => {
                                    return (
                                        <tbody key={income.slug}>
                                            <tr>
                                                <td>
                                                    {income.title}
                                                </td>
                                                <td>
                                                    {`£${income.value.toFixed(2)}`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}

                            </table>
                        </div>
                    );
                };
                break;

            case 'ccv-Provider':
                Table = () => {
                    return (
                        <div className="finance-dashboard__ccvProvider">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="finance-dashboard__ccvProvider-table-header" colSpan="2">
                                            <h2 className="finance-dashboard__ccvProvider-labels">
                                                {this.props.data.title}
                                            </h2>

                                            <div className="finance-dashboard__wacReport-buttonAndIconWrapper">
                                                <div
                                                    className="finance-dashboard__wacReport-buttonAndIconWrapper-downloadIcon"
                                                    onClick={this.handleClick}
                                                >
                                                    <CSVLink
                                                        className="hidden"
                                                        filename={this.props.csvFilename}
                                                        data={this.state.csvData}
                                                        ref={(csv) => { this.csvElement = csv; }}
                                                        target="_blank"
                                                        asyncOnClick
                                                        onClick={(evt, done) => {
                                                            this.props.downloadCSV()
                                                                .then((csvData) => {
                                                                    this.setState({ csvData }, () => {
                                                                        const blob = new Blob([toCSV(csvData, [], this.csvElement.props.separator)]);
                                                                        saveAs(blob, this.props.csvFilename);
                                                                    });
                                                                });

                                                            done(false);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faFileDownload} />
                                                    </CSVLink>
                                                </div>
                                                <div
                                                    className="finance-dashboard__ccvProvider-view-all"
                                                    onClick={this.props.toggleView}
                                                >
                                                    {this.props.viewAll ? <FontAwesomeIcon icon={faTimes} /> : 'View All'}
                                                </div>
                                            </div>


                                        </th>
                                    </tr>
                                </thead>

                                {this.showData().map((provider) => {
                                    return (
                                        <tbody key={provider.slug}>
                                            <tr>
                                                <td>
                                                    {provider.title}
                                                </td>
                                                <td>
                                                    {`${provider.percentage_rounded}%`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}

                            </table>
                        </div>
                    );
                };
                break;

            case 'attendDidntBook':
                Table = () => {
                    return (
                        <div className="financial-report-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th className="financial-report-table--header" colSpan="8">
                                            <h2 className="financial-report-table-labels">
                                                {this.props.data.title}
                                            </h2>
                                            <div className="finance-dashboard__wacReport-buttonAndIconWrapper">

                                                <div
                                                    className="finance-dashboard__wacReport-buttonAndIconWrapper-downloadIcon"
                                                    onClick={this.handleClick}
                                                >
                                                    <CSVLink
                                                        className="hidden"
                                                        filename={this.props.csvFilename}
                                                        data={this.state.csvData}
                                                        ref={(csv) => { this.csvElement = csv; }}
                                                        target="_blank"
                                                        asyncOnClick
                                                        onClick={(evt, done) => {
                                                            this.props.downloadCSV()
                                                                .then((csvData) => {
                                                                    this.setState({ csvData }, () => {
                                                                        const blob = new Blob([toCSV(csvData, [], this.csvElement.props.separator)]);
                                                                        saveAs(blob, this.props.csvFilename);
                                                                    });
                                                                });

                                                            done(false);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faFileDownload} />
                                                    </CSVLink>
                                                </div>

                                                <div className="financial-report-table-pagination-arrows">
                                                    {this.props.currentPage > 1 ? (
                                                        <div onClick={this.props.getLessBookingsData} className="pagination-right-arrow">
                                                            <FontAwesomeIcon icon={faAngleLeft} />
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}

                                                    <span>{`${this.state.min} - ${this.state.max}`}</span>

                                                    {this.state.forwardedArrow ? (
                                                        <div onClick={this.props.getMoreBookingsData} className="pagination-left-arrow">
                                                            <FontAwesomeIcon icon={faAngleRight} />
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            </div>

                                        </th>
                                    </tr>
                                </thead>

                                <thead>
                                    <tr>
                                        <th className="financial-report-table--column-header">ID</th>
                                        <th className="financial-report-table--column-header">Child's Name</th>
                                        <th className="financial-report-table--column-header">Date</th>
                                        <th className="financial-report-table--column-header">Sign In Time</th>
                                        <th className="financial-report-table--column-header">Sign Out Time</th>
                                        <th className="financial-report-table--column-header">Duration (mins)</th>
                                        <th className="financial-report-table--column-header">Has Note</th>
                                        <th className="financial-report-table--column-header">Resolve</th>
                                    </tr>
                                </thead>

                                {this.state.attendDidntBook.map((booking) => {
                                    return (
                                        <tbody key={booking.booking_id}>
                                            <tr className="financial-report-table--labels">
                                                <td>
                                                    {booking.booking_id}
                                                </td>
                                                <td>
                                                    <Link to={`/child/${booking.child.child_id}`}>
                                                        {booking.child.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {booking.wac_date}
                                                </td>
                                                <td>
                                                    {booking.time_in === '' ? <FontAwesomeIcon icon={faMinus} /> : booking.time_in}
                                                </td>
                                                <td>
                                                    {booking.time_out === '' ? <FontAwesomeIcon icon={faMinus} /> : booking.time_out}
                                                </td>
                                                <td>
                                                    {booking.wac_duration_minutes === null ? <FontAwesomeIcon icon={faMinus} /> : booking.wac_duration_minutes}
                                                </td>
                                                <td>
                                                    <div className={`${booking.has_note ? 'has-notes' : 'no-notes'}`} />
                                                </td>
                                                <td><div className="financial-report-table--tick" onClick={() => { this.removeBookings(booking.booking_id); }}><FontAwesomeIcon icon={faCheck} /></div></td>
                                            </tr>
                                        </tbody>
                                    );
                                })}
                            </table>
                        </div>
                    );
                };
                break;

            case 'awaitingCreditRelease':
                Table = () => {
                    return (
                        <div className="financial-report-table">
                            <table>

                                <thead>
                                    <tr>
                                        <th className="financial-report-table--header" colSpan="6">
                                            <h2 className="financial-report-table-labels">
                                                {this.props.data.title}
                                            </h2>
                                            <div className="finance-dashboard__wacReport-buttonAndIconWrapper">
                                                <div
                                                    className="finance-dashboard__wacReport-buttonAndIconWrapper-downloadIcon"
                                                    onClick={this.handleClick}
                                                >
                                                    <CSVLink
                                                        className="hidden"
                                                        filename={this.props.csvFilename}
                                                        data={this.state.csvData}
                                                        ref={(csv) => { this.csvElement = csv; }}
                                                        target="_blank"
                                                        asyncOnClick
                                                        onClick={(evt, done) => {
                                                            this.props.downloadCSV()
                                                                .then((csvData) => {
                                                                    this.setState({ csvData }, () => {
                                                                        const blob = new Blob([toCSV(csvData, [], this.csvElement.props.separator)]);
                                                                        saveAs(blob, this.props.csvFilename);
                                                                    });
                                                                });

                                                            done(false);
                                                        }}
                                                    >
                                                        <FontAwesomeIcon icon={faFileDownload} />
                                                    </CSVLink>
                                                </div>
                                                <div
                                                    className="financial-report-table-view-all"
                                                    onClick={this.props.toggleView}
                                                >
                                                    {this.props.viewAll ? <FontAwesomeIcon icon={faTimes} /> : 'View All'}
                                                </div>
                                            </div>

                                        </th>
                                    </tr>
                                </thead>

                                <thead>
                                    <tr>
                                        <th className="financial-report-table--column-header">Order ID</th>
                                        <th className="financial-report-table--column-header">Parent Name</th>
                                        <th className="financial-report-table--column-header">CCV Provider</th>
                                        <th className="financial-report-table--column-header">Credits left to redeem</th>
                                        <th className="financial-report-table--column-header">Total credits requested</th>
                                        <th className="financial-report-table--column-header">Amount owed</th>
                                    </tr>
                                </thead>

                                {this.showData().map((order) => {
                                    return (
                                        <tbody key={order.order_id}>
                                            <tr className="financial-report-table--labels">
                                                <td>
                                                    {order.order_id}
                                                </td>
                                                <td>
                                                    <Link to={`/parent/${order.parent.id}`}>
                                                        {order.parent.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {order.ccv_provider.name}
                                                </td>
                                                <td>
                                                    {order.remaining_credits_to_release}
                                                </td>
                                                <td>
                                                    {order.total_ccv_credits_expected}
                                                </td>
                                                <td>
                                                    {`£${order.estimated_gbp_remaining.toFixed(2)}`}
                                                </td>
                                            </tr>
                                        </tbody>
                                    );
                                })}

                            </table>
                        </div>
                    );
                };
                break;

            default:
                throw new TypeError('Pass in a valid type');
        }

        return (
            <Table />
        );
    }
}

FinancialReportTables.propTypes = {
    type: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    viewAll: PropTypes.bool,
    toggleView: PropTypes.func,
    currentPage: PropTypes.number,
    forwardedArrow: PropTypes.bool,
    max: PropTypes.number,
    min: PropTypes.number,
    getLessBookingsData: PropTypes.func,
    getMoreBookingsData: PropTypes.func,
    downloadCSV: PropTypes.func.isRequired,
    csvFilename: PropTypes.string.isRequired,
    startYear: PropTypes.number,
    startMonth: PropTypes.number,
    endMonth: PropTypes.number,
    endYear: PropTypes.number
};

export default FinancialReportTables;
