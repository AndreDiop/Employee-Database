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
          "View all employees by department",
          "View all employees by manager",
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
          viewAllEmployees();
          break;
        case "View all employees by department":
          ViewEmployeesByDept();
          break;
        case "View all employees by manager":
          ViewEmployeesByManager();
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

function ViewEmployeesByManager() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, roles.title,department.name,employee.manager_id
    FROM employee
    INNER JOIN roles ON employee.id = roles.id
    INNER JOIN department ON roles.id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log(
        "These are the employees that work for ?this manager at Globotron"
      );
      console.table(res);
      welcomeToGlobotron();
    }
  );
}
function ViewEmployeesByDept() {
  connection.query(
    `SELECT employee.first_name, employee.last_name, roles.title,department.name,employee.manager_id
    FROM employee
    INNER JOIN roles ON employee.id = roles.id
    INNER JOIN department ON roles.id = department.id`,
    function (err, res) {
      if (err) throw err;
      console.log("These are the employees of the ?Department at Globotron");
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

function exit() {
  connection.end();
}
