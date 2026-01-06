import jwt from 'jsonwebtoken'

const generateToken = async (paylaod) => {
    const token = jwt.sign(paylaod, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
}

const verifyToken = async (token) =>{
    const verify = jwt.verify(token, process.env.JWT_SECRET)
    return verify;
}

export {generateToken, verifyToken}

