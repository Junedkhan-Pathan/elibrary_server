import  express  from 'express';
import { registerHandler, signInHandler } from './userController';

const userRoutes = express.Router();

userRoutes.post('/register',registerHandler);
userRoutes.post('/login',signInHandler);


export default userRoutes