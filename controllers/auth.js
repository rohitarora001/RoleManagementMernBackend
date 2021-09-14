const userSchema = require('../models/userSchema');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');



//user sign in
exports.userSignIn = async (req, res, next) => {
  const { email, password } = req.body
  const user = await userSchema.findOne({ email }).lean()
  if (!user) {
    return res.status(401).json({ status: 'error', error: 'User is not registered' })
  }
  bcrypt.compare(password, user.password, function (err, isMatch) {
    if (err) {
      throw err
    } else if (!isMatch) {
      return res.status(403).json({
        message: "The password is not correct"
      })
    } else {
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET
      )

      return res.status(200).json({ status: 'ok', data: user, token: token })
    }
  })
}
// user sign up 
exports.userSignup = async (req, res, next) => {
  try {
    // Phone number and email validation
    // Phone Number Validation
    const { phone, email } = req.body;
    const emailExists = await userSchema.exists({ email: email });
    const phoneExists = await userSchema.exists({ phone: phone });
    const phoneNo = /^[6-9]\d{9}$/.test(phone) //Only for indian numbers
    const emailAddr = /^\S+@\S+\.\S+$/.test(email)
    if (emailExists) {
      return res.status(409).json({
        status: "error",
        message: "User already exists with the same email."
      })
    }
    else if (phoneExists) {
      res.status(409).json({
        status: "error",
        message: "User already exists with the same phone number."
      })
    }

    else if (!phoneNo) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Phone Number"
      })
    }
    // Email validation
    else if (!emailAddr) {
      return res.status(400).json({
        status: "Error",
        message: "Invalid Email Address"
      })
    }
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new userSchema({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
      role: req.body.role,
      products: [],
      categories: [],
      productsviewed: [],
      canEditCategory: false,
      canDeleteCategory: false,
      canAddCategory: false,
      canAddProduct: false,
      canDeleteProduct: false,
      canEditProduct: false,
    });
    await user
      .save()
    return res.status(200).json({
      message: "The user successfully registered"
    })
  }

  catch (err) {
    res.status(400).json({
      message: "An error occured." + err
    })
    console.log(err);
  }
}