const categorySchema = require('../models/categorySchema');
const userSchema = require('../models/userSchema');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")

// Adding a category 
exports.addCategory = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.findById(user.id)
    const { name, description } = req.body;
    const categoryExists = await categorySchema.exists({ name: name });
    if (liveUser.role == 4 && liveUser.canAddCategory == false) {
      res.status(401).json({
        message: "You are not authorized for this action"
      })
    }
    else if (categoryExists) {
      return res.status(409).json({
        status: "error",
        message: "Category already exists with the same name."
      })
    }
    else {
      const categoryObj = new categorySchema({
        name: name,
        description: description,
        products: [],
        createdBy: user.id
      });
      const category = await categoryObj.save()
      await userSchema.findOneAndUpdate({ _id: user.id }, {
        $push:
        {
          categories: category.id
        }
      })
      return res.status(200).json({
        message: "The category successfully added"
      })

    }

  }
  catch (error) {
    return res.status(500).json({
      message: "An error occurred" + error
    })
  }

}

// Get all categories
exports.getAllCategories = (req, res) => {
  categorySchema.find((error, response) => {
    if (error) {
      return next(error)
    } else {
      res.status(200).json(response)
    }
  })
}
//Get a single category
exports.getOneCategory = (req, res, next) => {
  categorySchema.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        data: data,
      });
    }
  });
}

// Updating a category 
exports.updateCategory = async (req, res, next) => {
  const categoryExists = await categorySchema.exists({ _id: req.params.id });
  const category = await categorySchema.findById(req.params.id);
  if (categoryExists) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.findById(user.id)
    let id = user.id.toString()
    let catId = category.createdBy.toString()

    if (liveUser.role != 3 && catId == id || liveUser.role == 1 || liveUser.canEditCategory == true) {
      try {
        const updates = req.body;
        const options = { new: true };
        const result = await categorySchema.findByIdAndUpdate(req.params.id, updates, options)
        res.send(result);
      }
      catch (err) {
        res.status(500).json({
          message: "Something went wrong " + err
        })
      }
    }
    else {
      res.status(401).json({
        status: "error",
        message: "You are not authorized"
      })
    }

  }
  else {
    res.status.json({
      status: "error",
      message: "Category does not exists"
    })
  }
}

//  Deleting a category
exports.deleteCategory = async (req, res, next) => {
  try {
    const categoryExists = await categorySchema.exists({ _id: req.params.id });
    const category = await categorySchema.findById(req.params.id);
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.findById(user.id).select("role canDeleteCategory")
    let id = user.id.toString()
    let catId = category.createdBy.toString()
    if (categoryExists) {
      if (liveUser.role == 1 || liveUser.role != 3 && catId == id || liveUser.canDeleteCategory == true) {
        try {
          await categorySchema.findByIdAndRemove(req.params.id, async (err, data) => {
            if (err) throw err;
            else {
              const token = req.headers.authorization.split(" ")[1];
              const user = await jwt.verify(token, process.env.JWT_SECRET);
              await userSchema.findOneAndUpdate({ _id: user.id }, {
                $pull: {
                  categories: req.params.id
                }
              })
              return res.status(200).json({
                status: "ok",
                message: "The category Deleted Successfully.",
                data: data
              })
            }
          })
        }
        catch (err) {
          throw err
        }
      }
      else {
        return res.status(200).json({
          status: "error",
          message: "you are not authorized for this action."
        })
      }

    }
    else {
      res.status(404).json({
        status: "Error",
        message: "Category does not exists",
      })
    }
  }
  catch (err) {
    res.status(500).json({
      message: "An error occurred" + err
    })
  }
}

