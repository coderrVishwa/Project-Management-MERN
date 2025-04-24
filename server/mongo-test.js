const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/')
  .then(() => {
    console.log('✅ Connection success');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('❌ Connection failed:', err.message);
  });
