const Character = require("../models/Character.model");

const router = require("express").Router();

const fileUploader = require('../config/cloudinary.config');


const { isLoggedIn, isLoggedOut } =require("../middlewares/auth.middleware");

const User = require("../models/User.model");


router.get("/", (req, res, next) => {
  res.render("index");
});
   



router.post('/characters/:characterId/delete', (req, res, next) => {
  const { characterId } = req.params;

  Character.findByIdAndDelete(characterId)
  .then(() => res.redirect('/user-profile'))
  .catch(error => next(error));
})



router.get('/characters/:characterId/edit', (req, res, next) => {
  const { characterId } = req.params;

  Character.findById(characterId)
  .then(characterToEdit => {
    res.render('characters/character-edit.hbs', { character: characterToEdit})
  })
  .catch(error => next(error));
});


router.post('/characters/:characterId/edit', (req, res, next) => {
  const { characterId } = req.params;
  const { 
    name, 
    race,
    dndclass,
    imageUrl, 
    description, 
    backstory, 
    // imageUrl
   } = req.body;
    
    Character.findByIdAndUpdate(characterId, { 
      name, 
      race,
      dndclass,
      imageUrl, 
      description, 
      backstory, 
      // imageUrl 
     },
     {new: true})
     .then(updatedCharacter => res.redirect(`/characters/${updatedCharacter.id}`))
})


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
  if(race === 'n-a' || dndclass === 'n-a') {
    res.render('characters/character-creator.hbs',  {
      errorMessage: 'Must select both a race and a class to create character.'
  } )
  } else {

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
  }
})

router.get('/user-profile', isLoggedIn, (req, res, next) => {
  User.findById(req.session.currentUser._id).populate('characters')
  .then(userWithCharacters => {
    console.log(userWithCharacters)
    res.render('user/user-profile.hbs', {user: userWithCharacters })
  }) 
  .catch(err => console.log(err))
})


router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/login');
  });
});



module.exports = router;
