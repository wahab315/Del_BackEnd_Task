const mongoose = require('mongoose');
require('dotenv').config();

const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  // useUnifiedTopology: true,
  // useNewUrlParser: true,
  // serverSelectionTimeoutMS:5000
}).then(() => {
    console.log('Database connected');
    const port = process.env.PORT || 3000;
    // Start the server  
    const server = app.listen(port, () => {
      console.log(`Server running on port ${port}...`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
