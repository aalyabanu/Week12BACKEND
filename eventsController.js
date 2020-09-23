const createError = require("http-errors");
const { ObjectId } = require("mongodb");
const { Event } = require("./models/events");
var MongoClient = require("mongodb").MongoClient;

const dbPromise = MongoClient.connect(
  "mongodb://localhost:27017/events"
).then((client) => client.db("events"));
const listPromise = dbPromise.then((db) => db.collection("list"));

exports.index = function (req, res) {
  Event.find().then((events) => res.send(events));
};

exports.create = function (req, res, next) {
  if (!req.body.name) {
    return next(createError(400, "name is required"));
  }
  const event = new Event({ name: req.body.name });
  event.save().then(() => res.send({ result: true }));
};

exports.show = function (req, res, next) {
  Event.findOne({ _id: ObjectId(req.params.id) }).then((eventitem) => {
    console.log(eventitem);
    if (!eventitem) {
      return next(createError(404, "no event with that id"));
    }
    res.send(eventitem);
  });
};

exports.delete = function (req, res, next) {
  Event.deleteOne({ _id: ObjectId(req.params.id) }).then((r) => {
    if (r.deletedCount) {
      return res.send({ result: true });
    }
    return next(createError(404, "no event with that id"));
  });
};

exports.update = async function (req, res, next) {
  if (!req.body.name) {
    return next(createError(400, "name is required!"));
  }
  Event.findOne({ _id: ObjectId(req.params.id) }).then((result) => {
    if (!result) {
      return next(createError(404, "no event with that id"));
    }
    result.name = req.body.name;
    result.completed = req.body.completed;
    result.save().then(() => res.send({ result: true }));
  });
};
