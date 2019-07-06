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
let status="";

refData.ref("/employees").on('value', function (snapshot) {
  
  console.log("snapshot value method: " + countFunctionCall);

  if (snapshot.val()) {
    const snapObj=snapshot.val();
    for(let key in snapObj){
      console.log(key);
      console.log(snapObj[key]);
    }
    
    let keys=Object.keys(snapObj);
     console.log(keys);
     console.log(snapObj);
    for(let i=0;i<keys.length;i++){
      console.log(snapObj[keys[i]]);
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

// update-employee-name-input

// <input list="browsers" name="browser">
//   <datalist id="browsers">
//     <option value="Internet Explorer">
//     <option value="Firefox">
//     <option value="Chrome">
//     <option value="Opera">
//     <option value="Safari">
//   </datalist>


refData.ref("/employees").on('child_changed',function(childSnapshot){
  console.log(childSnapshot.key);
  console.log(childSnapshot.val());
});

refData.ref("/employees").on('child_removed',function(childSnapshot){
  console.log(childSnapshot.key);
  console.log(childSnapshot.val());
});

refData.ref("/employees").on('child_added', function (childObj, prevChildKeyObj) {

  employeeObj = childObj.val();
  employeeObjKey=childObj.key;
  console.log("employeeObj: ",employeeObjKey,employeeObj);
  console.log("prevChildKeyObj: " + prevChildKeyObj);

  // Prettify the employee start
  let empStartPretty = moment.unix(employeeObj.StartDate).format("MM/DD/YYYY");

  // Calculate the months worked using hardcore math
  // To calculate the months worked
  let empMonths = moment().diff(empStartPretty, "months");


  // Calculate the total billed rate
  let empBilled = empMonths * employeeObj.Rate;

  // Create the new row
  let newRow = $("<tr>").attr({ 'id': childObj.key }).append(
    $("<td>").text(childObj.key),
    $("<td>").text(employeeObj.EmployeeName),
    $("<td>").text(employeeObj.Role),
    $("<td>").text(empStartPretty),
    $("<td>").text(empMonths),
    $("<td>").text(employeeObj.Rate),
    $("<td>").text(empBilled).append($("<button>").attr({ 'id': childObj.key, class:'trButton' }).css({ float: 'right' }).text('X'))
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

$("#update-employee-btn").on('click',function(eventObj){
  eventObj.preventDefault();
  console.log(eventObj);

  let employeeObjUpdate={};

  let  userKey= $("#employee-id-input").val().trim();

  refData.ref("/employees").child(userKey).once('value',function(snapObjUpdate){
    console.log(snapObjUpdate.val());

  });
  
  employeeObjUpdate.Role = $("#update-role-input").val().trim();
  employeeObjUpdate.StartDate = moment($("#update-start-input").val().trim(), "MM/DD/YYYY").format("X");
  employeeObjUpdate.Rate = $("#update-rate-input").val().trim();
console.log(employeeObjUpdate);

  console.log(userKey);
  console.log(refData.ref("/employees").child(userKey));
  let result=refData.ref("/employees").child(userKey).update(employeeObjUpdate);
  console.log(result);

  alert("Employee Update Sucessfully");


});

$("#add-employee-btn").click(function (eventObj) {
  eventObj.preventDefault();

  employeeObj.EmployeeName = $("#employee-name-input").val().trim();
  employeeObj.Role = $("#role-input").val().trim();
  employeeObj.StartDate = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
  employeeObj.Rate = $("#rate-input").val().trim();
  console.log(employeeObj.StartDate);

  console.log(moment().format("X"));

  status=refData.ref("/employees").push(employeeObj);
 alert("Employee Added Sucessfully");
  console.log(status);

  // Clears all of the text-boxes
  $("#employee-name-input").val("");
  $("#role-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

