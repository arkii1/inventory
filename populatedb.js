#! /usr/bin/env node
/* eslint-disable func-names */
/* eslint-disable no-console */

// Get arguments passed on command line
const userArgs = process.argv.slice(2)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require("async")
const mongoose = require("mongoose")
const Item = require("./models/item")
const Category = require("./models/category")

const mongoDB = userArgs[0]
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

const items = []
const categories = []

function categoryCreate(name, description, cb) {
  const category = new Category({ name, description })

  category.save((err) => {
    if (err) {
      cb(err, null)
      return
    }
    console.log(`New Item: ${category}`)
    categories.push(category)
    cb(null, category)
  })
}

function itemCreate(title, description, price, inStock, category, cb) {
  const itemDetails = {
    title,
    description,
    price,
    inStock,
  }

  if (category !== false) itemDetails.category = category

  const item = new Item(itemDetails)
  item.save((err) => {
    if (err) {
      cb(err, null)
      return
    }
    console.log(`New Item: ${item}`)
    items.push(item)
    cb(null, item)
  })
}

function createCategories(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate(
          "CPU",
          "A Central Processing Unit (CPU) is the brain of the computer. This is what runs all your programs, calculations, and operations.",
          callback
        )
      },
      function (callback) {
        categoryCreate(
          "Motherboard",
          "The motherboard electronically connects all of your PC’s parts. It also takes power from the PSU and provides it to many of your other components.",
          callback
        )
      },
      function (callback) {
        categoryCreate(
          "Graphics cards",
          "The graphics card is a piece of hardware containing the Graphics Processing Unit (GPU), the memeory, cooling, and controlloing hardware for that GPU. The GPU builds images, and then the graphics card sends these images to your screen to display.",
          callback
        )
      },
    ],
    // optional callback
    cb
  )
}

function createItems(cb) {
  async.parallel(
    [
      function (callback) {
        itemCreate(
          "GTX 1080",
          "Breakthrough performance, power efficiency, and thermal technology made this a go-to graphics card for serious gamers.",
          349,
          12,
          categories[2],
          callback
        )
      },
      function (callback) {
        itemCreate(
          "Intel(R) Core(TM) i5-8600K",
          "An 8th Generation Intel Core i5 Projcessor, released late 2017 running with 6 cores @ 3.6Ghz",
          332,
          8,
          categories[0],
          callback
        )
      },
      function (callback) {
        itemCreate(
          "ASUS X570 Crosshair VIII Hero",
          "An AMD motherboard, containing an AMD AM4 socket, an M.2 aluminium heatsink, and on-board 2.5 GBps Ethernet and Gigabit Ethernet",
          288,
          13,
          categories[1],
          callback
        )
      },
    ],
    // optional callback
    cb
  )
}

async.series(
  [createCategories, createItems],
  // Optional callback
  (err, results) => {
    if (err) {
      console.log(`FINAL ERR: ${err}`)
    }
    // All done, disconnect from database
    mongoose.connection.close()
  }
)
