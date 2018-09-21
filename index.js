const mongoose = require("mongoose");
const authenticate = require("mm-authenticate")(mongoose);
const { send } = require("micro");
const { Script } = require("mm-schemas")(mongoose);

mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

module.exports = async (req, res) => {
  const team = req.user;
  console.log(`${team.name} - Getting script versions`);
  const scripts = await Script.find({ owner: team._id }).exec();
  return scripts;
};
