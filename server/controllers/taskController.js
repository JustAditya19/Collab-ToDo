const Task = require('../models/Task');
const User = require('../models/User');

// 🧠 Get user with fewest active tasks
const getUserWithFewestTasks = async (fallbackUserId) => {
  const userTasks = await Task.aggregate([
    { $match: { status: { $in: ['todo', 'in-progress'] } } },
    { $group: { _id: '$assignedTo', count: { $sum: 1 } } },
    { $sort: { count: 1 } },
    { $limit: 1 }
  ]);

  if (userTasks.length > 0) {
    return userTasks[0]._id;
  }

  return fallbackUserId; // fallback to current user if no others
};


// 📌 Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const creatorId = req.user._id;

    const assigneeId = await getUserWithFewestTasks(req.user._id);

    const task = await Task.create({
      title,
      description,
      priority,
      assignedTo: assigneeId,
      createdBy: creatorId,
      lastUpdatedBy: creatorId
    });

    res.status(201).json({ message: "Task created", task });
  } catch (error) {
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// 📂 Fetch All Tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo', 'username email').sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error: error.message });
  }
};

// Get task by id
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).populate('assignedTo', 'username email');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (err) {
    res.status(500).json({ message: "Error fetching task", error: err.message });
  }
};

// ✅ Update Task Status (move card)
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = status;
    task.lastUpdated = new Date();
    task.lastUpdatedBy = req.user._id;

    await task.save();

    res.status(200).json({ message: "Task status updated", task });
  } catch (err) {
    res.status(500).json({ message: "Error updating task", error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted", task });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task", error: err.message });
  }
};