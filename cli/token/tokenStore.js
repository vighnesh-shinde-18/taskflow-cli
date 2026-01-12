import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_PATH = path.join(__dirname, 'token.json');
 
const saveToken = (data) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(data, null, 2)); 
};

 
const getToken = () => {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    // If the data has a .token property, return that, otherwise return the whole thing
    return data.token || data; 
  } catch (error) {
    return null;
  }
};

export { saveToken, getToken };