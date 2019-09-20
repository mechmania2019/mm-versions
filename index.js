const mongoose = require("mongoose");
const authenticate = require("mm-authenticate")(mongoose);
const { Script } = require("mm-schemas")(mongoose);

const send = (res, status, data) => ((res.statusCode = status), res.end(data));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.Promise = global.Promise;

module.exports = authenticate(async (req, res) => {
  const team = req.user;
  console.log(`${team.name} - Getting script versions`);
  const scripts = await Script.find({ owner: team._id })
    .sort("-_id")
    .exec();
  send(
    res,
    200,
    JSON.stringify(
      scripts.map(script => {
        const ret = script.toObject();
        console.log(
          script._id,
          team.latestScript,
          script._id.equals(team.latestScript)
        );
        console.log(
          script._id,
          team.mostRecentPush,
          script._id.equals(team.isMostRecentPush)
        );
        if (script._id.equals(team.latestScript)) {
          ret.isLatestScript = true;
        }
        if (script._id.equals(team.mostRecentPush)) {
          ret.isMostRecentPush = true;
        }
        return ret;
      })
    )
  );
});
