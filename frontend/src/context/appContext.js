import React, {useReducer, useContext } from 'react'
import reducer  from './reducer';
import axios from 'axios';

import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS, LOGIN_USER_BEGIN, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, HANDLE_CHANGE, CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR, CLEAR_VALUES, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, SET_EDIT_JOB, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, DELETE_JOB_BEGIN, OTP_SEND_BEGIN, OTP_SEND_SUCCESS, OTP_SEND_ERROR } from "./action"


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

    //register user function.............................................................................................
    const registerUser = async (currentUser)=>{
        dispatch({type:REGISTER_USER_BEGIN})
        try {
          const response = await axios.post('/api/v1/user/register',currentUser);
          // console.log(response);
          const {user,token} = response.data
          dispatch({type:REGISTER_USER_SUCCESS,payload:{user,token}})
          addUserToLocalStorage({user,token})
        } catch (error) {
          // console.log(error.response);
          dispatch({type:REGISTER_USER_ERROR, payload:{msg: error.response.data.msg}})
        }
        clearAlert()
    }
    
    //login user function
    const loginUser = async (currentUser)=>{
        dispatch({type:LOGIN_USER_BEGIN})
        try {
          const {data} = await axios.post('/api/v1/user/login',currentUser);
          // console.log(response);
          const {user,token} = data
          dispatch({type:LOGIN_USER_SUCCESS,payload:{user,token}})
          addUserToLocalStorage({user,token})
        } catch (error) {
          // console.log(error.response);
          dispatch({type:LOGIN_USER_ERROR, payload:{msg: error.response.data.msg}})
        }
        clearAlert()
    }
    // .............................................................................................................................
    
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
      
      dispatch({ type: GET_JOBS_BEGIN })
      try {
        const {data} = await authFetch(url);
        const { tasks, totalTasks } = data
  
        dispatch({
          type: GET_JOBS_SUCCESS,
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

    const clearValues = () => {
      dispatch({type:CLEAR_VALUES})
    }

    const createTask = async () => {
      dispatch({ type: CREATE_JOB_BEGIN })
      try {
        const { task, date, status } = state
    
        await authFetch.post('/tasks', {
          task,
          date,
          status
        })
        dispatch({
          type: CREATE_JOB_SUCCESS,
        })
        // call function instead clearValues()
        dispatch({ type: CLEAR_VALUES })
      } catch (error) {
        if (error.response.status === 401) return
        dispatch({
          type: CREATE_JOB_ERROR,
          payload: { msg: error.response.data.msg },
        })
      }
      clearAlert()
    }

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

      const setEditTask = (id) => {
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
      }
    
      const editTask = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
    
        const { task, date, status } = state
        try {
          await authFetch.patch(`/tasks/${state.editTaskId}`, {
            task,
            date,
            status,
          })
      
          dispatch({
            type: EDIT_JOB_SUCCESS,
          })
      
          dispatch({ type: CLEAR_VALUES })
    
        } catch (error) {
            if (error.response.status === 401) return
              dispatch({
              type: EDIT_JOB_ERROR,
              payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
      }
    
    
      const deleteTask = async (taskId) =>{
        dispatch({type:DELETE_JOB_BEGIN})
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
            <AppContext.Provider value={{...state,displayAlert,registerUser,loginUser,setupUser, logoutUser, toggleSidebar, getTasks, handleChange, createTask, clearValues, updateUser, setEditTask, editTask, deleteTask, }} >
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
