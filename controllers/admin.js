const userSchema = require('../models/userSchema');
const bcrypt = require('bcrypt')

// For creating a user with custom roles
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
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      phone: req.body.phone,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
      products: [],
      categories: [],
      productsviewed: [],
      userRole: req.body.userRole,
      role: 4,
      canEditCategory: req.body.canEditCategory.toString(),
      canDeleteCategory: req.body.canDeleteCategory.toString(),
      canAddCategory: req.body.canAddCategory.toString(),
      canAddProduct: req.body.canAddProduct.toString(),
      canDeleteProduct: req.body.canDeleteProduct.toString(),
      canEditProduct: req.body.canEditProduct.toString(),
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

// Revoking and giving permisions to users
exports.permissionControl = async (req, res, next) => {
  try {
    const updates = req.body;
    const options = { new: true };
    const result = await userSchema.findByIdAndUpdate(req.params.id, updates, options)
    res.send(result);
  }
  catch (e) {
    res.status(500).json({
      message: "Something went wrong " + e
    })
  }
}