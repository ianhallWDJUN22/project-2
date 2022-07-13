const { Schema, model, default: mongoose } = require("mongoose");

const characterSchema = new Schema({

    name: {
        type: String,
        trim: true,
        default: "New Character"
    },
    race: {
        type: String,
        require: [true, 'You must select a race'],
        enum: [
            'Dwarf', 
            'Elf', 
            'Halfling', 
            'Human', 
            'Dragonborn', 
            'Gnome', 
            'Half-Elf', 
            'Half-Orc',
            'Tiefling'
        ]
    },
    dndclass: {
        type: String,
        require: [true, 'You must select a class'],
        enum: [
            'Barbarian',
            'Bard',
            'Cleric',
            'Druid',
            'Fighter',
            'Monk',
            'Paladin',
            'Ranger',
            'Rogue',
            'Sorcerer',
            'Warlock',
            'Wizard'
        ]
    },
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    backstory: {
        type: String,
        require: false,
        default: "no backstory added",
    },

    imageUrl: {
        type: String,
    },

    description: {
        type: String,
        default: "no description added"
    }

    
    
    
    
    
})









    const Character = model("Character", characterSchema);

module.exports = Character;