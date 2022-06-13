/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-arrow-callback */
const { body, validationResult } = require("express-validator")
const async = require("async")
const { ObjectId } = require("mongodb")
const { redirect } = require("express/lib/response")
const Category = require("../models/category")
const Item = require("../models/item")

exports.category_list = function (req, res, next) {
  async.parallel(
    {
      categories(callback) {
        Category.find().exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.categories === null) {
        const error = new Error("No categories found")
        error.status = 404
        return next(error)
      }

      res.render("category_list", {
        title: "Category list",
        categories: results.categories,
      })
    }
  )
}

// Display list of all items
exports.category_item_list = function (req, res, next) {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback)
      },
      items(callback) {
        Item.find({ category: req.params.id })
          .populate("category")
          .exec(callback)
      },
    },
    function (err, results) {
      if (err) {
        next(err)
      }
      if (results.items === null) {
        const error = new Error("No Items found")
        error.status = 404
        return next(error)
      }
      if (results.category === null) {
        const error = new Error("No Category found")
        error.status = 404
        return next(error)
      }
      res.render("category_item_list", {
        category: results.category,
        items: results.items,
      })
    }
  )
}

// Display item create form get
exports.category_create_get = function (req, res, next) {
  res.render("category_form", { title: "Create  Category" })
}

// Handle item create form post
exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("First name has non-alphanumeric characters."),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified.")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Description has non-alphanumeric characters."),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create  Category",
        category: req.body,
        errors: errors.array(),
      })
    } else {
      const category = new Category({
        name: req.body.name,
        description: req.body.description,
      })
      // eslint-disable-next-line consistent-return
      category.save(function (err) {
        if (err) {
          return next(err)
        }

        res.redirect(category.url)
      })
    }
  },
]

// Display item delete form get
exports.category_delete_get = function (req, res, next) {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback)
      },
    },
    (err, results) => {
      if (err) {
        return next(err)
      }

      if (results.category === null) {
        const error = new Error("Category is null")
        error.status = 404
        return next(error)
      }

      res.render("category_delete", {
        title: `Delete Category: ${results.category.name}`,
        category: results.category,
      })
    }
  )
}

// Handle item delete form post
exports.category_delete_post = function (req, res, next) {
  async.series(
    {
      deleteCategories(callback) {
        Category.findByIdAndDelete(req.params.id).exec(callback)
      },
      deleteItem(callback) {
        Item.deleteMany({ category: ObjectId(req.params.id) }).exec(callback)
      },
    },
    (err) => {
      if (err) return next(err)

      res.redirect("/")
    }
  )
}

// Display item update form get
exports.category_update_get = function (req, res, next) {
  Category.findById(req.params.id, function (err, results) {
    if (err) {
      return next(err)
    }

    if (results === undefined) {
      const error = new Error("Category not found")
      error.status = 404
      return next(error)
    }

    res.render("category_form", {
      title: "Update Category",
      category: results,
    })
  })
}

// Handle item update form post
exports.category_update_post = function (req, res, next) {
  Category.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
    },
    function (err) {
      if (err) console.log(err)
    }
  )
  res.redirect("/")
}
