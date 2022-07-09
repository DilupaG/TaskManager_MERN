const { UnauthenticatedError } = require('../Errors/index') 

const checkPermissions = (requestUser, resourceUserId) => {
  
    if (requestUser.userId === resourceUserId.toString()){
        return
    } 
    throw new CustomError.UnauthenticatedError('Not authorized to access this route')
  }
  
  module.exports = checkPermissions