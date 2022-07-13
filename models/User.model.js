const { Schema, model } = require("mongoose");

const userSchema = new Schema({

    email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true
    },
    username: {
      type: String,
      trim: true,
      required: [true, `Username is required.`],
      unique: true 
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    characters: [{
      type: Schema.Types.ObjectId,
      ref: 'Character'
    }]

  },
  
{
    timestamps: true,
  }

);

const User = model("User", userSchema);

module.exports = User;
