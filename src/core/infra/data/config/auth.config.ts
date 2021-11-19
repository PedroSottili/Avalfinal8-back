import dotenv from 'dotenv';

dotenv.config();

export default {
    secret: process.env.PRIVATE_TOKEN,
    expiresIn: '1d'
}