const Character = require("../models/Character.model");

const router = require("express").Router();

const fileUploader = require('../config/cloudinary.config');


const { isLoggedIn, isLoggedOut } =require("../middlewares/auth.middleware");
const User = require("../models/User.model");
/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/characters", (req, res, next) => {
  
  Character.find()
    .then(allCharactersArray => {
      res.render('characters/all-characters.hbs', {characters: allCharactersArray})
    })
    .catch(err => console.log(err))
  
})

router.get("/create", isLoggedIn, (req, res, next) => {
  res.render("characters/character-creator")
})

router.post("/create", isLoggedIn, fileUploader.single('imageFile'), (req, res, next) => {
  const { name, race, dndclass,} = req.body
  console.log(req.session.currentUser)
  const { _id } = req.session.currentUser
  console.log(req.body)
  Character.create({
    name,
    race,
    dndclass,
    imageUrl: req.file === undefined ? "https://wallpapercrafter.com/th800/128452-portrait-display-original-characters-knight-armor-fantasy-art.jpg": req.file.path, 
    userId : _id

}) .then((response) => {
  console.log(response)
  User.findByIdAndUpdate(req.session.currentUser._id, { $push: {characters: response._id}},
    {new: true
    })
  .then((characterUpdate) => {
    console.log(characterUpdate, "This one");
    res.redirect('/user-profile')
  }) 
  .catch(err => console.log(err))
})
})

router.get('/user-profile', (req, res, next) => {
  User.findById(req.session.currentUser._id).populate('characters')
  .then(userCharacters => console.log(userCharacters))
  res.render('user/user-profile.hbs', {character: userCharacters })
})


module.exports = router;
