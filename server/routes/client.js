import express from "express";
import { 
    getProducts,
    getCustomers, 
    getTransactions,
    getGeography,
    addProducts,
    updateProduct,
    deleteProduct
} from "../controllers/client.js";


const router = express.Router();

router.get("/products", getProducts);
router.post("/products/add", addProducts);
router.patch("/products/:id", updateProduct);
router.get("/product/delete/:id", deleteProduct);

router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

export default router;