const express = require("express");
const cors = require('cors');

require("dotenv").config();
require("./database").connect();

const handler = require('./routeHandler');



const app = express();

app.use(express.json());
app.use(cors());


app.post('/register-user', handler.registerUser);
app.post('/login-user', handler.loginUser);
// app.post('/verify-token', handler.verifyToken);

app.post('/get-todos', handler.getTodos);
app.post('/add-todo', handler.addTodo);
app.post('/complete-todo', handler.completeTodo);
app.post('/delete-todo', handler.deleteTodo);
app.post('/clear-completed', handler.clearCompleted);



module.exports = app;

