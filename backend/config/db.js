const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ Falling back to MongoDB Memory Server...');
      try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB Connected (Memory Server): ${mongoUri}`);
      } catch (innerError) {
        console.error(`❌ Fatal Error starting Memory Server: ${innerError.message}`);
        process.exit(1);
      }
    } else {
      console.error('❌ Production database connection failed. Please check your MONGO_URI and IP Whitelist.');
      process.exit(1);
    }
  }
};

module.exports = connectDB;
