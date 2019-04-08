import React from 'react';
import PropTypes from 'prop-types';

import {
    Tabs,
    TabList,
    Tab,
    TabPanel
} from 'react-tabs';

const Order = ({
    order,
    open,
    index,
    toggleOrder
}) => {
    return (
        <div className="order">
            <div className="order__details">
                <div className="order__detail order__placed">
                    <p>Order placed</p>
                    <p>{order.order_date_label}</p>
                </div>

                <div className="order__detail order__ref">
                    <p>Order Ref</p>
                    <p>{order.order_id}</p>
                </div>

                <div className="order__detail order__credits">
                    <p>Total</p>
                    <p>{order.total_credits_used}</p>
                </div>

                <button type="button" className="button order__button" onClick={() => { toggleOrder(index); }}>{`${open ? 'Hide' : 'View'} order`}</button>
            </div>

            <div className={`order__contents ${open ? 'order__contents--open' : ''}`}>
                <Tabs className="react-tabs react-tabs--inline">
                    <TabList>
                        {order.children_order_details.map((child) => {
                            return (
                                <Tab key={child.child_id}>{child.child_name}</Tab>
                            );
                        })}
                    </TabList>

                    {order.children_order_details.map((child) => {
                        return (
                            <TabPanel key={child.child_id}>
                                <table className="order-table">
                                    <tbody>
                                        <tr className="order-table__row order-table__row--school">
                                            <td className="order-table__field order-table__field--key">School:</td>
                                            <td className="order-table__field order-table__field--value">{child.school_name}</td>
                                        </tr>

                                        <tr className="order-table__row order-table__row--dates">
                                            <td className="order-table__field order-table__field--key">Dates & Times:</td>
                                            <td className="order-table__field order-table__field--value">
                                                <table className="order-sub-table">
                                                    <thead>
                                                        <tr>
                                                            <th className="order-sub-table__field order-sub-table__field--am">AM</th>
                                                            <th className="order-sub-table__field order-sub-table__field--pm">PM</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Object.keys(child.days_booked).map((day) => {
                                                            return (
                                                                <tr key={day} className="order-sub-table__row">
                                                                    {/* Adds an empty column if the only session for this booking is PM */}
                                                                    {(child.days_booked[day].bookings.length === 1 && child.days_booked[day].bookings[0].slot_session === 'pm')
                                                                        ? (<td className="order-sub-table__field order-sub-table__field--am" />) : null
                                                                    }

                                                                    {child.days_booked[day].bookings.map((booking) => {
                                                                        return (
                                                                            <td key={booking.booking_id} className={`order-sub-table__field order-sub-table__field--${booking.slot_session} ${booking.has_been_trashed ? 'order-sub-table__field--trashed' : ''}`}>
                                                                                <p>{child.days_booked[day].date_label}</p>
                                                                                <p>{booking.slot_time_label}</p>
                                                                                <p>{booking.club.club_set ? booking.club.club_name : ''}</p>
                                                                            </td>
                                                                        );
                                                                    })}
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </TabPanel>
                        );
                    })}
                </Tabs>
            </div>
        </div>
    );
};

Order.propTypes = {
    order: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    toggleOrder: PropTypes.func.isRequired
};

export default Order;
