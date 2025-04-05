import { connect } from "mongoose";
import Config from "././serverConfig.js";

const connectToDB = async () => {
  await connect(Config.DB_URI)
    .then((conn) => {
      console.log(`Connected to ${conn.connection.host}`);
    })
    .catch((e) => {
      console.log(e.message);
    });
};

export default connectToDB;