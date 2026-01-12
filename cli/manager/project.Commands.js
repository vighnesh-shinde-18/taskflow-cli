
import client from '../client.js'
import handleCliError from '../utils/handleError.js';

const createProject = async (name, description) => {
  try {

    const res = await client.post(`/project`, {
      name,
      description
    });

    console.log('✅ Project created:', res.data);
  } catch (error) {
    handleCliError(error,"Failed to create project") 
  }
};

const listMyProjects = async () => {
  try {
    const res = await client.get(`/project`);
    console.table(res.data.data);
  } catch (error) {
    handleCliError(error,"Failed to fetch projects") 
  }
};

const completeProject = async (projectId) => {
  try {
    const res = await client.patch(`/project/complete/${projectId}`);
    console.log("✅ ", res.data.message);
  } catch (error) {
    handleCliError(error,"Cannot complete project") 
  }
};

export { createProject, listMyProjects, completeProject }
