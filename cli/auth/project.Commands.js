import axios from 'axios';

const API = 'http://localhost:5000/api/v1/project';

const createProject = async (name, description) => {
  try {
    const response = await axios.post(`${API}/`, {
      name,
      description
    });
    console.log('✅ Project created:', res.data);
  } catch (err) {
    console.error('❌ Failed to create project');
  }
};

const listMyProjects = async () => {
  try {
    const res = await axios.get(`${API}`);
    console.table(res.data);
  } catch (err) {
    console.error('❌ Failed to fetch projects');
  }
};

const completeProject = async (projectId) => {
  try {
    const res = await axios.patch(`${API}/complete/${projectId}`);
    console.log(res.data.message);
  } catch (err) {
    console.error('❌ Cannot complete project');
  }
};

export {createProject, listMyProjects, completeProject}
