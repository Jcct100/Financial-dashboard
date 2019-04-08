import axiosAPI from 'axios';

import { saveAs } from 'file-saver';

// Switch the base url based on the env
const baseURL = process.env.REACT_APP_ENV === 'dev' ? 'https://wac.wearefx.uk/wp-json' : 'https://wac.berkhamsted.com/wp-json';

let authToken = null;

const axios = axiosAPI.create({
    baseURL: `${baseURL}/wacapp/v1`
});

const get = (url) => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const post = (url, data) => {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const patch = (url, data) => {
    return new Promise((resolve, reject) => {
        axios.patch(url, data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

const put = (url, data) => {
    return new Promise((resolve, reject) => {
        axios.put(url, data)
            .then((res) => {
                resolve(res);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// User functions
export const loginUser = (data) => {
    return new Promise((resolve, reject) => {
        axiosAPI.post(`${baseURL}/jwt-auth/v1/token`, data)
            .then((res) => {
                authToken = res.data.token;

                // Setting the token for all requests
                axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;


                resolve(res.data);
            })
            .catch((error) => {
                // Failed to get token
                reject(error);
            });
    });
};

// Parent
export const getParent = (id) => {
    return new Promise((resolve, reject) => {
        get(`/parent/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const patchParent = (id, data) => {
    return new Promise((resolve, reject) => {
        patch(`/parent/${id}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getFamilyByParent = (id) => {
    return new Promise((resolve, reject) => {
        get(`/parent/${id}/family`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                console.log(error);
                reject(error);
            });
    });
};

export const getParentOrders = (id) => {
    return new Promise((resolve, reject) => {
        get(`/parent/${id}/orders`)
            .then((res) => {
                if (res.status === 204) {
                    resolve([]);
                }

                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getParentNotes = (id) => {
    return new Promise((resolve, reject) => {
        get(`/parent/${id}/family/notes`)
            .then((res) => {
                if (res.status === 204) {
                    resolve([]);
                }

                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const postParentNote = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`/parent/${id}/notes`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const sendParentEmail = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`/parent/${id}/email`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Child
export const getChild = (id) => {
    return new Promise((resolve, reject) => {
        get(`/child/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getFamily = (id) => {
    return new Promise((resolve, reject) => {
        get(`/child/${id}/family`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getChildNotes = (id) => {
    return new Promise((resolve, reject) => {
        get(`/child/${id}/notes`)
            .then((res) => {
                // if no content error return empty array
                if (res.status === 204) {
                    resolve([]);
                } else {
                    resolve(res.data);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const postChildNote = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`/child/${id}/notes`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Bookings
export const getBookings = (date = 'today', schoolId = null, session = null) => {
    let path = `/booking?date=${date}`;

    if (schoolId) {
        path += `&school_id=${schoolId}`;
    }

    if (session) {
        path += `&session=${session}`;
    }

    return new Promise((resolve, reject) => {
        get(path)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const addBooking = (id, data) => {
    return new Promise((resolve, reject) => {
        post(`/child/${id}/booking`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const patchBooking = (id, data) => {
    return new Promise((resolve, reject) => {
        patch(`/booking/${id}`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Search
export const searchPeople = (query = '') => {
    return new Promise((resolve, reject) => {
        get(`/search?search_query=${query}`)
            .then((res) => {
                if (res.status === 204) {
                    resolve([]);
                }

                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Schools
export const getSchools = () => {
    return new Promise((resolve, reject) => {
        get('/school')
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// Register
export const getExportedRegister = (date, school, session) => {
    const url = `${baseURL}/wacapp/v1/pdf-register/?date=${date}&school=${school}&session=${session}`;

    const ajax = new XMLHttpRequest();

    ajax.open('GET', url, true);
    ajax.setRequestHeader('Authorization', `Bearer ${authToken}`);
    ajax.onreadystatechange = function onReadyStateChange() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                const blob = new Blob([this.response], { type: 'application/pdf' });
                const fileName = `WAC Register - ${date}-${session}-sch${school}.pdf`;

                saveAs(blob, fileName);
            } else if (this.responseText !== '') {
                if (typeof JSON.parse(this.response).message !== 'undefined') {
                    console.warn(JSON.parse(this.response).message);
                } else {
                    console.warn('There was an error when trying to generate the PDF.');
                }
            }
        } else if (this.readyState === 2) {
            if (this.status === 200) {
                this.responseType = 'blob';
            } else {
                this.responseType = 'text';
            }
        }
    };
    ajax.send(null);
};

// Finance
export const getFinanceData = (startYear, startMonth, endYear, endMonth) => {
    return Promise.all([
        get(`/finance-reports/income-graph?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`),
        get(`/finance-reports/payment-method?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}&payment_method[]=stripe&payment_method[]=bks_staff_gateway&payment_method[]=ccv_gateway`),
        get(`/finance-reports/ccv-providers?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`),
        get(`/finance-reports/attended-didnt-book?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}&limit=50&page=1`),
        get(`/finance-reports/wac-report?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`),
        get(`/finance-reports/awaiting-credit-release?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`)
    ]);
};

// bookings
export const bookingData = ({
    pageNumber,
    startMonth,
    startYear,
    endMonth,
    endYear
}) => {
    return new Promise((resolve, reject) => {
        get(`/finance-reports/attended-didnt-book?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}&limit=50&page=${pageNumber}`)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
};

export const putBookingData = (id, data) => {
    return new Promise((resolve, reject) => {
        put(`/finance-reports/bookings/${id}/apply-action`, data)
            .then((res) => {
                resolve(res.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

// CSV
export const csvData = ({
    type,
    pageNumber,
    startMonth,
    startYear,
    endMonth,
    endYear
}) => {
    return new Promise((resolve, reject) => {
        let path;

        if (type === 'attendedDidntBook') {
            path = `/finance-reports/attended-didnt-book?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}&limit=50&page=${pageNumber}`;
        } else if (type === 'wac-report') {
            path = `/finance-reports/wac-report?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`;
        } else if (type === 'ccv-Provider') {
            path = `/finance-reports/ccv-providers?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`;
        } else if (type === 'awaitingCreditRelease') {
            path = `/finance-reports/awaiting-credit-release?start_month=${startMonth}&start_year=${startYear}&end_month=${endMonth}&end_year=${endYear}`;
        }

        get(path)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
};
