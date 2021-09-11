const userSchema = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const path = require('path');


// Current user profile
exports.myProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await userSchema.findById(user.id).select("-password -__v");
    res.status(200).json({
      status: "ok",
      data: currentUser
    });
  } catch (error) {
    // console.log(error);
    res.send("An error occured" + error);
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await jwt.verify(token, process.env.JWT_SECRET);
  const id = user.id
  await userSchema.find({ _id: { $ne: id } })
    .exec(function (err, data) {
      if (err) next(err)
      res.status(200).send(data)
    })
}

//Get a single user
exports.getOneUser = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(user)
  const userExists = await userSchema.exists({ _id: user.id });
  const liveUser = await userSchema.findById(user.id);
  // console.log(liveUser)
  if (!userExists) {
    return res.status(404).json({
      status: "error",
      message: "No user found"
    })
  }
  else if (liveUser.id == req.params.id || liveUser.role == 1) {
    await userSchema.findById(req.params.id, (error, data) => {
      if (error) {
        res.status(200).json({
          status: "false",
          data: error,
        });
      } else {
        res.status(200).json({
          status: "true",
          data: data,
        });
      }
    });
  }
  else {
    res.status(401).json({
      message: "you are not authaurized",
    });
  }
}

// Updating a user 
exports.updateUser = async (req, res, next) => {
  try {
    const updates = req.body;
    const options = { new: true };
    const result = await userSchema.findByIdAndUpdate(req.params.id, updates, options)
    res.send(result);
  }
  catch (err) {
    res.status(500).json({
      message: "Something went wrong " + err
    })
  }
}
// Update profile picture 
exports.updateUserProfilePic = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);

    if (req.params.id == user.id) {
      // console.log(req.file.filename)
      const result = await userSchema.findOneAndUpdate({ _id: user.id }, {
        $push:
        {
          avatar: req.file.filename.toString()
        }
      })
      // console.log(categoryUpdate)
      res.status(201).json({
        status: "ok",
        message: {
          msg: "Picture Updated",
          data: result
        }
      })
    }
    else {
      res.status(401).json({
        status: "ok",
        message: {
          msg: "error:you can update only your profile picture "

        }
      })
    }
  }
  catch (error) {
    return res.status(500).json({
      status: "error",
      message: {
        msg: "An error occured",
        data: error
      }
    })
  }
}
// Get user image
exports.updateUserProfilePic = async (req, res, next) => {
  const DIR = path.resolve(__dirname, `../uploads/Users/${req.params.filename}`)
  res.sendFile(DIR);
}

//  Deleting a user
exports.deleteUser = async (req, res, next) => {
  try {
    // console.log("Hi")
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.findById(user.id)
    console.log(liveUser)
    console.log(liveUser.role)
    console.log(req.params.id)
    if (req.params.id == liveUser.id || liveUser.role == 1 ) {
      await userSchema.findByIdAndRemove(user.id, (err, data) => {
        if (err) return err;
        else if (data == null) return res.status(200).json({ message: "The user does not exists" })
        else return res.status(200).json({
          status: "ok",
          message: "The user Deleted Successfully.",
          data: data
        })
      })
    }
    else {
      res.status(401).json({
        status: "Error",
        message: "UNAUTHORIZED !",
      })
    }
  }
  catch (err) {
    console.log(err)
    res.send(err)
  }
}
// Get admin products
exports.getProductByCategory = async (req, res, next) => {
  try {
    // console.log(req.params.id)
    await userSchema
      .findOne({ _id: req.params.id })
      .select('products')
      .populate('products')
      .exec(function (err, product) {
        if (err) return err;
        // console.log(product);
        res.status(200).send(product)
      });
  }
  catch (error) {
    res.status(500).json({
      data: {
        status: "error",
        message: [error]
      }
    })
  }
}
// Get viewed products
exports.getViewedProducts = async (req, res, next) => {
  try {
    // console.log(req.params.id)
    await userSchema
      .findOne({ _id: req.params.id })
      .select('productsviewed')
      .populate('productsviewed')
      .exec(function (err, product) {
        if (err) return err;
        // console.log(product);
        res.status(200).json({
          data: {
            status: "ok",
            data: [product]
          }
        })
      });
  }
  catch (error) {
    res.status(500).json({
      data: {
        status: "error",
        message: [error]
      }
    })
  }
}

// View category made by admin
exports.getAdminCategory = async (req, res, next) => {
  try {
    const categories = await userSchema
      .findOne({ _id: req.params.id })
      .select('categories')
      .populate('categories')
    res.status(200).send(categories)
  }
  catch (error) {
    res.status(500).json({
      data: {
        status: "error",
        message: error
      }
    })
  }
}


// Change Password
exports.changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const userId = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await userSchema.findById(req.params.id)
    // console.log('\n' + userId.id + '\n')
    // console.log(req.params.id)

    if (userId.id == req.params.id) {
      bcrypt.compare(req.body.current_password, user.password, async function (err, isMatch) {
        if (err) {
          throw err
        } else if (!isMatch) {
          return res.status(401).json({
            message: "The password is not correct"
          })
        } else {
          const newPassword = await bcrypt.hash(req.body.new_password, 10)
          const _id = user.id;
          await userSchema.updateOne({ _id }, {
            $set: { password: newPassword }
          })
          res.status(200).json({
            data: {
              status: "ok",
              message: "Password changed successfully."
            }
          })
        }
      })
    }
    else {
      res.status(401).json({
        status: "error",
        message: "The current password is not correct"
      })
    }
  }
  catch (err) {
    res.status(400).json({
      message: "An error occured. " + err
    })
  }
}