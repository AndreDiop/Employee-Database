const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "trapstar",
  database: "globotron",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  startArt();
  welcomeToGlobotron();
});

function welcomeToGlobotron() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Welcome user, what would you like to do?",
        name: "question",
        choices: [
          "View all employees",
          "View all departments",
          "Add a department",
          "Add employee",
          "Exit",
        ],
      },
    ])
    .then(({ question }) => {
      switch (question) {
        case "View all employees":
          viewAllEmployees();
          break;
        case "View all departments":
          ViewAllDepartments();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Exit":
          exit();
          break;
        default:
          console.log("Thanks for using the app!");
          exit();
      }
    });
}

//             }
function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employees first name?",
        name: "first",
      },
      {
        type: "input",
        message: "What is the employees last name?",
        name: "last",
      },

      {
        type: "input",
        message: "Who is the employee's manager?",
        name: "manager",
      },
    ])
    .then(({ first, last, manager }) => {
      connection.query(
        `INSERT INTO employee (first_name,last_name,manager_id)
        VALUES (?,?,?);
           `,
        [first, last, manager],
        function (err, res) {
          if (err) throw err;
          console.log("Added new employee to the Globotron database");
          console.table(res);
          welcomeToGlobotron();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department you are creating?",
        name: "department",
      },
    ])
    .then(({ department }) => {
      connection.query(
        `INSERT INTO department (name)
        VALUES (?)`,
        [department],
        function (err, res) {
          if (err) throw err;
          console.log("Your department has been created");
          console.table(res);
          welcomeToGlobotron();
        }
      );
    });
}

function ViewAllDepartments() {
  connection.query(`SELECT name FROM department;`, function (err, res) {
    if (err) throw err;
    console.log("These are the employees of the ?Department at Globotron");
    console.table(res);
    welcomeToGlobotron();
  });
}

function viewAllEmployees() {
  connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`,
    function (err, res) {
      if (err) throw err;
      console.log("These are the employees of Globotron");
      console.table(res);
      welcomeToGlobotron();
    }
  );
}

function exit() {
  connection.end();
}

function startArt() {
  console.log(`
    #     ___ _       _           _                   
    #    / _ \ | ___ | |__   ___ | |_ _ __ ___  _ __  
    #   / /_\/ |/ _ \| '_ \ / _ \| __| '__/ _ \| '_ \ 
    #  / /_\\| | (_) | |_) | (_) | |_| | | (_) | | | |
    #  \____/|_|\___/|_.__/ \___/ \__|_|  \___/|_| |_|
    #                                                  `);
}
