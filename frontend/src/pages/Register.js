import {React,useState,useEffect} from 'react';
import {Alert, FormRow} from '../components';
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext';
import {useNavigate} from 'react-router-dom';

const Register = () => {

  const initialState = {
    name:'',
    email:'',
    password:'',
    isMember:true,
  }

  const [values, setValues] = useState(initialState);
  const navigate = useNavigate();
  const {user, isLoading,showAlert, displayAlert, setupUser} = useAppContext()

  const handleChange = (e) => {
    setValues({...values,[e.target.name]:e.target.value})
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const {name,email,password,isMember} = values;
    if(!email || !password || (!isMember && !name)){
      displayAlert()
      return 
    }
    const currentUser = {name,email,password}
    if(isMember){
      setupUser({currentUser,endPoint:'login',alertText:'Login Successful! Redirecting...'});
    }else{
      setupUser({currentUser,endPoint:'register',alertText:'User Created! Redirecting...'});
    }
  }

  useEffect(() => {
    if(user){
      setTimeout(() => {
       navigate('/')
      }, 3000);  
    }
  }, [user,navigate]);

 const toggle = () => {
   setValues({...values, isMember:!values.isMember})
 }

  return (
    <Wrapper className='full-page'>

      <form onSubmit={onSubmit} className="form">
        {/* <Logo/> */}
        {values.isMember ? <h3>Login</h3>:<h3>Register</h3>}
        {showAlert&&<Alert/>}

        {/* name input */}
        {!values.isMember && <FormRow name='name' lableText='name' type='text' value={values.name} handleChange={handleChange}/>}
        {/* email input */}
        <FormRow name='email' lableText='email' type='email' value={values.email} handleChange={handleChange}/>

        {/* password input */}
        <FormRow name='password' lableText='password' type='password' value={values.password} handleChange={handleChange}/>

        {/* submit button */}
        <button className="btn btn-block" disabled={isLoading}>submit</button>

        <p>
          {values.isMember ? 'Not a member yet?':'Already a member?'}
          <button type='button' onClick={toggle} className='member-btn'>{values.isMember ? 'Register':'Login'}</button>
        </p>
      </form>

    </Wrapper>
  )
}

export default Register
