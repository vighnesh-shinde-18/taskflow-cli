import client from '../client.js';
import handleCliError from '../utils/handleError.js';

const deployProject = async (projectId, deployment_version) => {
  try { 
      console.log('🚀 Deployment started..'); 

    const res = await client.post(
        `/deployments/${projectId}`,
        { deployment_version }
    ); 
    
    console.log('🚀 Deployment successful'); 
    console.log(res.data.message); 
  } catch (error) {
    handleCliError(error, 'Deployment failed');
  }
};

export { deployProject };
