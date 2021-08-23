const router = require('express').Router()
const List = require('../models/List');
const verify = require('../verifyToken');

// Create
router.post("/", verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body);

        try {
            const savedList = await newList.save()
            res.status(201).json(savedList)
        } catch (error) {
            res.status(500).json("error")
        }
    } else {
        res.status(403).json("You are not allowed to add movies!")
    }
})

// Delete
router.delete("/:id", verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id)
            res.status(200).json("The list has been deleted!")
        } catch (error) {
            res.status(500).json("error")
        }
    } else {
        res.status(403).json("You are not allowed to delete movies!")
    }
})

// Get
router.get("/", verify, async (req, res) => {
    const typeQuery = req.query.type
    const genreQuery = req.query.genre
    let list = []

    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])
            }
            else {
                list = await List.aggregate([
                    { $sample: { size: 10 } },
                    { $match: { type: typeQuery } }
                ])
            }
        }
        else {
            list = await List.aggregate([{ $sample: { size: 10 } }])
        }
        res.status(200).json(list)
    } catch (error) {
        res.status(500).json("error")
    }
})

// Update
// router.put("/:id", verify, async (req, res) => {
//     if (req.user.isAdmin) {
//         try {
//             const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body, }, { new: true })
//             res.status(200).json(updatedMovie)
//         } catch (error) {
//             res.status(500).json("error")
//         }
//     } else {
//         res.status(403).json("You are not allowed to add movies!")
//     }
// })

// Get Random Movie
// router.get("/random", verify, async (req, res) => {
//     const type = req.query.type
//     let movie
//     try {
//         if (type === "series") {
//             movie = await Movie.aggregate([
//                 { $match: { isSeries: true } },
//                 { $sample: { size: 1 } }
//             ])
//         }
//         else {
//             movie = await Movie.aggregate([
//                 { $match: { isSeries: false } },
//                 { $sample: { size: 1 } }
//             ])
//         }
//         res.status(200).json(movie)
//     } catch (error) {
//         res.status(500).json("error")
//     }
// })

// Get All
// router.get("/", verify, async (req, res) => {
//     if (req.user.isAdmin) {
//         try {
//             const movies = await Movie.find()
//             res.status(200).json(movies.reverse())
//         } catch (error) {
//             res.status(500).json("error")
//         }
//     } else {
//         res.status(403).json("You are not Admin!")
//     }
// })

module.exports = router