import mongoose from "mongoose";

const connect = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) console.log(err);
      else console.log("Connected with mongodb");
    }
  );
};
export default connect;
