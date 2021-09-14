const productSchema = require('../models/productSchema');
const categorySchema = require('../models/categorySchema');
const userSchema = require('../models/userSchema');
const jwt = require("jsonwebtoken");

// Add product
exports.addProduct = async (req, res, next) => {
  try {
    
    const id = req.body.category;
    const categoryExists = await categorySchema.exists({ _id: req.body.category })
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.findById(user.id)
    if( liveUser.role == 4 && liveUser.canAddProduct == false)
    {
      return res.status(401).json({
        message:"You are not authorized for this action"
      })
    } 
    else if (categoryExists) {
      const productObj = new productSchema({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: id,
        createdBy: user.id,
        picture: []
      });

      const product = await productObj.save()
      const files = req.files;
      if (files) {
        files.map(async (f) => {
          await productSchema.findOneAndUpdate({ _id: product.id }, {
            $push:
            {
              pictures: f.filename
            }
          })
        })
      }

      await userSchema.findOneAndUpdate({ _id: product.createdBy }, {
        $push:
        {
          products: product.id
        }
      })
      // console.log( push )
      await categorySchema.findOneAndUpdate({ _id: id }, {
        $push:
        {
          products: product.id
        }
      })
      // console.log(categoryUpdate)
      res.status(201).json({
        status: "ok",
        message: {
          data: "Product added"
        }
      })
    }
    else {
      res.status(404).json({
        status: "error",
        message: {
          data: "Category does not exists. Make a category first"
        }
      })
    }

  }
  catch (err) {
    res.status(400).json({
      message: "An error occured." + err
    })
    // console.log(err);
  }
}
// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const productExists = await productSchema.exists({ _id: req.params.id })
    await productSchema.findById(req.params.id)
    if (productExists == true) {
      const product = await productSchema.findById({ _id: req.params.id })
      const token = req.headers.authorization.split(" ")[1];
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      const uid = user.id.toString()
      const pid = product.createdBy.toString()
      // console.log(pid)
      // console.log(uid)
      const liveUser = await userSchema.findById(user.id)
      if (liveUser.role != 3 && pid == uid || liveUser.role == 1 || liveUser.canDeleteProduct == true) {
        await categorySchema.findOneAndUpdate({ _id: product.category }, {
          $pull: {
            products: product.id
          }
        })
        await userSchema.findOneAndUpdate({ _id: product.createdBy }, {
          $pull: {
            products: product.id
          }
        })
        await productSchema.findByIdAndRemove(product.id, (err, data) => {
          if (err) return err;
          else if (data == null) return res.status(200).json({ message: "The product does not exists" })
          else return res.status(200).json({
            status: "ok",
            message: "The Product Deleted Successfully.",
            data: data
          })
        })
      }
      else {
        res.status(401).json({
          status: "error",
          message: {
            data: "You can not delete a product that is not made by you"
          }
        })
      }
    }
    else {
      res.status(404).json({
        status: "error",
        message: {
          data: "Product does not exists. Make a product first"
        }
      })
    }
  }
  catch (err) {
    res.status(400).json({
      message: "An error occured." + err
    })
    // console.log(err);
  }
}

// Get all products
exports.getAllproducts = (req, res, next) => {
  productSchema.find((error, response) => {
    if (error) {
      console.log(error)
      return next(error)
    } else {
      res.status(200).send(response)
    }
  })
}
// Get product by id
exports.getOneProduct = async (req, res, next) => {
  productSchema.findById(req.params.id, async (error, data) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await userSchema.findById(user.id)
    if (error) {
      return next(error);
    } else {
      const productExists =
        await findUser.productsviewed.includes(req.params.id)
      // console.log(productExists)
      if (productExists == true) {
        return res.status(200).json({
          data: {
            status: "ok",
            data: [data]
          }
        })
      }
      else {
        await userSchema.findOneAndUpdate({ _id: user.id }, {
          $push:
          {
            productsviewed: data.id
          }
        })

        res.status(200).json({
          data: {
            status: "ok",
            data: [data]
          }
        })
      }
    }
  });
}
// Get product by category
exports.getProductByCategory = async (req, res, next) => {
  try {
    // console.log(req.params.id)
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const liveUser = await userSchema.exists({_id:user.id})
    if(liveUser == true)
    // console.log(user.role)
    {
      await categorySchema
        .findOne({ _id: req.params.id })
        .select('products')
        .populate('products')
        .exec(function (err, product) {
          if (err) return err;
          // console.log(product);
          res.status(200).send(product);
        })
    }
    else{
      res.status(401).json({
        message:"Prohitbited"
      })
    }
  }
  catch (error) {
    // throw error
    res.status(500).json({
      data: {
        status: "error",
        message: error
      }
    })
  }
}
// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt.verify(token, process.env.JWT_SECRET);
    const productExists = await productSchema.exists({ _id: req.params.id })
    const liveUser = await userSchema.findById(user.id);
    const product = await productSchema.findById(req.params.id)
    const pid = product.createdBy.toString()
    const uid = user.id.toString()
    // console.log(pid)
    // console.log(uid)
    // console.log(liveUser.role)
    if (productExists == true) {
      if (liveUser.role != 3 && pid == uid || liveUser.role == 1 || liveUser.canEditProduct == true ) {
        const updates = req.body;
        const options = { new: true };
        const result = await productSchema.findByIdAndUpdate(req.params.id, updates, options)
        res.status(200).json({ status: "ok", message: "The product is updated successfully", data: [result] });
      }
      else {
        res.status(401).json({
          status: "error",
          message: "The product is not created by you or you are not authorized for this action"
        })
      }
    }
    else {
      res.status(404).json({
        status: "error",
        message: "The product does not exists"
      })
    }
  }
  catch (err) {
    res.status(500).json({
      message: "Something went wrong " + err
    })
  }
}

