import express from 'express';
const router = express.Router();
import { 
        getProductById, 
        getProducts, 
        deleteProduct, 
        createProduct, 
        updateProduct, 
        createProductReview,
        getTopProducts
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; 

// @desc    Fetch all products
// @route   Fetch /api/products
// @desc    Public
router.route('/').get(getProducts).post(protect, admin, createProduct);

router.route('/:id/reviews').post(protect, createProductReview);

router.get('/top', getTopProducts);

router.route('/:id').get(getProductById).delete(protect, admin, deleteProduct).put(protect, admin, updateProduct);


export default router;


// @desc    Fetch single product
// @route   Fetch /api/products/:id
// @desc    Public
// router.get('/:id', asyncHandler(async(req, res) => {
//     const product = await Product.findById(req.params.id);
//     if (product) {
//         res.json(product);
//     } else {
//         res.status(404);
//         throw new Error('Product not found');
//     }
//     res.json(product);
// }));









