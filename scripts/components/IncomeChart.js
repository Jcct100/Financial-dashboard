
import React from 'react';
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

const IncomeChart = ({ incomeChart }) => {
    const findDataForIncome = () => {
        if (typeof incomeChart !== 'undefined') {
            const incomeData = incomeChart.map((income) => { return income.value; });
            return incomeData;
        }
        const emptyArray = [];
        return emptyArray;
    };

    const findDataForMonths = () => {
        if (typeof incomeChart !== 'undefined') {
            const monthData = incomeChart.map((month) => { return month.x_label; });
            return monthData;
        }
        const emptyArray = [];
        return emptyArray;
    };

    const graphData = {
        labels: findDataForMonths(),
        datasets: [
            {
                label: 'incomeChartData',
                data: findDataForIncome(),
                backgroundColor: 'transparent',
                pointHoverBorderColor: '#6749d3',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 6,
                borderColor: '#979797',
                lineTension: 0
            }
        ]
    };

    return (
        <div className="income-chart">


            <Line
                data={graphData}

                options={{
                    legend: {
                        display: false
                    },

                    scales: {
                        xAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: '#000000',
                                fontStyle: 'bold',
                                fontFamily: 'GillSansMT'
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                display: false
                            },
                            ticks: {
                                fontColor: '#000000',
                                fontStyle: 'bold',
                                fontFamily: 'GillSansMT',
                                min: 0,
                                stepSize: 10000
                            }
                        }]
                    },

                    tooltips: {
                        caretPadding: 4,
                        custom(tooltip) {
                            tooltip.displayColors = false;
                            tooltip.cornerRadius = 0;
                            tooltip.backgroundColor = '#6749d3';
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

IncomeChart.propTypes = {
    incomeChart: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default IncomeChart;
