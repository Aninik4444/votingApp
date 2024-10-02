const mongoose = require('mongoose');
const {type} = require('os');
// const bcryptjs = require('bcrypt');

// Defining the person schema
const candidateSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   party:{
    type: String,
    required: true
   },
   age:{
    type: Number,
    required: true
   },
   votes:[
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        votedAt:{
            type:Date,
            default: Date.now()
        }
    }
   ],
   voteCount:{
    type:Number,
    default: 0
   }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;