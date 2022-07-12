import React, {useReducer, useContext } from 'react'
import reducer  from './reducer';
import axios from 'axios';

import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR, GET_TASK_BEGIN, GET_TASK_SUCCESS, HANDLE_CHANGE, CREATE_TASK_BEGIN, CREATE_TASK_SUCCESS, CREATE_TASK_ERROR, CLEAR_VALUES, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, SET_EDIT_TASK, EDIT_TASK_BEGIN, EDIT_TASK_SUCCESS, EDIT_TASK_ERROR, DELETE_TASK_BEGIN } from "./action"


// get user details from localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

// initial states of the app
const initialState = {

    isLoading: false,
    isEditing:false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user:user?JSON.parse(user):null,
    token:token,
    showSidebar:false,
    tasks: [],
    totalTasks:0,
    task:'',
    date:'',
    status:'inCompleted',
    statusOptions:['inCompleted','completed'],
    editTaskId:'',
    search: '',
    searchStatus: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest'],

}

// create a context 
const AppContext = React.createContext();

//context provider 
const AppProvider = ({children}) => {

    const [state, dispatch] = useReducer(reducer,initialState);

    //axios base url to add tokens
    const authFetch = axios.create({ 
        baseURL:'/api/v1',
    })

    //add the token to the request header
    authFetch.interceptors.request.use((config)=>{
        config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config
    },
    (error)=>{
        return Promise.reject(error)
    })

    // response interceptor
    authFetch.interceptors.response.use((response) => {
            return response
    },  
    (error) => {
        if (error.response.status === 401) {
            logoutUser();
        }
         return Promise.reject(error)
    })

    //display alert function
    const displayAlert = () => {
        dispatch({type:DISPLAY_ALERT})
        clearAlert();
    }
    
    // clear alert function
    const clearAlert = () => {
      setTimeout(() => {
        dispatch({type:CLEAR_ALERT})
      }, 3000);
    }
   
    //adding data to local storage
    const addUserToLocalStorage = ({user,token}) => {
        localStorage.setItem('user',JSON.stringify(user))
        localStorage.setItem('token',token)
    }
  
    //removing data from local storage
    const removeUserToLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    // logout user function
    const logoutUser = () =>{
        dispatch({type:LOGOUT_USER});
        removeUserToLocalStorage()
    }

    //one function for user registration and user login
    const setupUser = async ({currentUser,endPoint,alertText})=>{
        dispatch({type:SETUP_USER_BEGIN})
        try {
          const {data} = await axios.post(`/api/v1/user/${endPoint}`,currentUser);
          // console.log(response);
          const {user,token} = data
          dispatch({type:SETUP_USER_SUCCESS,payload:{user,token,alertText}})
          addUserToLocalStorage({user,token})
        } catch (error) {
          // console.log(error.response);
          dispatch({type:SETUP_USER_ERROR, payload:{msg: error.response.data.msg}})
        }
        clearAlert()
    }

    // for toggling to sidebar
    const toggleSidebar = () => {
        dispatch({type:TOGGLE_SIDEBAR})
    }

    //getTasks
    const getTasks = async () => {

      const { sort,searchStatus,search } = state

      let url = `/tasks?status=${searchStatus}&sort=${sort}`
      if(search){
        url=url+`&search=${search}`
      }
      
      dispatch({ type: GET_TASK_BEGIN })
      try {
        const {data} = await authFetch(url);
        const { tasks, totalTasks } = data
  
        dispatch({
          type: GET_TASK_SUCCESS,
          payload: {
            tasks,
            totalTasks,
          },
        })
  
      } catch (error) {
        console.log(error.response);
      }
      clearAlert()
    } 

    //when adding values to forms
    const handleChange = ({ name, value }) => {
      dispatch({
        type: HANDLE_CHANGE,
        payload: { name, value },
      })
    }

    //for clear values of a form
    const clearValues = () => {
      dispatch({type:CLEAR_VALUES})
    }

    //add task
    const createTask = async () => {
      dispatch({ type: CREATE_TASK_BEGIN })
      try {
        const { task, date, status } = state
    
        await authFetch.post('/tasks', {
          task,
          date,
          status
        })
        dispatch({
          type: CREATE_TASK_SUCCESS,
        })
        // call function instead clearValues()
        dispatch({ type: CLEAR_VALUES })
      } catch (error) {
        if (error.response.status === 401) return
        dispatch({
          type: CREATE_TASK_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
      clearAlert()
    }

    //update a user details
    const updateUser = async (currentUser) => {
      dispatch({type:UPDATE_USER_BEGIN})
        try {
          const { data } = await authFetch.patch('/user/updateUser', currentUser);
    
          const {user, token} = data
    
          dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: { user, token },
          })
          addUserToLocalStorage({ user, token })
    
        } catch (error) {
          if(error.response.status!==401){
            dispatch({
              type: UPDATE_USER_ERROR,
              payload: { msg: error.response.data.msg },
            })
          } 
        }
        clearAlert()
      }

      //make ready selecting task for updating
      const setEditTask = (id) => {
        dispatch({ type: SET_EDIT_TASK, payload: { id } })
      }
    
      //update task features
      const editTask = async () => {
        dispatch({ type: EDIT_TASK_BEGIN })
    
        const { task, date, status } = state
        try {
          await authFetch.patch(`/tasks/${state.editTaskId}`, {
            task,
            date,
            status,
          })
      
          dispatch({
            type: EDIT_TASK_SUCCESS,
          })
      
          dispatch({ type: CLEAR_VALUES })
    
        } catch (error) {
            if (error.response.status === 401) return
              dispatch({
              type: EDIT_TASK_ERROR,
              payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
      }
    
      //delete task
      const deleteTask = async (taskId) =>{
        dispatch({type:DELETE_TASK_BEGIN})
        try {
          await authFetch.delete(`/tasks/${taskId}`)
          getTasks()
    
        } catch (error) {
          console.log(error.response);
        }
      }


    //   const sendOTP = async ({email,alertText})=>{
    //     dispatch({type:OTP_SEND_BEGIN})
    //     try {
    //       const {data} = await axios.post('/api/v1/user/sendOTP',{email})
    //       dispatch({type:OTP_SEND_SUCCESS,payload:{alertText}})
    //     } catch (error) {
    //       dispatch({type:OTP_SEND_ERROR, payload:{msg: error.response.data.msg}})
    //     }
    //     clearAlert()
    // }
    
    return (
        <div>
            <AppContext.Provider value={{...state,displayAlert,setupUser, logoutUser, toggleSidebar, getTasks, handleChange, createTask, clearValues, updateUser, setEditTask, editTask, deleteTask, }} >
                {children}
            </AppContext.Provider>
        </div>
    ) 

}

//calling this method will make easy to get data to consumers
const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, useAppContext, initialState }
