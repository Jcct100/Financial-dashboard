import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const PaymentMethodChart = ({ paymentChart }) => {
    const colours = ['#e50f0f', '#6749d3', '#ffb500', '#f0fff0', '#481000', '#48104d'];

    const defaultStyling = {
        backgroundColor: 'transparent',
        borderColor: '#808080',
        pointHoverBorderColor: '#808080',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 6
    };

    const stylingForEachDataset = [];

    colours.map((colour) => {
        const styles = Object.assign({}, defaultStyling, {
            borderColor: colour,
            pointHoverBorderColor: colour
        });

        return stylingForEachDataset.push(styles);
    });

    const getDataSets = () => {
        if (typeof paymentChart !== 'undefined') {
            const paymentChartLength = paymentChart.data_sets.length;
            const paymentChartDatabase = paymentChart.data_sets;

            const mergedObjects = [];

            for (let i = 0; i < paymentChartLength; i++) {
                if (stylingForEachDataset[i] !== undefined) {
                    const mergedObject = Object.assign(stylingForEachDataset[i], paymentChartDatabase[i]);
                    mergedObjects.push(mergedObject);
                } else {
                    const mergedObject = Object.assign(defaultStyling, paymentChartDatabase[i]);
                    mergedObjects.push(mergedObject);
                }
            }
            return mergedObjects;
        }
        const emptyArray = [];
        return emptyArray;
    };

    const gotDataSets = getDataSets();

    const mergedDatasetAndMonths = () => {
        if (typeof paymentChart !== 'undefined') {
            const dataSets = {
                datasets: gotDataSets
            };
            const months = {
                labels: paymentChart.labels
            };
            const PaymentMethodChartData = Object.assign(months, dataSets);
            return PaymentMethodChartData;
        }
        const emptyArray = [];
        return emptyArray;
    };


    const chartData = mergedDatasetAndMonths();

    return (

        <div className="payment-method-chart">

            <Line
                data={chartData}

                options={{

                    legend: {
                        display: true,
                        position: 'right',
                        usePointStyle: true,
                        labels: {
                            fontSize: 12,
                            fontColor: '#000000',
                            fontFamily: 'GillSansMT',
                            fontStyle: 'bold',
                            boxWidth: 20,
                            display: true
                        }
                    },

                    scales: {
                        xAxes: [{
                            ticks: {
                                fontColor: '#000000',
                                fontStyle: 'bold',
                                fontFamily: 'GillSansMT'
                            },
                            gridLines: {
                                display: false
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                fontColor: '#000000',
                                fontStyle: 'bold',
                                fontFamily: 'GillSansMT',
                                min: 0,
                                stepSize: 10000
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },

                    tooltips: {
                        enabled: true,
                        caretPadding: 4,
                        custom(tooltipModel) {
                            const dataSets = tooltipModel.dataPoints;

                            const colors = stylingForEachDataset.map((data) => { return data.borderColor; });
                            const noOfDataset = paymentChart.data_sets.length;

                            if (dataSets) {
                                dataSets.forEach((data) => {
                                    for (let i = 0; i < noOfDataset; i++) {
                                        if (data.datasetIndex === i) {
                                            tooltipModel.backgroundColor = colors[i];
                                            break;
                                        }
                                        tooltipModel.backgroundColor = '#808080';
                                    }
                                });
                            }

                            tooltipModel.displayColors = false;
                            tooltipModel.cornerRadius = 0;
                        },

                        callbacks: {
                            label(tooltipItem) {
                                return `£${tooltipItem.yLabel}`;
                            }
                        }
                    }

                }}
            />

        </div>
    );
};

PaymentMethodChart.propTypes = {
    paymentChart: PropTypes.object.isRequired
};

export default PaymentMethodChart;
