import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import Loading from './Loading';
import IncomeChart from './IncomeChart';
import PaymentMethodChart from './PaymentMethodChart';
import DatePicker from './DatePicker';
import FinancialReportTables from './FinancialReportTables';

import { bookingData, getFinanceData, csvData } from '../api';
import { addZero } from '../utilities';

class FinancePage extends Component {
    constructor() {
        super();

        this.startWith = this.startWith.bind(this);
        this.endWith = this.endWith.bind(this);

        this.state = {
            paymentMethodChartData: {},
            incomeChartData: {},
            ccvProviderData: {},
            attendDidntBookData: {},
            wacReportData: {},
            awaitingCreditReleaseData: {},
            attendDidntBookDataCsvData: [],
            wacReportCsvData: [],
            ccvProviderCsvData: [],
            awaitingCreditReleaseCsvData: [],
            incomeChartTitle: '',
            paymentMethodChartTitle: '',
            startYear: '',
            startMonth: '',
            endYear: '',
            endMonth: '',
            showCalendarOne: false,
            showCalendarTwo: false,
            wacReportViewAll: false,
            ccvProviderViewAll: false,
            awaitingCreditReleaseViewAll: false,
            loading: true,
            errorResponseStatus: {},
            pages: 1,
            totalBookings: '',
            max: 0,
            min: 0,
            forwardedArrow: false
        };
    }

    componentWillMount() {
        const TodayDate = new Date();
        const currentMonth = TodayDate.getMonth() + 1;
        const currentYear = TodayDate.getFullYear();
        const nextMonth = TodayDate.getMonth() + 2;

        let comingMonth;

        if (currentMonth === 12) {
            comingMonth = nextMonth - 12;
        } else {
            comingMonth = nextMonth;
        }

        this.setState({
            startYear: currentYear,
            startMonth: currentMonth,
            endMonth: comingMonth,
            endYear: currentYear
        });

        const startYear = currentYear;
        const startMonth = currentMonth;
        const endMonth = nextMonth;
        const endYear = currentYear;

        getFinanceData(startYear, startMonth, endYear, endMonth)
            .then(([incomeChartData, paymentMethodChartData, ccvProviderData, attendDidntBookData, wacReportData, awaitingCreditReleaseData]) => {
                this.setState({
                    incomeChartData: incomeChartData.data.data_table.data,
                    incomeChartTitle: incomeChartData.data.data_table.title,
                    paymentMethodChartData: paymentMethodChartData.data,
                    paymentMethodChartTitle: paymentMethodChartData.data.title,
                    ccvProviderData: ccvProviderData.data,
                    attendDidntBookData: attendDidntBookData.data,
                    wacReportData: wacReportData.data,
                    awaitingCreditReleaseData: awaitingCreditReleaseData.data,
                    totalBookings: attendDidntBookData.data.rows.length
                }, this.checkLimit);
            }).catch((error) => {
                console.log(error);
                return this.setState({ errorResponseStatus: error.response.status });
            });
    }

    getBookingData() {
        const data = {
            pageNumber: this.state.pages,
            startMonth: this.state.startMonth,
            startYear: this.state.startYear,
            endMonth: this.state.endMonth,
            endYear: this.state.endYear
        };

        bookingData(data)
            .then((attendDidntBookData) => {
                if (attendDidntBookData.data.rows) {
                    this.setState({
                        attendDidntBookData: attendDidntBookData.data,
                        totalBookings: attendDidntBookData.data.rows.length
                    }, this.checkLimit);
                }
            }).catch((error) => { return console.log(error); });
    }

    checkLimit = () => {
        const limit = 50;
        const count = this.state.totalBookings;

        this.setState((prevState) => {
            return {
                forwardedArrow: count === limit,
                max: ((prevState.pages - 1) * 50) + count,
                min: ((prevState.pages - 1) * 50),
                loading: false
            };
        });
    }

    paginateBookings = (next) => {
        this.setState((prevState) => {
            return {
                pages: next ? prevState.pages + 1 : prevState.pages - 1,
                totalBookings: prevState.attendDidntBookData.rows.length,
                loading: true
            };
        }, this.getBookingData);
    }

