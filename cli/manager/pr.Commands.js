import client from '../client.js';
import handleCliError from '../utils/handleError.js';
/**
 * List PRs for a project
 */
const listProjectPRs = async (projectId) => {
  try {
    const res = await client.get(`/pr/manager/${projectId}`);
    console.table(res.data.data);
  } catch (error) { 

    handleCliError(error,"Failed to approve PR")
  }
};

/**
 * Approve PR
 */
const approvePR = async (prId) => {
  try {
    await client.post(`/pr/${prId}/approve`);
    console.log('✅ PR approved');
  } catch (error) {
    handleCliError(error,"Failed to approve PR")
  }
};

/**
 * Reject PR
*/
const rejectPR = async (prId) => {
  try {
    await client.post(`/pr/${prId}/reject`);
    console.log('✅ PR rejected succesfully');
  } catch (error) {
    handleCliError(error,"Failed to reject PR")
  }
};

/**
 * Merge PR
*/
const mergePR = async (prId) => {
  try {
    await client.post(`/pr/${prId}/merge`);
    console.log('🔥 PR merged, task completed');
  } catch (error) { 
    handleCliError(error,"Failed to merge PR ")
  }
};

export { listProjectPRs, approvePR, rejectPR, mergePR };
