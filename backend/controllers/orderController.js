import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

// @desc    Fetch new order
// @route   Post /api/orders
// @desc    Private
const addOrderItems = asyncHandler(async(req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, 
        shippingPrice, totalPrice } = req.body;
    
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
        return
    } else {
        const order = new Order({
            orderItems, 
            user: req.user._id,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            totalPrice,
            shippingPrice, 
        });

        const createOrder = await order.save();
        res.status(201).json(createOrder)
    }

});

// @desc    Get Order by Id
// @route   GET /api/orders/:id
// @desc    Private
const getOrderById = asyncHandler(async(req, res) => {

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
        res.json(order)
    } else {
        res.status(404);
        throw new Error('Order not found');
    }

});

// @desc    Update Order to Paid
// @route   GET /api/orders/:id/pay
// @desc    Private
const updateOrderToPaid = asyncHandler(async(req, res) => {

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }

});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @desc    Private
const getMyOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({ user: req.user._id });
    console.log(orders);
    res.json(orders);
});


// @desc    Get all orders
// @route   GET /api/orders
// @desc    Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    console.log(orders);
    res.json(orders);
});


// @desc    Update Order to Delivered
// @route   GET /api/orders/:id/deliver
// @desc    Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {

    const order = await Order.findById(req.params.id);

    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
       
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }

});


export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders, getOrders, updateOrderToDelivered }


