/* eslint-disable no-unused-vars */
const async = require("async")
const { body, validationResult } = require("express-validator")
const { ObjectId } = require("mongodb")
const mongoose = require("mongoose")
const Category = require("../models/category")
const Item = require("../models/item")

exports.index = async function (req, res, next) {
  async.parallel(
    {
      categories(callback) {
        Category.find().populate("item").exec(callback)
      },
    },
    (err, results) => {
      if (err) return next(err)
      const total = results.categories.reduce(
        (previousValue, category) =>
          category.item ? previousValue + category.item.price : previousValue,
        0
      )
      res.render("index", {
        title: "Basket",
        categories: results.categories,
        totalCost: total,
      })
    }
  )
}

// Display list of all items
exports.all_items_get = function (req, res, next) {
  async.parallel(
    {
      items(callback) {
        Item.find().populate("category").exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        next(err)
      }

      if (results === null) {
        const error = new Error("No Items found")
        error.status = 404
        next(error)
      }

      res.render("items_all", {
        title: "All Items",
        items: results.items,
      })
    }
  )
}

// Buy an item
exports.all_items_post = function (req, res, next) {
  Category.findByIdAndUpdate(
    req.body.category_id,
    {
      item: req.body.item_id,
    },
    (err) => {
      if (err) return next(err)

      res.redirect("/")
    }
  )
}

// Display item detail page
exports.item_detail = function (req, res, next) {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      if (results.item === null) {
        const error = new Error("Item not found!")
        error.status = 404
        return next(error)
      }
      res.render("item_detail", {
        item: results.item,
      })
    }
  )
  // good oppurtunity to test step through
}

// Display item create form get
exports.item_create_get = function (req, res, next) {
  // get categories
  async.parallel(
    {
      categories(callback) {
        Category.find(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }
      res.render("item_form", {
        title: "Create Item",
        categories: results.categories,
      })
    }
  )
}

// Handle item create form post
exports.item_create_post = [
  body("title")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Title must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Title has non-alphanumeric characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Description has non-alphanumeric characters."),
  body("price")
    .trim()
    .isFloat({ min: 0.01 })
    .withMessage("Price must be greater than 0.01."),
  body("in-stock").trim(),
  body("category")
    .isLength({ min: 1 })
    .escape()
    .withMessage("Category must be specified."),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      async.parallel(
        {
          categories(callback) {
            Category.find(callback)
          },
        },
        (err, results) => {
          if (err) {
            return next(err)
          }
          res.render("item_form", {
            title: "Create Item",
            item: req.body,
            categories: results.categories,
            errors: errors.array(),
          })
        }
      )
    } else {
      const item = new Item({
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock,
        category: req.body.category,
      })
      item.save((err) => {
        if (err) {
          return next(err)
        }

        res.redirect(item.url)
      })
    }
  },
]

// Display item delete form get
exports.item_delete_get = function (req, res, next) {
  Item.findById(req.params.id, (err, results) => {
    if (err) {
      return next(err)
    }

    if (results.item === null) {
      const error = new Error("No item found")
      error.status = 404
      return next(error)
    }

    res.render("item_delete", {
      title: `Delete ${results.title}`,
      item: results,
    })
  })
}

// Handle item delete form post
exports.item_delete_post = function (req, res, next) {
  Item.findByIdAndRemove(req.params.id, (err) => {
    if (err) return next(err)

    res.redirect("/")
  })
}

// Display item update form get
exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item(callback) {
        Item.findById(req.params.id).populate("category").exec(callback)
      },
      categories(callback) {
        Category.find({}).exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.item === undefined) {
        const error = new Error("Item not found")
        error.status = 404
        return next(error)
      }

      res.render("item_form", {
        title: `Update ${results.item.title}`,
        item: results.item,
        categories: results.categories,
      })
    }
  )
}

// Handle item update form post
exports.item_update_post = function (req, res, next) {
  Item.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      inStock: req.body.inStock,
      category: req.body.category,
    },
    (err) => {
      if (err) return next(err)
    }
  )
  res.redirect("/")
}
