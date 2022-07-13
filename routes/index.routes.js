const Character = require("../models/Character.model");

const router = require("express").Router();

const fileUploader = require('../config/cloudinary.config');


const { isLoggedIn, isLoggedOut } =require("../middlewares/auth.middleware");

const User = require("../models/User.model");


router.get("/", (req, res, next) => {
  res.render("index");
});

router.get('/characters/:characterId', (req, res, next) => {

const { characterId } = req.params;

Character.findById(characterId)
  .populate("userId")
  .then(theCharacter => { 
    console.log(theCharacter);
    let isMyCharacter = false;
    if (req.session.currentUser && String(theCharacter.userId._id) === String(req.session.currentUser._id)) {
      isMyCharacter = true
    }
    console.log(isMyCharacter);
    res.render('characters/character-details.hbs', { character: theCharacter, isMyCharacter, user: theCharacter.userId })
  })
  .catch(error => {
    console.log('Error while retrieving book details: ', error);
    next(error);
  });
})

router.get("/characters", (req, res, next) => {
  
  Character.find()
    .populate("userId")
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
    imageUrl: req.file === undefined ? "https://res.cloudinary.com/dlasps7gk/image/upload/v1657730980/project-2-characters/defaultKnight_mvbknb.jpg": req.file.path, 
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
  .then(userWithCharacters => {
    console.log(userWithCharacters)
    res.render('user/user-profile.hbs', {user: userWithCharacters })
  })
  
})




module.exports = router;
