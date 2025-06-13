import mongoose from "mongoose";
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log("Error in Database Connection : ", error);
  }
};

export default dbConnect;
