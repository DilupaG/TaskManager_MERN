const Task = require('../Model/Task')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError,NotFoundError} = require('../Errors/index') 
const checkPermissions = require('../Utils/checkPermission');

// Create a Task
const createTask = async (req,res)=>{
    const {task,date,status} = req.body;

    if(!task || !date || !status){
        throw new BadRequestError('Please provide all values')
    }

    req.body.createdBy = req.user.userId; //insert userID to request body. 

    const respond = await Task.create(req.body);
    res.status(StatusCodes.CREATED).json({respond});
}

// Get all task according to the user
const getTasks = async (req,res)=>{
    const tasks = await Task.find({ createdBy: req.user.userId })
    res.status(StatusCodes.OK).json({tasks, totalTasks: tasks.length})
} 

//update a task
const updateTask = async(req,res)=>{
    const {id} = req.params
    const {task, date, status}=req.body
    
    if(!task || !date || !status){
        throw new BadRequestError('Please provide all values')
    }

    const isTaskAvailable = await Task.findOne({_id:id})

    if(!isTaskAvailable){
        throw new NotFoundError(`No task with task id :${id}`)
    }

    //authorization 
    checkPermissions(req.user, isTaskAvailable.createdBy)
    
    const updateTask = await Task.findOneAndUpdate({_id:id},req.body,{
        new: true,
        runValidators:true
    })

    res.status(StatusCodes.OK).json({updateTask})

}


// delete a task
const deleteTask = async(req,res)=>{

    const { id } = req.params
  
    const isTaskAvailable = await Task.findOne({ _id: id })
  
    if (!isTaskAvailable) {
      throw new CustomError.NotFoundError(`No task with id : ${jobId}`)
    }
    
    // authorization
    checkPermissions(req.user, isTaskAvailable.createdBy)
  
    await isTaskAvailable.remove()
    res.status(StatusCodes.OK).json({ msg: 'Success! Task removed' })

}


module.exports = {getTasks, createTask, updateTask, deleteTask}