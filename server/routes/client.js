import express from "express";
import { 
    getProducts,
    getCustomers, 
    getTransactions,
    getGeography,
    addProducts
} from "../controllers/client.js";


const router = express.Router();

router.get("/products", getProducts);
router.post("/products/add", addProducts);

router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);

export default router;