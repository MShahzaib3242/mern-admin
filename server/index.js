import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from "multer";
import helmet from 'helmet';
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";

import clientRoutes from './routes/client.js';
import generalRoutes from './routes/general.js';
import managementRoutes from './routes/management.js';
import salesRoutes from './routes/sales.js';
import { register } from "./controllers/auth.js";
import userRoutes from "./routes/users.js";
import { updateUser, addUser } from "./controllers/users.js";

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from "./models/ProductStat.js";
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import { 
    dataUser, 
    dataProduct, 
    dataProductStat, 
    dataTransaction, 
    dataOverallStat,
    dataAffiliateStat
} from "./data/index.js";


// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });
  
  /* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.patch('/users/update/:id', upload.single("picture"), updateUser);
app.post('/users/add', upload.single("picture"), addUser);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // ONLY ADD DATA ONE TIME 
    // User.insertMany(dataUser);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // Transaction.insertMany(dataTransaction);
    // OverallStat.insertMany(dataOverallStat);
    // AffiliateStat.insertMany(dataAffiliateStat);
    
}).catch((error) => 
    console.log(`${error} did not connect`)
);

app.get('/', (req, res) => {
    res.send(`Node Server is Connected`);
});