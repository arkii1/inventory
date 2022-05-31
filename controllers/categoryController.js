/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const Category = require("../models/category")

// Display list of all items
exports.category_item_list = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Item List")
}

// Display item create form get
exports.category_create_get = function (req, res, next) {
  res.render("category_form", { title: "Create  Category" })
}

// Handle item create form post
exports.category_create_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Create POST")
}

// Display item delete form get
exports.category_delete_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Delete GET")
}

// Handle item delete form post
exports.category_delete_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Delete POST")
}

// Display item update form get
exports.category_update_get = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Update GET")
}

// Handle item update form post
exports.category_update_post = function (req, res, next) {
  res.send("NOT IMPLEMENTED: Category Update POST")
}
