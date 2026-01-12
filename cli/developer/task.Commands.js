import client from '../client.js';
import handleCliError from '../utils/handleError.js';
/**
 * Fetch tasks assigned to logged-in developer
 */
const listMyTasks = async () => {
  try {
    const res = await client.get('/task/developer');
    console.table(res.data);
  } catch (error) {
    handleCliError(error, "Failed to fetch assigned tasks")
  }
};

/**
 * Update task status
 * Allowed transitions:
 * TODO -> IN_PROGRESS
 * IN_PROGRESS -> IN_REVIEW
 */
const updateTaskStatus = async (taskId, status) => {
  try {
    const res = await client.patch('/task/status', {
      taskId
    });

    console.log('✅ Task status updated');
  } catch (error) {
    handleCliError(error, "Failed to update task status")
  }
};



export { listMyTasks, updateTaskStatus };
