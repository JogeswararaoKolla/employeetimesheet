// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAqQmRiWzcO2f_3AKXt_KnWoYzwBDFQL34",
  authDomain: "fir-project-c0c9a.firebaseapp.com",
  databaseURL: "https://fir-project-c0c9a.firebaseio.com",
  projectId: "fir-project-c0c9a",
  storageBucket: "fir-project-c0c9a.appspot.com",
  messagingSenderId: "820221888907",
  appId: "1:820221888907:web:f65d064af38a5c48"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let refData = firebase.database();

let employeeObj = {};
let countFunctionCall = 1;


refData.ref("/employees").on('value', function (snapshot) {

  console.log("snapshot value method: " + countFunctionCall);

  if (snapshot.val()) {
    console.log(snapshot.val());
    const snapObj=snapshot.val();
    console.log(snapObj);
    for(let key in snapObj){
      console.log(key);
      console.log(snapObj[key]);
    }

    for (let [key, value] of Object.entries(snapObj)) {
      console.log(key);
      console.log(value);
      console.log(key +' : ' + JSON.stringify(value));
    }

    snapshot.forEach(function(childSnapshot) {
      countFunctionCall++;
      console.log("Inside snapshot " + countFunctionCall);
      var childKey = childSnapshot.key;
      var childData = childSnapshot.val();
      console.log(childKey);
      console.log(childData);
    });

  }

});

refData.ref("/employee").on('child_removed',function(childSnapshot){
  console.log(childSnapshot);
  console.log(childSnapshot.key);
  console.log(childSnapshot.val());
});

refData.ref("/employees").on('child_added', function (childObj, prevChildKeyObj) {

  employeeObj = childObj.val();

  console.log("employeeObj: " + JSON.stringify(employeeObj) + " prevChildKeyObj: "+ prevChildKeyObj);

  // Prettify the employee start
  let empStartPretty = moment.unix(employeeObj.StartDate).format("MM/DD/YYYY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  let empMonths = moment().diff(empStartPretty, "years");

  // Calculate the total billed rate
  let empBilled = empMonths * employeeObj.Rate;

  // Create the new row
  let newRow = $("<tr>").attr({ 'id': childObj.key }).append(
    $("<td>").text(employeeObj.EmployeeName),
    $("<td>").text(employeeObj.Role),
    $("<td>").text(empStartPretty),
    $("<td>").text(empMonths),
    $("<td>").text(employeeObj.Rate),
    $("<td>").text(empBilled).append($("<button>").attr({ 'id': childObj.key, class: 'trButton' }).css({ float: 'right' }).text(' x'))
  );
  // Append the new row to the table
  $("#employee-table > tbody").append(newRow);



});

$(document).on('click', '.trButton', function (eventObj) {

  const userKey = $(this).attr('id');
  const employeeRef = refData.ref("/employees").child(userKey);

  employeeRef.once('value', function (snapShotObj) {
    console.log(snapShotObj.val());
  });

  employeeRef.remove();
  //Remove the element from DOM
  $("tr").remove("#"+userKey);
 
});

$("#add-employee-btn").click(function (eventObj) {
  eventObj.preventDefault();

  employeeObj.EmployeeName = $("#employee-name-input").val().trim();
  employeeObj.Role = $("#role-input").val().trim();
  employeeObj.StartDate = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
  employeeObj.Rate = $("#rate-input").val().trim();

  refData.ref("/employees").push(employeeObj);
  alert("Employee Added Sucessfully");

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
  

});

