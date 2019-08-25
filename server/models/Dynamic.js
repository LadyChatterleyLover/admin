const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DynamicSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  dynamic: {
    type: String,
    required: true
  },
  classification: {
    type: String,
    required: true
  },
  reportUsers: {
    type: Array
  }
})

module.exports = User = mongoose.model('Dynamic', DynamicSchema)
