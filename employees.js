import express from "express";
import employees, {
  getEmployee,
  getEmployees,
  getRandomEmployee,
} from "#db/employees";

const employeeRouter = express.Router();
export default employeeRouter;

employeeRouter.get("/", (req, res) => {
  const employees = getEmployees();
  res.status(200).send(employees);
});

employeeRouter.post("/", (req, res) => {
  if (!req.body) {
    res.status(400).send("no body provided");
  } else if (!req.body.name || req.body.name === "") {
    res.status(400).send("no name provided");
  } else {
    const newEmployee = { id: employees.length + 1, ...req.body };
    employees.push(newEmployee);
    res.status(201).send(newEmployee);
  }
});

// Note: this middleware has to come first! Otherwise, Express will treat
// "random" as the argument to the `id` parameter of /employees/:id.
employeeRouter.get("/random", (req, res) => {
  const employee = getRandomEmployee();
  res.send(employee);
});

employeeRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  // req.params are always strings, so we need to convert `id` into a number
  // before we can use it to find the employee
  const employee = getEmployee(+id);

  if (!employee) {
    return res.status(404).send(`Employee #${id} not found.`);
  }

  res.send(employee);
});
