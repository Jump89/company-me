const inquirer = require('inquirer');
const db = require('./db/connection');
require('console.table');


const choices = () => {
    return inquirer.prompt(
        // Options
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
        }
    ).then(answer => {
        switch (answer.options) {
            case 'view all departments':
                //do something
                viewDepartment().then(answer => {
                    console.table(answer[0]);
                });
                break;
            case 'view all roles':
                viewRoles().then(answer => {
                    console.table(answer[0]);
                });
                break;

            case 'view all employees':
                viewEmployees().then(answer => {
                    console.table(answer[0]);
                });
                break;

            case 'add a department':
                addDepartment();
                break;

            case 'add a role':
                addRole();
                break;

            case 'add an employee':
                addEmployee();
                break;

            case 'update an employee role':
                updateEmployee();
                break;

        }
    })
}

function viewDepartment() {
    let result = db.promise().query('SELECT * FROM department')
    return result; // select
}

function viewRoles() {
    let result = db.promise().query('SELECT roles.id, roles.title, roles.salary, department.names FROM roles LEFT JOIN department ON roles.department_id = department.id')
    return result;
}

function viewEmployees() {
    let result = db.promise().query('SELECT employee.id, first_name, last_name, roles.title, roles.salary, department.names, manager_id FROM employee LEFT JOIN roles ON roles.id = employee.role_id LEFT JOIN department ON department.id = roles.department_id')
    return result;
}


choices();