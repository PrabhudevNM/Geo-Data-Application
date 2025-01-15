import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import configureDB from './config/db.js';
configureDB();
import { checkSchema } from 'express-validator';
import usersCltr from './app/controllers/user-cltr.js';
import { userLoginSchema, userRegisterSchema } from './app/validators/user-validator.js';
import authenticationUser from './app/middlewares/Authentication.js';
import upload from './app/middlewares/multer.js';
import geodataCltr from './app/controllers/geo-data-cltr.js';
import bodyParser from 'body-parser';

// Express setup
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); // For JSON request body
const port = process.env.PORT || 5000;


// Setup for file uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.post('/api/users/register', checkSchema(userRegisterSchema), usersCltr.register);
app.post('/api/users/login', checkSchema(userLoginSchema), usersCltr.login);
app.get('/api/users/account', authenticationUser, usersCltr.account);

// GeoData routes
app.post('/api/geoData/upload', authenticationUser, upload.single('fileUrl'), geodataCltr.create);
app.get('/api/geoData/list', authenticationUser, geodataCltr.list);
app.get('/api/geoData/my-geodata', authenticationUser, geodataCltr.mygeodata);
app.put('/api/geoData/:id', authenticationUser, upload.single('fileUrl'), geodataCltr.update);
app.patch('/api/geoData/:id/toggle', authenticationUser, geodataCltr.toggleVisibility);
app.delete('/api/geoData/:id', authenticationUser, geodataCltr.delete);

app.listen(port, () => {
  console.log('Server running on port', port);
});
