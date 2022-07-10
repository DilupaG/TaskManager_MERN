import React,{ useEffect } from 'react'
import { useAppContext } from '../context/appContext'
import Loading from './Loading'
import Task from './Task'
import Wrapper from '../assets/wrappers/TasksContainer'

const TasksContainer = () => {

  const { getTasks, tasks, isLoading, totalTasks } = useAppContext()

  useEffect(() => { 
    getTasks()   
  }, []); 

  if(isLoading){
    return <Loading center/>
  }

  if(tasks.length===0){
    return <Wrapper>
      <h2>No tasks to display...</h2>
    </Wrapper>
  }

  return (
    <Wrapper>
      <h5>{totalTasks} task{tasks.length > 1 && 's'} found</h5>
      <div className="jobs">
          {tasks.map((task)=>{
              return <Task key={task._id} {...task}/>
          })}
      </div>
    </Wrapper>
  )
}

export default TasksContainer
