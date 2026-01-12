#!/usr/bin/env node

import { Command } from 'commander';
import { login, register } from './auth/auth.Commands.js';

import { createProject, listMyProjects, completeProject } from '../cli/manager/project.Commands.js';
import { createTask, assignTask, listProjectTasks, completeTask } from '../cli/manager/task.Commands.js';
import {
    listMyTasks,
    updateTaskStatus
} from '../cli/developer/task.Commands.js';
import { raisePR } from './developer/pr.Commands.js';
import {
    listProjectPRs,
    approvePR,
    rejectPR,
    mergePR
} from './manager/pr.Commands.js';
import { deployProject } from './manager/deployment.Commands.js';

const program = new Command();

program
    .name('pm')
    .description('CLI Project Management Tool')
    .version('1.0.0');

// LOGIN COMMAND
program
    .command('login')
    .description('Login to your account')
    .requiredOption('--email <email>', 'User email')
    .requiredOption('--password <password>', 'User password')
    .action((opts) => {
        login(opts.email, opts.password);
    });

// REGISTER COMMAND
program
    .command('register')
    .description('Register a new user')
    .requiredOption('--name <name>', 'Full Name')
    .requiredOption('--email <email>', 'Email address')
    .requiredOption('--password <password>', 'Password')
    .requiredOption('--role <role>', 'Role (MANAGER or DEVELOPER)')
    .option('--teamId <id>', 'Required if role is DEVELOPER')
    .action((opts) => {
        register(opts.email, opts.name, opts.password, opts.role, opts.teamId);
    });



// Create Project Command 
program
    .command('project:create')
    .requiredOption('--name <name>')
    .option('--description <description>')
    .action((opts) => createProject(opts.name, opts.description));

// Project list Command 
program
    .command('project:list')
    .action(listMyProjects);

program
    .command('project:complete')
    .requiredOption('--projectId <id>')
    .action((opts) => completeProject(opts.projectId));



program
    .command('task:create')
    .requiredOption('--title <title>')
    .requiredOption('--projectId <id>')
    .option('--description <description>')
    .action((opts) =>
        createTask(opts.title, opts.description, opts.projectId)
    );

program
    .command('task:list:manager')
    .requiredOption('--projectId <id>')
    .action((opts) =>
        listProjectTasks(opts.projectId)
    );

program
    .command('task:assign')
    .requiredOption('--taskId <id>')
    .requiredOption('--developerId <id>')
    .requiredOption('--projectId <id>')
    .action((opts) =>
        assignTask(opts.taskId, opts.developerId, opts.projectId)
    );

program
    .command('task:list:developer')
    .description('List tasks assigned to you')
    .action(listMyTasks);

// Developer: Update task status
program
    .command('task:update')
    .description('Update task')
    .requiredOption('--taskId <id>')
    .action((opts) =>
        updateTaskStatus(opts.taskId)
    );

program
    .command('task:complete')
    .description('Complete task')
    .requiredOption('--taskId <id>')
    .action((opts) =>
        completeTask(opts.taskId)
    );

program
    .command('pr:create')
    .description('Raise PR for a task')
    .requiredOption('--taskId <id>')
    .action((opts) => raisePR(opts.taskId));

program
    .command('pr:list')
    .description('List PRs of a project')
    .requiredOption('--projectId <id>')
    .action((opts) => listProjectPRs(opts.projectId));

// Manager: Approve PR
program
    .command('pr:approve')
    .requiredOption('--prId <id>')
    .action((opts) => approvePR(opts.prId));

// Manager: Reject PR
program
    .command('pr:reject')
    .requiredOption('--prId <id>')
    .action((opts) => rejectPR(opts.prId));

// Manager: Merge PR
program
    .command('pr:merge')
    .requiredOption('--prId <id>')
    .action((opts) => mergePR(opts.prId));





   program
  .command('project:deploy')
  .description('Deploy a completed project')
  .requiredOption('--projectId <id>', 'Project ID to deploy')
  .option('--deployment_version <version>', 'Deployment version', 'v1.0.0')
  .action(async (opts) => {
    await deployProject(opts.projectId, opts.deployment_version);
  });


program.parse();