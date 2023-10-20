const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        sid: {
            type: String,
            unique: true,
            required: [true, "Please enter SID"]
        },

        name: {
            type: String,
            required: [true, "Please enter Student's Name"]
        },

        gender: {
            type: String,
            enum: ["male", "female"],
            required: false,
        },

        class: {
            type: String,
            required: false,
        }
    },
    {
        timestamps: true,
    }
)


const Student = mongoose.model('Student', studentSchema);

module.exports = Student;