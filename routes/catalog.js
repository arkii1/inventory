const express = require("express")

const router = express.Router()

/* GET catalog page */
router.get("/", (req, res, next) => {
  res.redirect("/catalog")
})

module.exports = router
