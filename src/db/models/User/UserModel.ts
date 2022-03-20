// tslint:disable-next-line:no-var-requires
const mongoose = require("mongoose");
const Schema: any = mongoose.Schema;

const userSchema: any = new Schema(
  {
    avatar: {
      default: "https://images.unsplash.com/photo-1647375155317-c9e382485c0f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
      type: String,
    },
    username: {
      type: String,
      trim : true,
      require,
      unique : true
    },
    password: {
      require,
      type: String,
      trim : true
    },
    like_count : {
      default: 0,
      type: Number,
    },
    liked_user : [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.index({ username : "text"})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
