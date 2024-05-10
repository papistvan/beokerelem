import express from 'express';


export default function createUsersRouter() {
    const router = express.Router();

    
    router.get('/', (req, res) => {
        res.send('Hello, users!');
    });
    return router;
}