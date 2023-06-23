const { uuid } = require("uuidv4")

var express = require("express")
var router = express.Router()

var {
  body,
  _,
  check,
  validationResult,
  matchedData,
} = require("express-validator")

var l = []
var limit = 0
const categories = [
  "food",
  "transport",
  "government",
  "electronics",
  "restaurants",
  "online_marketplace",
  "property",
]

router.get("/", function (req, res) {
  res.json(l)
})

router.post(
  "/new",
  [
    body("title").isString().trim().notEmpty().escape(),
    body("amount").isInt({ min: 0 }).toInt(),
    body("category").isString().trim().notEmpty().isIn(categories),
    body("date").isDate("yyyy-MM-dd").toDate(),
  ],
  function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const data = matchedData(req)
      l.push({
        id: uuid(),
        ...data,
      })
      res.sendStatus(200)
    }
  }
)

router.post(
  "/search",
  body("date").isDate("yyyy-MM-dd").toDate(),
  function (req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const data = matchedData(req)
      res.json(
        l.filter(function (item) {
          return item.date.getTime() === data.date.getTime()
        })
      )
    }
  }
)

router.get("/limit", function (req, res) {
  res.json({ limit: limit })
})

router.post(
  "/limit/set",
  body("limit").isInt({ min: 0 }).toInt(),
  function (req, res) { 
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    } else {
      const data = matchedData(req)
      limit = data.limit
      res.sendStatus(200)
    }
  }
)

module.exports = router
