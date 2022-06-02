/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const mongoose = require("mongoose")

const { Schema } = mongoose

const ItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
})

ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Item", ItemSchema)
