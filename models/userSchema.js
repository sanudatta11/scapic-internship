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
        imageBase64: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {

        timestamps: true
    });

module.exports = mongoose.model('User', userSchema);

