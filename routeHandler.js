const UserModel = require("./Models/User");
const TodoModel = require("./Models/Todo");

const jwt = require("jsonwebtoken");

const {SECRET_KEY} = process.env;


exports.registerUser = async (req,res) => {
    const user = req.body;

    const email = user.email;

    const prevUser = await UserModel.find({email: email});
    
    if (prevUser.length == 0) {
        await UserModel.create(user);
        // user.password = "";
        const token = jwt.sign(user, SECRET_KEY);
        res.status(200).send({user:user, token:token});
        return;
    }
    else {
        res.status(409).send({error:"User Already Exists"});
    }
}

exports.loginUser = async (req, res) => {
    const user = req.body;

    const email = user.email;
    const password = user.password;

    const found = await UserModel.find({email:email, password:password});
    if (found.length > 0) {
        // found.password = "";
        const token = jwt.sign(user, SECRET_KEY);
        res.status(200).send({user:user, token:token});
        return;
    }
    else {
        res.status(409).send({error:"User Not Found"});
    }
}


const verifyToken = async (token) => {
    // Return email of verified User
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // res.status(200).send({email:decoded.email});
        return decoded.email;

    } catch(err) {
        // console.log("error decoding");
        // res.status(409).send({error:"Error decoding token"})
    }
    return null;
}

exports.addTodo = async (req, res) => {
    const token = req.body.jwtToken;
    const task = req.body.task;
    // console.log(token);
    const email = await verifyToken(token);

    await TodoModel.create({
        userEmail:email,
        status:"active",
        task:task,
        dateCreated:new Date()
    })
    res.status(200).send({message:"Todo Added"});
}

exports.getTodos = async (req,res) => {
    const token = req.body.jwtToken;
    const filter = req.body.filter;
    const email = await verifyToken(token);
    let todos;
    if (filter === "all") {
        todos = await TodoModel.find({userEmail:email, status: {$not : /deleted/ }}).sort({dateCreated : -1});
    }
    else {
        todos = await TodoModel.find({userEmail:email, status: filter}).sort({dateCreated : -1});
    }
    // console.log(filter);
    res.status(200).send({todos:todos});
}

exports.deleteTodo = async (req, res) => {
    // console.log(req.body);
    await TodoModel.updateOne( {_id:req.body.todoId}, 
        {
            $set : {
                status:"deleted"
            }
        }
    )
    res.status(200).send({message:"Todo Deleted"});
}

exports.completeTodo = async (req, res) => {
    await TodoModel.updateOne( {_id:req.body.todoId}, 
        {
            $set : {
                status: "completed"
            }
        }
        
    )
    res.status(200).send({message:"Todo Completed"});
}

exports.clearCompleted = async (req, res) => {
    const token = req.body.jwtToken;
    const email = await verifyToken(token);

    await TodoModel.updateMany( {userEmail:email, status:"completed"},
        {
            $set : {
                status:"deleted"
            }
        }
    
    )

    res.status(200).send({message:"Cleared Completed Todos"});

}