const express = require('express')
const mongoose = require('mongoose')
const Student = require('./models/studentModel')
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// tạo mới học sinh - C
app.post('/students', async(req, res) =>{
    try {
        // kiểm tra sid có tồn tại chưa
        const existingStudent = await Student.findOne({ sid: req.body.sid });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with this SID already exists' });
        }
        if (req.body.gender && req.body.gender !== "male" && req.body.gender !== "female") {
            return res.status(400).json({ message: 'Gender must be "male" or "female" or empty' });
        }
        const student = await Student.create(req.body)
        res.status(201).json(student);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})

// đọc thông tin học sinh - R
app.get('/students', async(req, res) =>{
    try {
        const students = await Student.find({})
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// đọc thông tin 1 học sinh bằng id - R
app.get('/students/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const student = await Student.findById(id);
        res.status(200).json(student) 
    } catch (error) {
        res.status(500).json({message: error.message})
    } 
})

// cập nhật thông tin hs - U
app.put('/students/:id', async(req, res) =>{
    try {
        const {id} = req.params;

        if (req.body.gender && req.body.gender !== "male" && req.body.gender !== "female") {
            return res.status(400).json({ message: 'Gender must be "male" or "female" or empty' });
        }
        const student = await Student.findByIdAndUpdate(id, req.body);
        if(!student){
            return  res.status(404).json({message: `cannot find any student with an ID ${id}`})
        }
        const updatedStudent = await Student.findById(id);
        res.status(200).json(updatedStudent)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// xóa học sinh - D
app.delete('/students/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const student = await Student.findByIdAndDelete(id)
        if(!student){
            return res.status(404).json({message: `cannot find any student with ID ${id}`})
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.connect('mongodb+srv://admin:admin@cluster0.2vzj6jx.mongodb.net/Node-API?retryWrites=true&w=majority')
.then(() =>{
    console.log('connected to MongoDB')
    app.listen(3001, () =>{
        console.log(`Node API is running on port 3001`)
    });
}).catch((error) =>{
    console.log(error)
})