import client from '../client.js'
import handleCliError from '../utils/handleError.js';

const createTask = async (title, description, projectId) => {
  try {
    const res = await client.post('/task', {
      title,
      description,
      projectId
    });

    console.log('✅ Task created:', res.data);
  } catch (error) {
    handleCliError(error,"Failed to create task") 

  }
};

const assignTask = async (taskId, developerId, projectId) => {
  try {
    const res = await client.post('/task/assign', {
      taskId,
      developerId,
      projectId
    });
    console.log(res.data.message);
  } catch (error) {
    handleCliError(error,"Failed to assign task");
  }
};

const listProjectTasks = async (projectId) => {
  try {
    const res = await client.get(`/task/manager/${projectId}`);
    console.table(res.data);
  } catch (error) {
    handleCliError(error,"Failed to fetch tasks") 
  }
};

const completeTask = async(taskId)=>{
  try{
    
const res = await client.post(`/task/complete/${taskId}`);
 console.log('✅ Task Complete');

  }catch(error){
 handleCliError(error, "Failed to update task status")
  }
}

export { createTask, assignTask, listProjectTasks,completeTask }