export const createTask = async (req, res) => {
    try {
        const { title, description, deadline } = req.body;

        // Validate request body
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both title and description'
            });
        }

        // Create task object
        const newTask = {
            title,
            description,
            deadline: deadline || null,
            status: 'pending',
            createdAt: new Date().toISOString(),
            createdBy: 'Balaji-R-2007' // Using your current login
        };

        // For now, we'll just return the created task
        // In the next PR, we'll add database integration
        res.status(201).json({
            success: true,
            data: newTask
        });

    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating task'
        });
    }
};


// update task
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, deadline, status } = req.body;

        // Validate request body
        if (!title && !description && !deadline && !status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least one field to update'
            });
        }

        // Validate status if provided
        if (status && !['pending', 'in-progress', 'completed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        // For demo purposes, we'll just return the updated task
        // In the next PR with database integration, we'll actually update the task
        const updatedTask = {
            id,
            title: title || 'Existing Title',
            description: description || 'Existing Description',
            deadline: deadline || null,
            status: status || 'pending',
            updatedAt: new Date().toISOString(),
            updatedBy: 'Balaji-R-2007',
            lastModified: '2025-04-27 10:27:31'
        };

        res.json({
            success: true,
            data: updatedTask
        });

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating task'
        });
    }
};