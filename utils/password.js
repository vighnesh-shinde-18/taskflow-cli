import bcrypt from 'bcrypt'

const hashPassword = async (password)=>{
    const hashedPassword = await bcrypt.hash(password,10)
    return hashedPassword;
};

const checkPassword = async(password, hash) => {
    const result = await bcrypt.compare(password,hash)
    return result; 
}

export { hashPassword, checkPassword}
 