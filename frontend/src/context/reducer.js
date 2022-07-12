import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS, LOGIN_USER_BEGIN, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, HANDLE_CHANGE, CREATE_JOB_BEGIN, CREATE_JOB_SUCCESS, CREATE_JOB_ERROR, CLEAR_VALUES, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, SET_EDIT_JOB, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, DELETE_JOB_BEGIN  } from "./action"

import { initialState } from "./appContext"//to logout 

const reducer = (state,action)=>{

    if(action.type===DISPLAY_ALERT){
        return {...state,showAlert:true,alertType:'danger',alertText:'Please provide all values correctly'}
    }
    if(action.type===CLEAR_ALERT){
        return {...state,showAlert:false,alertType:'',alertText:''}
    }
    if(action.type===REGISTER_USER_BEGIN){
        return {...state,isLoading:true}
    }
    if(action.type===REGISTER_USER_SUCCESS){
        return {...state,isLoading:false, token:action.payload.token, user:action.payload.user, showAlert:true, alertType:'success', alertText:'Login Successful! Redirecting...'}
    }
    if(action.type===REGISTER_USER_ERROR){
        return {...state,isLoading:false, showAlert:true, alertType:'danger', alertText:action.payload.msg}
    }
    if(action.type===LOGIN_USER_BEGIN){
        return {...state,isLoading:true}
    }
    if(action.type===LOGIN_USER_SUCCESS){
        return {...state,isLoading:false, token:action.payload.token, user:action.payload.user, showAlert:true, alertType:'success', alertText:'Login Successful! Redirecting...'}
    }
    if(action.type===LOGIN_USER_ERROR){
        return {...state,isLoading:false, showAlert:true, alertType:'danger', alertText:action.payload.msg}
    }
    if(action.type===LOGOUT_USER){
        return {...initialState, user:null, token:null, jobLocation:'', userLocation:''}
    }
    if(action.type===SETUP_USER_BEGIN){
        return {...state,isLoading:true}
    }
    if(action.type===SETUP_USER_SUCCESS){
        return {...state,isLoading:false, token:action.payload.token, user:action.payload.user, showAlert:true, alertType:'success', alertText:action.payload.alertText}
    }
    if(action.type===SETUP_USER_ERROR){
        return {...state,isLoading:false, showAlert:true, alertType:'danger', alertText:action.payload.msg}
    }
    if(action.type===TOGGLE_SIDEBAR){
        return {...state, showSidebar:!state.showSidebar}
    }
    if (action.type === GET_JOBS_BEGIN) {
        return { ...state, isLoading: true, showAlert: false }
    }
    if (action.type === GET_JOBS_SUCCESS) {
        return {
          ...state,
          isLoading: false,
          tasks: action.payload.tasks,
          totalTasks: action.payload.totalTasks,
        }
    }
    if (action.type === HANDLE_CHANGE) {
        return { ...state, [action.payload.name]: action.payload.value, }
    }
    if (action.type === CLEAR_VALUES) {
        const initialState = {
          isEditing: false,
          task:'',
          date:'',
          status: 'inCompleted',
        }
        return { ...state, ...initialState }
    }
    if (action.type === CREATE_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === CREATE_JOB_SUCCESS) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'success',
          alertText: 'New Task Created!',
        }
    }
    if (action.type === CREATE_JOB_ERROR) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'danger',
          alertText: action.payload.msg,
        }
    }
    if(action.type===UPDATE_USER_BEGIN){
        return {...state,isLoading:true}
    }
    if(action.type===UPDATE_USER_SUCCESS){
        return {...state,isLoading:false, token:action.payload.token, user:action.payload.user, showAlert:true, alertType:'success', alertText:'User Profile Updated!'}
    }
    if(action.type===UPDATE_USER_ERROR){
        return {...state,isLoading:false, showAlert:true, alertType:'danger', alertText:action.payload.msg}
    }
    if (action.type === SET_EDIT_JOB) {
        const t = state.tasks.find((task) => task._id === action.payload.id)
        const { _id, task, date, status } = t
        var res = date.substring(0, 10);

        return {
          ...state,
          isEditing: true,
          editTaskId: _id,
          task,
          date:res,
          status,
        }
    }

    if (action.type === DELETE_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }

    if (action.type === EDIT_JOB_BEGIN) {
        return { ...state, isLoading: true }
    }
    
    if (action.type === EDIT_JOB_SUCCESS) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'success',
          alertText: 'Task Updated!',
        }
    }
    
    if (action.type === EDIT_JOB_ERROR) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'danger',
          alertText: action.payload.msg,
        }
    }

    throw new Error(`no such action : ${action.type}`)
}
export default reducer