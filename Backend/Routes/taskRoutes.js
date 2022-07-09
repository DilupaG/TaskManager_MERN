const express = require('express')
const router = express.Router();

const {getTasks,createTask,updateTask,deleteTask} =  require('../Controllers/taskController');

router.route('/').post(createTask).get(getTasks);
router.route('/:id').patch(updateTask).delete(deleteTask);


module.exports = router