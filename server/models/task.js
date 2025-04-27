import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    deadline: {
        type: Date,
        required: false
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Add index for better query performance
taskSchema.index({ status: 1, createdAt: -1 });

const Task = mongoose.model('Task', taskSchema);

export default Task;