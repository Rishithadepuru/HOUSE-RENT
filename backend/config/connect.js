const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/househunt');
    console.log(`\x1b[32m[MongoDB Connected]: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m[MongoDB Connection Error]: ${error.message}\x1b[0m`);
    console.log('\n\x1b[33m💡 Quick tip: Make sure MongoDB is running on your machine, or check your MONGO_URI in backend/.env.\x1b[0m\n');
  }
};

module.exports = connectDB;
