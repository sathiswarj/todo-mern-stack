const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = process.env.PORT || 8000
const cors = require('cors')

app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/mern-app")
    .then(() => {
        console.log("Database connected")
    })
    .catch((err) => {
        console.log(err)
    })
// const todos =[]
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    updatedAt:{
        type:Date,
        default:() => Date.now()           
    }
})

todoSchema.pre("save" , function(next){
    this.updatedAt = Date.now()
    next()
})
const todoModel = mongoose.model("Todo", todoSchema)

app.post('/todo', async (req, res) => {
    const { title, description } = req.body;
    /* const newTodo = {
         id:todos.length ? todos[todos.length - 1].id +1 : 1,
         title,
         description
     }
     todos.push(newTodo)
     console.log(todos) */
    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save()
        res.status(201).json(newTodo)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }

})

app.get('/todo', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.send(todos)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }
})

app.put("/todos/:id", async (req, res) => {
    
    try {
        const { title, description } = req.body;
        const id = req.params.id
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            {new : true}
        )
        if (!updatedTodo) {
            return res.status(404).send("Todo not found")
        }
        res.json(updatedTodo)
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message }) 
    }
})

app.delete('/todos/:id' , async(req,res) => {
    try{
     const id = req.params.id
     await todoModel.findByIdAndDelete(id)
     res.status(204).end();
     }
    catch(err){
    console.log(err)
        res.status(500).json({ message: err.message }) 
    }
})
app.listen(PORT, () => {
    console.log(`Server running on ${PORT} port`)
})