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