import { DISPLAY_ALERT, CLEAR_ALERT, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, LOGOUT_USER, TOGGLE_SIDEBAR, GET_TASK_BEGIN, GET_TASK_SUCCESS, HANDLE_CHANGE, CREATE_TASK_BEGIN, CREATE_TASK_SUCCESS, CREATE_TASK_ERROR, CLEAR_VALUES, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, SET_EDIT_TASK, EDIT_TASK_BEGIN, EDIT_TASK_SUCCESS, EDIT_TASK_ERROR, DELETE_TASK_BEGIN  } from "./action"

import { initialState } from "./appContext"//to logout 

const reducer = (state,action)=>{

    if(action.type===DISPLAY_ALERT){
        return {...state,showAlert:true,alertType:'danger',alertText:'Please provide all values correctly'}
    }
    if(action.type===CLEAR_ALERT){
        return {...state,showAlert:false,alertType:'',alertText:''}
    }
    if(action.type===LOGOUT_USER){
        return {...initialState, user:null, token:null}
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
    if (action.type === GET_TASK_BEGIN) {
        return { ...state, isLoading: true, showAlert: false }
    }
    if (action.type === GET_TASK_SUCCESS) {
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
    if (action.type === CREATE_TASK_BEGIN) {
        return { ...state, isLoading: true }
    }
    if (action.type === CREATE_TASK_SUCCESS) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'success',
          alertText: 'New Task Created!',
        }
    }
    if (action.type === CREATE_TASK_ERROR) {
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
    if (action.type === SET_EDIT_TASK) {
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

    if (action.type === DELETE_TASK_BEGIN) {
        return { ...state, isLoading: true }
    }

    if (action.type === EDIT_TASK_BEGIN) {
        return { ...state, isLoading: true }
    }
    
    if (action.type === EDIT_TASK_SUCCESS) {
        return {
          ...state,
          isLoading: false,
          showAlert: true,
          alertType: 'success',
          alertText: 'Task Updated!',
        }
    }
    
    if (action.type === EDIT_TASK_ERROR) {
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