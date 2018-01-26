// Initialize Firebase
var config = {
  apiKey: "AIzaSyAmBeYiK7NSuZt54YzZf7Hg6r1G4tNCINM",
    authDomain: "traintracker-eddaa.firebaseapp.com",
    databaseURL: "https://traintracker-eddaa.firebaseio.com",
    projectId: "traintracker-eddaa",
    storageBucket: "",
    messagingSenderId: "276486421711"
  };
firebase.initializeApp(config);

var database = firebase.database();

var trainName;
var destination;
var firstTrainTime;
var frequency;
var nextArrival;
var minutesAway;



$(document).on("click", "#submit", function() {

  event.preventDefault();

  trainName = $("#train-name").val().trim();
  $("#train-name").val("");
  destination = $("#destination").val().trim();
  $("#destination").val("");
  firstTrainTime = $("#first-train-time").val().trim();
  $("#first-train-time").val("");
  var frequency = $("#frequency").val().trim();
  $("#frequency").val("");

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
  });
});

database.ref().on("child_added", function(childSnapshot) {

  var firstTimeConverted = moment(childSnapshot.val().firstTrainTime, "HH:mm").subtract(1, "years");
  var now = moment();
  var diffTime = moment().diff(moment(firstTimeConverted, "minutes"));
  var frequencyInt = parseInt(childSnapshot.val().frequency);
  var remainder = diffTime % frequencyInt;
  minutesAway = frequencyInt - remainder;
  nextArrival = moment().add(minutesAway, "minutes");
  // console.log("NEXT TRAIN ARRIVES AT: " + moment(nextArrival).format("hh:mm"));

  var tr = $("<tr>");
  var tdTrainName = $("<td>").text(childSnapshot.val().trainName);
  var tdDestination = $("<td>").text(childSnapshot.val().destination);
  var tdFrequency = $("<td>").text(childSnapshot.val().frequency + " min");
  var tdNextArrival = $("<td>").text(moment(nextArrival).format("hh:mm"));
  var tdMinutesAway = $("<td>").text(minutesAway + " min");
  tr.append(tdTrainName);
  tr.append(tdDestination);
  tr.append(tdFrequency);
  tr.append(tdNextArrival);
  tr.append(tdMinutesAway);
  $("#tbody").append(tr);
});


