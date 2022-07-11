import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import moment from 'moment'

const AddTask = () => {

  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    task,
    date,
    status,
    statusOptions,
    handleChange,
    createTask,
    editTask

  } = useAppContext()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!task || !date || !status) {
      displayAlert()
      return
    }
    if(isEditing){
      editTask() 
      return
    }
    createTask()
  }

  const handleTaskInput = (e) => {
    const name = e.target.name
    const value = e.target.value
    handleChange({name,value})
  }

  return (
    <Wrapper>
      <form className='form'>
        <h3>{isEditing ? 'Edit Task' : 'Add Task'} </h3>
        {showAlert && <Alert />}

        {/* task */}
        <div className='form-center'>
          <FormRow
            type='text'
            name='task'
            value={task}
            handleChange={handleTaskInput}
          />
          {/* date to complete */}
          <FormRow
            type='date'
            labelText='date'
            name='date'
            value={date}
            handleChange={handleTaskInput}
          />
          {/* task status */}
          <FormRowSelect
            name='status'
            value={status}
            handleChange={handleTaskInput}
            list={statusOptions}
          />

          <div className='btn-container'>
            <button
              className='btn btn-block submit-btn'
              type='submit'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  )
}

export default AddTask
