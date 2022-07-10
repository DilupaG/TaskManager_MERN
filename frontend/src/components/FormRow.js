import React from 'react';

const FormRow = ({name,type,handleChange,value,lableText}) => {
  return (
    <div>
        <div className="form-row">
          <label htmlFor="name" className='form-label'>{lableText||name}</label>
          <input type={type} value={value} name={name} onChange={handleChange} className='form-input'/>
        </div>
    </div>
  )
}

export default FormRow