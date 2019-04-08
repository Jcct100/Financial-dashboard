import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Order from './Order';
import Loading from './Loading';

import { getParentOrders } from '../api';

class ParentOrders extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openOrder: [],
            loading: true
        };
    }

    componentWillMount() {
        getParentOrders(this.props.parent.ID)
            .then((res) => {
                this.props.setOrders(res);

                const orders = [];
                for (let i = 0; i < res.length; i++) {
                    orders.push(false);
                }

                this.setState({
                    openOrder: orders,
                    loading: false
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    toggleOrder(orderIndex) {
        /* eslint-disable-next-line react/no-access-state-in-setstate */
        const orders = this.state.openOrder.map((order, index) => {
            if (orderIndex === index) {
                return !order;
            }

            return order;
        });

        this.setState({ openOrder: orders });
    }

    render() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        }

        return (
            <div className="parent__orders">
                {!this.props.orders.length ? <p className="parent__orders-error">{`No orders have been place by ${this.props.parent.full_name}.`}</p> : null}

                {this.props.orders.map((order, index) => {
                    return (
                        <Order
                            key={order.order_id}
                            order={order}
                            open={this.state.openOrder[index]}
                            index={index}
                            toggleOrder={(index) => { this.toggleOrder(index); }}
                        />
                    );
                })}
            </div>
        );
    }
}

ParentOrders.propTypes = {
    parent: PropTypes.object.isRequired,
    orders: PropTypes.arrayOf(PropTypes.object).isRequired,
    setOrders: PropTypes.func.isRequired
};

export default ParentOrders;
