const Users = require("../models/User");
const Recipe = require("../models/Recipe");
const Ingredient = require("../models/Ingredient");
var express = require("express");
var cors = require('cors')
var router = express.Router();

router.post("/getAllRecipe", async (req, res) => {
    try {
        const recipe = await Recipe.findAll({ isbn: req.body.isbn })
        if (!recipe) return res.json({ msg: "NOT FOUND" })
        res.json({ msg: "RECIPES FOUND", data: recipe })
    } catch (error) {
        console.error(error)
    }
});

router.post("/getRecipeWithIngredient", async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ name: req.body.name }).populate("Ingredient")
        if (!recipe) return res.json({ msg: "RECIPE NOT FOUND" })
        res.json({ msg: "RECIPE FOUND", data: recipe })
    } catch (error) {
        console.error(error)
    }
});

/******* below are all the routes that WILL NOT pass through the middleware ********/

router.use((req, res, next) => {
    if (!req.user.admin) return res.json({ msg: "NOT ADMIN" })
    else next()
})

/******* below are all the routes that WILL pass through the middleware ********/

router.post("/addRecipe", async (req, res) => {
    try {
        await Recipe.create({ ...req.body})
        res.json({ msg: "RECIPE ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/addIngredient", async (req, res) => {
    try {
        await Ingredient.create({ ...req.body})
        res.json({ msg: "INGREDIENT ADDED" })
    } catch (error) {
        console.error(error)
    }
});

router.post("/addIngredientToRecipe", async (req, res) => {
    try {
        await Recipe.add({ ...req.body})
        res.json({ msg: "INGREDIENT ADDED" })
    } catch (error) {
        console.error(error)
    }
});

// router.post("/deleteByIsbn", async (req, res) => {
//     try {
//         const book = await Books.findOne({ isbn: req.body.isbn })
//         if (!book) return res.json({ msg: "BOOK NOT FOUND" })
//         await Books.deleteOne({ isbn: req.body.isbn })
//         res.json({ msg: "BOOK DELETED" })
//     } catch (error) {
//         console.error(error)
//     }
// });

module.exports = router
