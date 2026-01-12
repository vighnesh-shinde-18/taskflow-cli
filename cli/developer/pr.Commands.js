import client from '../client.js';
import handleCliError from '../utils/handleError.js';
/**
 * Raise PR for a task
 */
const raisePR = async (taskId) => {
  try {
    const response = await client.post('/pr/', { taskId });
    console.log('✅ PR raised successfully');
    console.log('PR details: ', response.data);
  } catch (error) {
    handleCliError(error,"Failed to raise PR");
  }
};

export { raisePR };
