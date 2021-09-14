const userSchema = require('../models/userSchema');
const bcrypt = require('bcrypt')

exports.adminCreatedUser = async (req, res, next) => {
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
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
      role: 4,
      products: [],
      categories: [],
      productsviewed: [],
      canEditCategory: req.body.canEditCategory,
      canDeleteCategory: req.body.canDeleteCategory,
      canAddCategory: req.body.canAddCategory,
      canAddProduct: req.body.canAddProduct,
      canDeleteProduct: req.body.canDeleteProduct,
      canEditProduct: req.body.canEditProduct,
      canDeleteUser: req.body.canDeleteUser
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