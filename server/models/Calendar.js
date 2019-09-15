const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CalendarSchema = new Schema({
  users: {
    type: Array,
    required: true
  },
  createDay: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  schedule: {
    type: String,
    required: true
  }
})

module.exports = User = mongoose.model('Calendar', CalendarSchema)
