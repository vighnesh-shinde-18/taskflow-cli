 
import { saveToken } from '../token/tokenStore.js'
import client from '../client.js';
import handleCliError from '../utils/handleError.js'


const register = async (email, name, password, role, teamId) => {
    try {
        const payload = { email, password, name, role };

        if (role === 'DEVELOPER') {
            payload.teamId = teamId;
        }

        const response = await client.post('/auth/register', payload);

        console.log('✅ Regsiter successful');
    } catch (error) { 
        handleCliError(error, `Register failed`);
    }
};


const login = async (email, password) => {
    try {
        const response = await client.post(`/auth/login`, {
            email,
            password
        });
        saveToken(response.data.data);
        console.log('✅ Login successful');
    } catch (error) {
        handleCliError(error, `Login failed`);

    }
};



export { login, register };
