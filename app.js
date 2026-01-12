import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import authRoutes from './routes/Auth.Routes.js'
import cors from 'cors'
import db from './db/index.js'
import projectRoutes from './routes/Projects.Routes.js'
import taskRoutes from './routes/Task.Routes.js'
import prRoutes from './routes/Pr.Routes.js'
import deploymentRoutes from './routes/Deployment.Routes.js'

const app = express();

app.use(cors())
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/project",projectRoutes)
app.use("/api/v1/task",taskRoutes)
app.use("/api/v1/pr",prRoutes)
app.use('/api/v1/deployments', deploymentRoutes); 

export default app;
