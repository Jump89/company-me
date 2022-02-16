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
            choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role','End']
        }
    ).then(answer => {
        switch (answer.options) {
            case 'view all departments':
                //do something
                viewDepartment().then(answer => {
                    console.table(answer[0]);
                    choices();
                });
                break;
            case 'view all roles':
                viewRoles().then(answer => {
                    console.table(answer[0]);
                    choices();
                });
                break;

            case 'view all employees':
                viewEmployees().then(answer => {
                    console.table(answer[0]);
                    choices();
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
            case 'End': 
                process.exit();

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

function addDepartment() {
    return inquirer.prompt({
        type: 'input',
        name: "department",
        message: 'Please enter a new Department: '
    }).then(answers => {
        let result = db.query('INSERT INTO department (names) VALUES (?)', answers.department, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`Added ${answers.department} to the database!`);
            }
        })
        choices();
    })
}

function addRole() {
    let department = [];
    viewDepartment().then(departments => {
        departments[0].forEach(depart => {
            let newObj = {
                id: depart.id,
                name: depart.names
            }
            department.push(newObj)
        })

    });
    return inquirer.prompt([{
        type: 'input',
        name: "title",
        message: 'Please enter a new Title: '
    }, {
        type: 'input',
        name: "salary",
        message: 'Please enter your Salary: '
    }, {
        type: 'list',
        name: "department",
        message: 'Please select your Department: ',
        choices: department
    }]).then(answers => {
        let departmentID = department.filter(x => answers.department === x.name)[0].id;
        let result = db.query('INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)', [answers.title,
                answers.salary, departmentID
            ],
            (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Added ${answers.title} to the database!`);
                }
            })
            choices();
    })
}

function addEmployee() {
    let rolesArray = [];
    viewRoles().then(roles => {
        roles[0].forEach(role => {
            let newObj = {
                id: role.id,
                name: role.title
            }
            rolesArray.push(newObj)
        })

    });
    return inquirer.prompt([{
        type: 'input',
        name: "first_name",
        message: 'Please enter First Name: '
    }, {
        type: 'input',
        name: "last_name",
        message: 'Please enter Last Name: '
    }, {
        type: 'list',
        name: "role",
        message: 'Please select your Role: ',
        choices: rolesArray
    }]).then(answers => {
        let roleID = rolesArray.filter(x => answers.role === x.name)[0].id;
        let result = db.query('INSERT INTO employee (first_name,last_name,role_id, manager_id) VALUES (?,?,?,?)', [answers.first_name, answers.last_name, roleID, null],
            (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Added ${answers.first_name} ${answers.last_name} to the database!`);
                }
            })
            choices();
    })
}

function updateEmployee() {
    let rolesArray = [];
    let employeeArray = [];
    viewRoles().then(roles => {
        roles[0].forEach(role => {
            let newObj = {
                id: role.id,
                name: role.title
            }
            rolesArray.push(newObj)
        })
    });
    viewEmployees().then(results => {
        results[0].forEach(result => {
            let newObj = {
                id: result.id,
                name: result.first_name + " " + result.last_name
            }
            employeeArray.push(newObj)
        })
    }).then(() => {
        return inquirer.prompt([{
            type: 'list',
            name: "employee",
            message: 'Please select an Employee to update:',
            choices: employeeArray
        }, {
            type: 'list',
            name: "role",
            message: 'Please update Employee Role:',
            choices: rolesArray
        }]).then(answers => {
            let employeeID = employeeArray.filter(y => answers.employee === y.name)[0].id;

            let roleID = rolesArray.filter(z => answers.role === z.name)[0].id;

            let result = db.query('UPDATE employee SET role_id = (?) WHERE id = (?)', [roleID, employeeID], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(`Updated ${answers.employee} to the database!`);
                }
            })
            choices();
        })
    })
}



choices();