const User = require('../Model/User')
const { BadRequestError, UnAuthenticatedError } = require('../Errors/index')



// Register
const register = async (req,res)=>{

    const {name,email,password} = req.body

    if(!name || !email || !password){
        throw new BadRequestError('please provide all values')
    }

    const userAlreadyExists = await User.findOne({email})
    if(userAlreadyExists){
        throw new BadRequestError('Email already in use')
    }
   
    const user = await User.create({name,email,password});
    const token = user.createJWT();
    res.status(200).json({user:{email:user.email, name:user.name, password:user.password},token});
    
}

// Login
const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        throw new UnAuthenticatedError('Invalid Email')
    }
  
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Password')
    }
    const token = user.createJWT()
    user.password = undefined
    res.status(200).json({ user, token})
  }


//   Update user
const updateUser = async (req, res) => {
    const { email, name, password } = req.body

    if (!email || !name || !password) {
        throw new BadRequestError('Please provide all values')
      }
   
    const user = await User.findOne({ _id: req.user.userId })
  
    user.email = email
    user.name = name
    user.password = password
  
    await user.save()
  
    const token = user.createJWT()
  
    res.status(200).json({ user, token })
  }


  module.exports ={ register, login, updateUser }