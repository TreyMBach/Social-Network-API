const { Schema, model } = require('mongoose');


// Schema to create User model
const userSchema = new Schema(
  {
    userName: {
      type: String,
      Unique: true,
      Required: true,
      Trimmed: true
    },
    email: {
      type: String,
      Required: true,
      Unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
    ],
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false,
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User= model('user', userSchema);

module.exports = User;
