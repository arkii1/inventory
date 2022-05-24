/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require("mongoose")

const { Schema } = mongoose

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
})

CategorySchema.virtual("url").get(function () {
  return `/catalog/category/${this._id}`
})
