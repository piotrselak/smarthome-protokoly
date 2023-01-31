const mongoose = require("mongoose");

const { MONGO_URI } = process.env;
// const MONGO_URI = "mongodb://localhost:27017"

exports.connect = () => {
    mongoose
        .connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log("Successfully connected to database");
        })
        .catch((error) => {
            console.log(MONGO_URI)
            console.log("database connection failed. exiting now...");
            console.error(error);
            process.exit(1);
        });
};