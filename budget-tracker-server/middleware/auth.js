const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET ; 

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; 
    // console.log("Token from header:", token);
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
      
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = { userId: decoded.userId }; 

        next(); 
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
            error: error.message, 
            code: error.name, 
        });
    }
};

module.exports = authMiddleware;
