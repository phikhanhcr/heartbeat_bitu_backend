// tslint:disable-next-line:no-var-requires
import mongoose from "mongoose";

class Connection {
  public connect = () => {
    mongoose
      .connect(
        process.env.DB_CONNECTION
        ,
        (error) => {
          if (error) {
            console.log("Error " + error);
          } else {
            console.log("Connected successfully to server");
          }
        },
      );
  }
}

const ConnectionPresenter = new Connection();
export default ConnectionPresenter;
