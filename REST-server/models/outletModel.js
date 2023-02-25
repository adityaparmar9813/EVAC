const mongoose = require('mongoose');
const User = require('./userModel');

const outletSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please provide your phone number'],
    unique: true,
    // PHONE NUMBER MUST ALSO BE UNIQUE
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
  openingHours: {
    weekdays: {
      open: {
        type: String,
        required: true,
      },
      close: {
        type: String,
        required: true,
      },
    },
    weekends: {
      open: {
        type: String,
        required: true,
      },
      close: {
        type: String,
        required: true,
      },
    },
  },
  adminPassword: {
    type: String,
    required: true,
  },
  adminList: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  peoplePresent: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  },
  headCount: {
    type: Number,
    default: 0,
  },
});

outletSchema.pre('save', function (next) {
  const currentHeadCount = this.peoplePresent.length;
  if (this.isNew || this.isModified('peoplePresent')) {
    // If the document is new or the peoplePresent field has been modified,
    // update the headCount field with the current number of people present
    this.headCount = currentHeadCount;
    next();
  } else {
    // Otherwise, skip updating the headCount field
    next();
  }
});

// CREATING AN OBJECT USER BASED ON THE OUTLET SCHEMA
const Outlet = mongoose.model('Outlet', outletSchema);

// EXPORTING THE OUTLET OBJECT
module.exports = Outlet;
