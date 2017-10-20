// Dependencies
var five = require("johnny-five");
var mongoose = require("mongoose");
var moment = require("moment"); // used for accurate local time
mongoose.Promise = global.Promise;

// Variables required for detecting whether someone
// is leaving or entering.
var a = 0,
    b = 0,
    entering = 0,
    leaving = 0,
    total = 0;

// Database URL
var dbURL = 'mongodb://matt:green234@ds125365.mlab.com:25365/people-counter';

// Connect to database using mongo client.
mongoose.connect(dbURL, {
    useMongoClient: true
});

// Establish database connection, throw error if connection failed.
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error:'));

// Create new board instance
var board = new five.Board({port: "COM3"});

// Function to reset the variables used for detectTotal()
// and enteringLeaving();
function reset() {
    //RESET EVERYTHING
    console.log("RESETTING")
    entering = 0;
    leaving = 0;
    a = 0;
    b = 0;
}


// Open database
db.once('open', function () {
    //Create Database Schema
    var irSchema = mongoose.Schema({
        totalInRoom: String,
        maxCapacity: String,
        date: String,
    });
    
    // Database Model
    var totalModel = mongoose.model('RoomTotal', irSchema);

    board.on("ready", function () {
        //Create hardware instances
        var sensor1 = new five.Motion(7);
        var sensor2 = new five.Motion(8);

        // Calibration of each sensor occurs at the beggining of session.
        sensor1.on("calibrated", function () {
            // log calibration and timestamp
            console.log("[Sensor 1] Calibrated | " + moment().format('h:mm:ss a'));
        });
        sensor2.on("calibrated", function () {
            // log calibration and timestamp
            console.log("[Sensor 2] Calibrated | " + moment().format('h:mm:ss a'));
        });

        // "motionstart" events are fired when the "calibrated"
        // proximal area is disrupted, generally by some form of movement
        sensor1.on("motionstart", function () {
            console.log("[Sensor 1] Motion Start | " + moment().format('h:mm:ss a'));
            a = 1; // used to detect if someone is entering or leaving

            // Detect if someone is leaving or entering
            if (a > b) {
                entering = 1;
                console.log("Entering");
            } else if (b > a) {
                leaving = 1;
                console.log("Leaving");
            }
            
            // Calculate Total in Room
            // Only upload data if both sensors are activated
            if ((a + b) == 2) {
                if (entering == 1) {
                    total = total + 1;
                    console.log("Total In Room: " + total);
                    // Upload the new total to the database
                    var total_rec = new totalModel({
                        totalInRoom: total,
                        maxCapacity: 10,
                        date: moment().format('LLLL')
                    });

                    total_rec.save(function (err, total_rec) {
                        if (err) return console.error(err);
                    });
                    console.log('SENT TO DATABASE');
                } else if (leaving == 1) {
                    total = total - 1;
                    console.log("Total In Room: " + total);
                    // Upload the new total to the databse
                    var total_rec = new totalModel({
                        totalInRoom: total,
                        maxCapacity: 10,
                        date: moment().format('LLLL')
                    });

                    total_rec.save(function (err, total_rec) {
                        if (err) return console.error(err);
                    });
                    console.log('SENT TO DATABASE');
                }
            }
        });

        sensor2.on("motionstart", function () {
            console.log("[Sensor 2] Motion Start | " + moment().format('h:mm:ss a'));
            b = 1; // used to detect if someone is entering or leaving
            
            // Work out if someone is entering or leaving the room
            if (a > b) {
                entering = 1;
                console.log("Entering");
            } else if (b > a) {
                leaving = 1;
                console.log("Leaving");
            }
            
            // Calculate Total In Room
            // Only upload data when both sensors are activated.
            if ((a + b) == 2) {
                if (entering == 1) {
                    total = total + 1;
                    console.log("Total In Room: " + total);
                    // Upload the new total to the database
                    var total_rec = new totalModel({
                        totalInRoom: total,
                        maxCapacity: 10,
                        date: moment().format('LLLL')
                    });

                    total_rec.save(function (err, total_rec) {
                        if (err) return console.error(err);
                    });
                    console.log('SENT TO DATABASE');
                } else if (leaving == 1) {
                    total = total - 1;
                    console.log("Total In Room: " + total);
                    // Upload the new total to the databse
                    var total_rec = new totalModel({
                        totalInRoom: total,
                        maxCapacity: 10,
                        date: moment().format('LLLL')
                    });

                    total_rec.save(function (err, total_rec) {
                        if (err) return console.error(err);
                    });
                    console.log('SENT TO DATABASE');
                }
            }
        });

        // "motionend" events are fired following a "motionstart" event
        // when no movement has occurred in X ms
        sensor1.on("motionend", function () {
            console.log("[Sensor 1] Motion End");
            reset();
        });
        sensor2.on("motionend", function () {
            console.log("[Sensor 2] Motion End");
            reset();
        });
    });
});