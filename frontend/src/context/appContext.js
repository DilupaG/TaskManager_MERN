import React, {useReducer, useContext } from 'react'
import reducer  from './reducer';
import axios from 'axios';

import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS, LOGIN_USER_BEGIN, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR } from "./action"


// get user details from localStorage
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

// initial states of the app
const initialState = {

    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user:user?JSON.parse(user):null,
    token:token,
    showSidebar:false,
    isEditing: false,
    tasks: [],

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

    return (
        <div>
            <AppContext.Provider value={{...state,displayAlert,registerUser,loginUser,setupUser, logoutUser,toggleSidebar }} >
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
