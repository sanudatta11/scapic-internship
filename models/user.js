/**
 * Created by sanu on 16/3/18.
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
        name: {
            firstName: {
                type: String,
                required: true
            },
            middleName: {
                type: String
            },
            lastName: {
                type: String
            }
        },
        email: {
            type: String,
            match: /\S+@\S+\.\S+/,
            required: true
        },
        imageUrl: {
            type: String
        },
        password: {
            type: String
        },
        resetPasswordToken: {
            type: Number
        },
        resetPasswordExpires: {
            type: Date
        }
    },
    {

        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);

