import {React,useState,useEffect} from 'react';
import {Alert, FormRow} from '../components';
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext';
import {useNavigate} from 'react-router-dom';
import axios from 'axios'

const ResetPassword = () => {

    const initialState = {  
        email:'',
        password:'',
        userOTP:'',
        systemOTP:'',
        match:false
    }

    const [values, setValues] = useState(initialState);
    const navigate = useNavigate();
    const {user,showAlert, displayAlert} = useAppContext()
    
    const handleChange = (e) => {
        setValues({...values,[e.target.name]:e.target.value})
    }


    const onSubmit = async (e) => {
        e.preventDefault();
        const {email,password,userOTP,systemOTP} = values;
       
        if(email && !userOTP && !systemOTP && !password){
            try {
                var response = await axios.post('/api/v1/user/sendOTP',{email})
            } catch (error) {
                alert(error.response.data.msg)
            }
          setValues({...values,systemOTP:response.data.systemOTP})
        }else if(email && userOTP && !password ){        
          if(values.userOTP==values.systemOTP){
            setValues({...values,match:true,systemOTP:''})
          }else{
            displayAlert()
            return
          }
        }else if(email && password){
            try {
                let response = await axios.patch('/api/v1/user/resetPassword',{password,email})
                navigate('/register')
            } catch (error) {
                console.log(error.response.data.msg);   
            }
        }else{
            displayAlert()
            return
        }
    }
    
    useEffect(() => {
        if(user){
          setTimeout(() => {
           navigate('/')
          }, 3000);  
        }
    }, [user,navigate]);
    
    
    return (
        <Wrapper className='full-page'>

      <form onSubmit={onSubmit} className="form">
       
        <h3>Reset Password</h3>
        {showAlert&&<Alert/>}

        {/* email input */}
        <FormRow name='email' lableText='email' type='email' value={values.email} handleChange={handleChange}/>

        {/* otp input */}
        {values.systemOTP && <FormRow name='userOTP' lableText='otp' type='number' value={values.userOTP} handleChange={handleChange}/>}

        {/* password input */}
        {values.match&&<FormRow name='password' lableText='new password' type='password' value={values.password} handleChange={handleChange}/>}

        {/* submit button */}
        <button className="btn btn-block">submit</button>
      </form>

    </Wrapper>
    )
}

export default ResetPassword
