CREATE DATABASE cli_project_manager;
USE cli_project_manager;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('MANAGER', 'DEVELOPER') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PROJECTS
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  manager_id INT,
  status ENUM('ACTIVE', 'COMPLETED') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

-- TASKS
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status ENUM('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE') DEFAULT 'TODO',
  project_id INT,
  assigned_to INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- PULL REQUESTS
CREATE TABLE pull_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id INT,
  developer_id INT,
  status ENUM('OPEN', 'APPROVED', 'REJECTED', 'MERGED') DEFAULT 'OPEN',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (developer_id) REFERENCES users(id)
);

-- DEPLOYMENTS
CREATE TABLE deployments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  manager_id INT,
  deployment_version VARCHAR(50) NOT NULL,
  deployed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('IN_PROGRESS' ,'DEPLOYED', 'FAILED') DEFAULT 'IN_PROGRESS',
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

 


-- MESSAGES
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT,
  receiver_id INT,
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  manager_id INT NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id)
);

CREATE TABLE team_members (
  team_id INT,
  developer_id INT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (team_id, developer_id),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (developer_id) REFERENCES users(id)
);

 