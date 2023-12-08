const mongoose = require('mongoose');
 
const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  images: [String],
  phone: {
    type: Number,
    required: [true, 'Phone number is required']
  },
  model: {
    type: String,
    required: [true, 'Model is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  // description: {
  //   type: String,
  //   default: "",
  // }
});

saleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'id name'
  });
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
