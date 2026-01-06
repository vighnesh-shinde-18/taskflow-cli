import axios from 'axios';
import { saveToken } from './tokenStore.js'

const API = 'http://localhost:5000/api/v1/auth';

const register = async (email, name, password, role) => {
    try {
        const response = await axios.post(`${API}/register`, {
            email,
            password,
            name,
            role
        });

        console.log('✅ Regsiter successful');
    } catch (err) {
        console.error('❌ Register failed');
    }
};


const login = async (email, password) => {
    try {
        const response = await axios.post(`${API}/auth/login`, {
            email,
            password
        }); 
        saveToken(response.data.data);
        console.log('✅ Login successful');
    } catch (err) {
        console.error('❌ Login failed');
    }
};



export { login, register };
