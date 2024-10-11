import mongoose from "mongoose";

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("DB CONNECTED", conn.connection.host);
  } catch (err) {
    console.log("DB ERROR ", err);
    process.exit(1);
  }
};

export default connect;
