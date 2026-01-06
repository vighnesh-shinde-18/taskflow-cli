#!/usr/bin/env node

import { Command } from 'commander';
import { login, register } from './auth.commands.js'; // Ensure correct path/extension

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
    .action((opts) => {
        register(opts.email, opts.name, opts.password, opts.role);
    });

// Create Project Command 
program
    .command('project:create')
    .requiredOption('--name <name>')
    .option('--description <description>')
    .action((opts) => projectCmd.createProject(opts.name, opts.description));

// Project list Command 
program
    .command('project:list')
    .action(projectCmd.listMyProjects);

program
    .command('project:complete')
    .requiredOption('--projectId <id>')
    .action((opts) => projectCmd.completeProject(opts.projectId));


program.parse();