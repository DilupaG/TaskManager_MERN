import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import Wrapper from '../assets/wrappers/Task'
import TaskInfo from './TaskInfo'


const Task = ({_id,task,date,status,}) => {

  const { setEditTask, deleteTask } = useAppContext()

  let d = moment(date)
  d = d.format('MMM Do, YYYY')

  return (
    <Wrapper>
      <header>
        <div className='main-icon'>{task.charAt(0)}</div>
        <div className='info'>
          <h5>{task}</h5>
          <p>{status}</p>
        </div>
      </header>
      <div className='content' >
        <div className="content-center">
          <TaskInfo icon={<FaLocationArrow/>}  text={task}/>
          <TaskInfo icon={<FaCalendarAlt />} text={d} />
          <div className={`status ${status}`}>{status}</div>
        </div>
        <footer>
          <div className='actions'>
            <Link
              to='/add-task'
              onClick={() => setEditTask(_id)}
              className='btn edit-btn'
            >
              Edit
            </Link>
            <button
              type='button'
              className='btn delete-btn'
              onClick={() => deleteTask(_id)}
            >
              Delete
            </button>
          </div>
        </footer>
      </div>
    </Wrapper>
  )
}

export default Task