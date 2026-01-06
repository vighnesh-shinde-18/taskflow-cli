import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const TOKEN_PATH = path.join(__dirname, 'token.json');

const saveToken = (token) => {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify({ token }));
};

const getToken = () => {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  return JSON.parse(fs.readFileSync(TOKEN_PATH)).token;
};

export {saveToken, getToken}
 

