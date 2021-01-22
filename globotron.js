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
          "Add employee",
          "Remove employee",
          "Update employee Role",
          "Update employee manager",
        ],
      },
    ])
    .then(({ question }) => {
      switch (question) {
        case "View all employees":
          viewEmployees();
          break;
        case "View all departments":
          ViewAllDepartments();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "Update employee Role ":
          updateEmployee();
          break;
        case "Update employee manager":
          updateEmployeeManager();
          break;
        case "Exit":
          exit();
          break;
        default:
          console.log("Thanks for checking me out!");
          exit();
      }
    });
}
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
        type: "manager",
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
  ViewAllDepartments();
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the department name?",
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
          console.log("Added new employee to the Globotron database");
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
function viewEmployees() {
  connection.query(
    `SELECT first_name AS 'First Name',last_name AS 'Last Name',manager_id AS 'Manager' FROM employee`,
    function (err, res) {
      if (err) throw err;
      console.log("These are the employees of Globotron");
      console.table(res);
      welcomeToGlobotron();
    }
  );
}
function viewAllEmployees() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, roles.title,department.name,roles.salary,employee.manager_id
  FROM employee
  INNER JOIN roles ON employee.id = roles.id
  INNER JOIN department ON roles.id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log("These are the employees of Globotron");
      console.table(res);
      welcomeToGlobotron();
    }
  );
}
function removeEmployee() {
  viewEmployees();
  console.log("Which employee would you like to remove?");
  exit();
}

function exit() {
  connection.end();
}