    getCsvData = (type, pageNumber = 1) => {
        const data = {
            type,
            pageNumber,
            startMonth: this.state.startMonth,
            startYear: this.state.startYear,
            endMonth: this.state.endMonth,
            endYear: this.state.endYear
        };

        let dataRef;
        switch (type) {
            case 'attendedDidntBook':
                dataRef = 'attendDidntBookDataCsvData';
                break;

            case 'wac-report':
                dataRef = 'wacReportCsvData';
                break;

            case 'ccv-Provider':
                dataRef = 'ccvProviderCsvData';
                break;

            case 'awaitingCreditRelease':
                dataRef = 'awaitingCreditReleaseCsvData';
                break;

            default:
                throw new TypeError('pass in a valid type');
        }

        return new Promise((resolve, reject) => {
            csvData(data)
                .then((res) => {
                    this.setState((prevState) => {
                        if (type === 'attendedDidntBook') {
                            return {
                                [dataRef]: [
                                    ...prevState[dataRef],
                                    ...res.data.rows
                                ]
                            };
                        }

                        return {
                            [dataRef]: res.data.rows
                        };
                    }, () => {
                        if (res.data.rows.length === 50) {
                            resolve(this.getCsvData(type, pageNumber + 1));
                        } else {
                            switch (type) {
                                case 'wac-report':
                                    resolve(this.wacReportCsvReport());
                                    break;

                                case 'ccv-Provider':
                                    resolve(this.ccvProvidersCsvReport());
                                    break;

                                case 'attendedDidntBook':
                                    resolve(this.attendDidntBookDataCsvReport());
                                    break;

                                case 'awaitingCreditRelease':
                                    resolve(this.awaitingCreditReleaseDataCsvReport());
                                    break;

                                default:
                                    reject(new TypeError('pass in a valid type'));
                            }
                        }
                    });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    wacReportCsvReport = () => {
        const dataForCSV = this.state.wacReportCsvData;
        const csvData = [['Title', 'Amount']];

        return new Promise((resolve) => {
            if (dataForCSV.length) {
                const array = dataForCSV.map((item) => {
                    return [item.title, item.value];
                });
                resolve(csvData.concat(array));
            } else {
                resolve(csvData);
            }
        });
    }

    ccvProvidersCsvReport = () => {
        const dataForCSV = this.state.ccvProviderCsvData;
        const csvData = [['Provider', 'Percentage']];

        return new Promise((resolve) => {
            if (dataForCSV.length) {
                const array = dataForCSV.map((item) => {
                    return [item.title, `${item.percentage_rounded}%`];
                });
                resolve(csvData.concat(array));
            } else {
                resolve(csvData);
            }
        });
    }

    attendDidntBookDataCsvReport = () => {
        const dataForCSV = this.state.attendDidntBookDataCsvData;
        const csvData = [['ID', 'Child\'s Name', 'Date', 'Sign In Time', 'Sign Out Time', 'Duration', 'Has Note']];

        return new Promise((resolve) => {
            if (dataForCSV.length) {
                const array = dataForCSV.map((item) => {
                    return [item.booking_id, item.child.name, item.wac_date, item.time_in, item.time_out, item.wac_duration_minutes, item.has_note];
                });
                resolve(csvData.concat(array));
            } else {
                resolve(csvData);
            }
        });
    }

    awaitingCreditReleaseDataCsvReport = () => {
        const dataForCSV = this.state.awaitingCreditReleaseCsvData;
        const csvData = [['Order ID', 'Parent Name', 'CCV Provider', 'Credits left to redeem', 'Total credits requested', 'Amount owed']];

        return new Promise((resolve) => {
            if (dataForCSV.length) {
                const array = dataForCSV.map((item) => {
                    return [item.order_id, item.parent.name, item.ccv_provider.slug, item.remaining_credits_to_release, item.total_ccv_credits_expected, item.estimated_gbp_remaining];
                });
                resolve(csvData.concat(array));
            } else {
                resolve(csvData);
            }
        });
    }

    incomeChartDataCsvReport = () => {
        const dataForCSV = this.state.incomeChartData;
        const labels = [['Date', 'Income']];

        if (Array.isArray(dataForCSV)) {
            const array = dataForCSV.map((item) => {
                return [item.x_label, item.value];
            });
            return labels.concat(array);
        }
        return labels;
    }

    paymentMethodChartDataCsvReport = () => {
        const dataForCSV = this.state.paymentMethodChartData;
        const labels = [['Date', 'Stripe', 'Staff', 'CCV']];

        if (Array.isArray(dataForCSV.data_sets)) {
            const dates = dataForCSV.labels.map((date) => { return ([date]); });
            dataForCSV.data_sets.map((dataSet) => {
                const array = dataSet.data.map((item, index) => {
                    const data = dates[index].push(item);
                    return data;
                });
                return array;
            });

            const array = dates.map((item) => {
                labels.push(item);
                return array;
            });
        }
        return labels;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const startYear = parseInt(this.state.startYear, 10);
        const startMonth = parseInt(this.state.startMonth, 10);
        const endYear = parseInt(this.state.endYear, 10);
        const endMonth = parseInt(this.state.endMonth, 10);

        this.setState({ loading: true });

        if (startYear < endYear || (startYear === endYear && startMonth <= endMonth)) {
            getFinanceData(startYear, startMonth, endYear, endMonth)
                .then(([incomeChartData, paymentMethodChartData, ccvProviderData, attendDidntBookData, wacReportData, awaitingCreditReleaseData]) => {
                    this.setState({
                        incomeChartData: incomeChartData.data.data_table.data,
                        incomeChartTitle: incomeChartData.data.data_table.title,
                        paymentMethodChartData: paymentMethodChartData.data,
                        paymentMethodChartTitle: paymentMethodChartData.data.title,
                        ccvProviderData: ccvProviderData.data,
                        attendDidntBookData: attendDidntBookData.data,
                        wacReportData: wacReportData.data,
                        awaitingCreditReleaseData: awaitingCreditReleaseData.data,
                        totalBookings: attendDidntBookData.data.rows.length,
                        loading: false
                    }, this.checkLimit);
                }).catch((error) => { return console.log(error); });
        } else {
            this.setState({ loading: false });
        }
    }

    toggleCalendarOne = () => {
        this.setState((prevState) => {
            return {
                showCalendarOne: !prevState.showCalendarOne
            };
        });
    }

    toggleCalendarTwo = () => {
        this.setState((prevState) => {
            return {
                showCalendarTwo: !prevState.showCalendarTwo
            };
        });
    }

    closeCalendar = () => {
        this.setState({ showCalendarOne: false, showCalendarTwo: false });
    }

    toggleView = (type) => {
        let stateKey;

        switch (type) {
            case 'wac-report':
                stateKey = 'wacReportViewAll';
                break;

            case 'ccv-Provider':
                stateKey = 'ccvProviderViewAll';
                break;

            case 'awaitingCreditRelease':
                stateKey = 'awaitingCreditReleaseViewAll';
                break;

            default:
                throw new TypeError('pass in a valid type');
        }

        if (stateKey) {
            this.setState((prevState) => {
                return {
                    [stateKey]: !prevState[stateKey]
                };
            });
        }
    }

    /* eslint-disable no-underscore-dangle */
    startWith(date) {
        const year = parseInt(moment(date._d).format('Y'), 10);
        const month = moment(date._d).format('M');
        this.setState({ startYear: year, startMonth: month });
    }

    endWith(date) {
        const year = parseInt(moment(date._d).format('Y'), 10);
        const month = moment(date._d).format('M');
        this.setState({ endYear: year, endMonth: month });
    }
    /* eslint-enable no-underscore-dangle */

    render() {
        const incomeChartDataCsvReport = this.incomeChartDataCsvReport();
        const paymentMethodChartDataCsvReport = this.paymentMethodChartDataCsvReport();

        if (this.state.errorResponseStatus === 403) {
            return (
                <h2 className="error-response-status-message-styling">Sorry you do not have the required capabilities to view this page</h2>
            );
        }

        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        const startDate = `${this.state.startMonth} / ${this.state.startYear}`;
        const endDate = `${this.state.endMonth} / ${this.state.endYear}`;

        return (
            <div className="finance-dashboard">

                <div className="finance-dashboard__filters">
                    <form onSubmit={this.handleSubmit}>
                        <div className="dashboard-selector finance-dashboard__datapickers-container">

                            <div className="finance-dashboard__datapickers-headings">
                                Start
                            </div>

                            <div>
                                <div
                                    onClick={this.toggleCalendarOne}
                                    className={this.state.showCalendarOne ? 'finance-dashboard__open-calendar' : 'finance-dashboard__close-calendar'}
                                    readOnly
                                >
                                    {startDate}
                                </div>
                                {this.state.showCalendarOne ? (
                                    <DatePicker handleOnChange={this.startWith} />
                                ) : (
                                    null
                                )}
                            </div>

                            <div className="finance-dashboard__datapickers-headings">
                                End
                            </div>

                            <div>
                                <div
                                    onClick={this.toggleCalendarTwo}
                                    className={this.state.showCalendarTwo ? 'finance-dashboard__open-calendar' : 'finance-dashboard__close-calendar'}
                                    readOnly
                                >
                                    {endDate}
                                </div>
                                {this.state.showCalendarTwo ? (
                                    <DatePicker handleOnChange={this.endWith} />
                                ) : (
                                    null
                                )}
                            </div>

                        </div>

                        <input
                            type="submit"
                            value="Submit"
                            className="dashboard-submit"
                        />

                    </form>

                </div>


                <div className="graph__wrapper">

                    <div className="graph__header">
                        <h2>
                            {this.state.incomeChartTitle}
                        </h2>
                        <div className="graph__header-downloadIcon">
                            <CSVLink data={incomeChartDataCsvReport} filename="incomeChart.csv">
                                <FontAwesomeIcon icon={faFileDownload} />
                            </CSVLink>
                        </div>
                    </div>

                    <IncomeChart
                        incomeChart={this.state.incomeChartData}
                        incomeChartDataCsvReport={incomeChartDataCsvReport}
                    />

                </div>

                <div className="graph__wrapper">

                    <div className="graph__header">
                        <h2>
                            {this.state.paymentMethodChartTitle}
                        </h2>
                        <div className="graph__header-downloadIcon">
                            <CSVLink data={paymentMethodChartDataCsvReport} filename="stillAwaitingCreditRelease.csv">
                                <FontAwesomeIcon icon={faFileDownload} />
                            </CSVLink>
                        </div>
                    </div>

                    <PaymentMethodChart
                        paymentChart={this.state.paymentMethodChartData}
                        paymentMethodChartDataCsvReport={paymentMethodChartDataCsvReport}
                    />

                </div>

                <FinancialReportTables
                    type="wac-report"
                    data={this.state.wacReportData}
                    viewAll={this.state.wacReportViewAll}
                    toggleView={() => { this.toggleView('wac-report'); }}
                    downloadCSV={() => { return this.getCsvData('wac-report'); }}
                    csvFilename={`wac-report_${addZero(this.state.startMonth)}-${this.state.startYear}_${addZero(this.state.endMonth)}-${this.state.endYear}.csv`}
                />

                <FinancialReportTables
                    type="ccv-Provider"
                    data={this.state.ccvProviderData}
                    viewAll={this.state.ccvProviderViewAll}
                    toggleView={() => { this.toggleView('ccv-Provider'); }}
                    downloadCSV={() => { return this.getCsvData('ccv-Provider'); }}
                    csvFilename={`ccv-provider_${addZero(this.state.startMonth)}-${this.state.startYear}_${addZero(this.state.endMonth)}-${this.state.endYear}.csv`}
                />

                <FinancialReportTables
                    type="attendDidntBook"
                    startYear={this.state.startYear}
                    startMonth={this.state.startMonth}
                    endYear={this.state.endYear}
                    endMonth={this.state.endMonth}
                    data={this.state.attendDidntBookData}
                    attendDidntBookDataCsvReport={this.state.attendDidntBookDataCsvData}
                    getMoreBookingsData={() => { this.paginateBookings(true); }}
                    getLessBookingsData={() => { this.paginateBookings(false); }}
                    currentPage={this.state.pages}
                    totalBookings={this.state.totalBookings}
                    max={this.state.max}
                    min={this.state.min}
                    forwardedArrow={this.state.forwardedArrow}
                    downloadCSV={() => { return this.getCsvData('attendedDidntBook'); }}
                    csvFilename={`attended-didnt-book_${addZero(this.state.startMonth)}-${this.state.startYear}_${addZero(this.state.endMonth)}-${this.state.endYear}.csv`}
                />

                <FinancialReportTables
                    type="awaitingCreditRelease"
                    data={this.state.awaitingCreditReleaseData}
                    viewAll={this.state.awaitingCreditReleaseViewAll}
                    toggleView={() => { this.toggleView('awaitingCreditRelease'); }}
                    downloadCSV={() => { return this.getCsvData('awaitingCreditRelease'); }}
                    csvFilename={`awaiting-credit-release_${addZero(this.state.startMonth)}-${this.state.startYear}_${addZero(this.state.endMonth)}-${this.state.endYear}.csv`}
                />

            </div>

        );
    }
}

export default FinancePage;
