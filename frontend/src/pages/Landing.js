import React from 'react'
import Wrapper from '../assets/wrappers/LandingPage'
import { Logo } from '../components/'
import { Link } from 'react-router-dom'

const Landing = () => {
  return (
    <Wrapper>
      
        <Logo />
      
      <div className='container page'>
        <div className='info'>
          <h1>
          <span>1</span>billion Task  Manager
          </h1>
          <p>
          Task management is the link between planning to do something and getting it done. Your task management software should provide an overview of work in progress that enables tracking from conception to completion. Enter 1billion task: join teams everywhere to use our task manager to digitalize workflows and gain a clear overview of task progress. Let's get organized together!
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
      </div>
    </Wrapper>
  )
}

export default Landing
