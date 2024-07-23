const express = require("express");
const router = express.Router();

// Index-user
router.get("/", (req, res) => {
    res.send("GET for user id");
});

// show user
router.get("/:id", (req, res) => {
    res.send("GET for more user")
})

// POST user
router.post("/", (req, res) => {
    res.send("POST for user")
})


// delete user
router.delete("/:id", (req, res) => {
    res.send("DELETE for user")
})

module.exports = router;