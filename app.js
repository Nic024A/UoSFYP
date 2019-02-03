if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

/*$(document).ready(function(){
  //Open Database
  var request = indexedDB.open('assignments',1);
  
  request.onupgradeneeded = function(e){
      var db = e.target.result;
  
          if(!db.objectStoreNames.contains('assignments')){
              var os = db.createObjectStore('assignments', {keyPath: "id", autoIncrement:true});
              //Create Index for name
              os.createIndex('name', 'name', {unique:false});
          }
  }
  
  //Success
  request.onsuccess = function(e){
      console.log('Success: Opened Database...');
      db = e.target.result;
      //Show Assignments
     // showAssignments();
  }
  
      //Error
      request.onerror = function(){
      console.log('Error: Could not open database');
  }
    
  });
  
  
  //Add Assignment
  function addAssignment(){
      var name = $('#name').val();
      var module = $('#module').val();
      var duedate = $('#duedate').val();
      var notes = $('#notes').val();
  
      var transaction = db.transaction(['assignments'], "readwrite");
  
      //Ask for Object Store
      var store = transaction.objectStore('assignments');
  
      //Define Assignment
      var assignment = {
          name: name,
          module: module,
          duedate: duedate,
          notes: notes
  
      }
  
      //Perform the Add
      var request = store.add(assignment);
  
      //Success 
      request.onsuccess = function(e){
          window.location.href = 'assignments.html';
  
      }
  
      //Error
      request.onerror = function(e){
          alert("Sorry the Assignment was not added.");
          console.log('Error:', e.target.error.name);
      }
  }
  
  //Display Assignments
function showAssignments(e){
  var transation = db.transaction(['assignments'], "readonly");

  //Ask for Object Store
  var store = transaction.objectStore('assignments');
  var index = store.index('name');

  var output = '';
  index.openCursor().onsucess = function(e){
    var cursor = e.target.result;
    if (cursor){
      output += "<div class = 'new_assignment'>";
      output+= "<h1>"+cursor.value.name+"</h1>";
      output+= "<h2>"+cursor.value.module+"</h2>";
      output+= "<h2>"+cursor.value.duedate+"</h2>";
      output+= "<h2>"+cursor.value.notes+"</h2>";
      output+= "</div>";
      cursor.continue();
    }

    $('upcomingTask').html(output);
  }




}


*/


// Open Database

var database;
var request = indexedDB.open('assignments', 4); // verison
request.onsuccess = function (e) {
    console.log('Database is connected Succesfully!');
    database = e.target.result;
    getAllFromDatabase();
};

//Error Handling
request.onerror = function () {
    console.log('Some Error Occured!');
};



// Creating an object store

request.onupgradeneeded = function (e) {
    database = e.target.result;
    if (!database.objectStoreNames.contains('allAssignments')) {
        var os = database.createObjectStore('allAssignments', { keyPath: "id", autoIncrement: true })
    };
};

// Event Handler 

  document.getElementById('addAssignmentForm').addEventListener('submit', addToDatabase);

//Add Assignment

function addToDatabase(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let module = document.getElementById('module').value;
    let duedate = document.getElementById('duedate').value;
    let notes = document.getElementById('notes').value;
    document.getElementById('name').value = "";
    document.getElementById('module').value = "";
    document.getElementById('duedate').value = "";
    document.getElementById('notes').value = "";
    let taskDone = false;
    const assignment = {
        name,
        module,
        duedate,
        notes,
        taskDone
    };

    // Write to DB

    var request = database.transaction(["allAssignments"], "readwrite")
        .objectStore("allAssignments")
        .add(assignment);

    request.onsuccess = e => {
        getAllFromDatabase();
        window.location.href = 'assignments.html';
        alert('Success! Your Assignment has been added!!!')
        console.log('Written with e => ', e)
    };
    request.onerror = e => console.log('Error with e => ', e);

};

  //Read all data from DB

  function getAllFromDatabase() {
      let assignmentArray = [];
      let completedAssignment = [];
      let unCompletedAssignment = [];
      var request = database.transaction(["allAssignments"], "readwrite")
          .objectStore("allAssignments")
          .openCursor()
          .onsuccess = (e) => {

          
              let cursor = e.target.result;
              if (cursor) {
                  let newAssignmentObject = {
                      id: cursor.value.id,
                      name: cursor.value.name,
                      module: cursor.value.module,
                      duedate: cursor.value.duedate,
                      notes: cursor.value.notes,
                      status: cursor.value.taskDone
                  };
                  assignmentArray.push(newAssignmentObject);
                  cursor.continue();
              }
              
              PrintToDom(assignmentArray)
              
          }
          

  };

// Print to DOM

function PrintToDom(docs) {
    localStorage.setItem("assignmentArray", JSON.stringify(docs));
    let upcomingTaskContainer = document.getElementById('upcomingTask');
    document.getElementById('upcomingTask').innerHTML = "";
    let completedAssignment = [];
    let unCompletedAssignment = [];
    docs.map(item => {

        if (item.status) {
            completedAssignment.push(item);
        } else {
            unCompletedAssignment.push(item);
        }
    })

    // Upcoming Assignments

    if (unCompletedAssignment.length > 0) {
        unCompletedAssignment.map((item) => {
            upcomingTaskContainer.innerHTML += ` 
            <div class="new-assignment">
                <h5 class="assignment-name">  ${item.name}</h5>
                <div class="assignment-details" > Module: ${item.module}</div>
                <div class="assignment-details" > Due Date: ${item.duedate}</div>
                <div class="assignment-details" > Notes: ${item.notes}</div>
              
            </div>
            <br><br>
        `;
        })
    } else {
        upcomingTaskContainer.innerHTML = `<div class="white-text" style="font-size: 20px; text-align: center;">You currently have no upcoming assignments. Tap '+' to add.
        </div>`
    }

}

// Delete data

function deleteAssignmentFromDatabase(id) {
    var request = database.transaction(["allAssignments"], "readwrite")
        .objectStore("allAssignments")
        .delete(id);
    request.onsuccess = () => {
        getAllFromDatabase();
    };

};

// Update data

function updateAssignmentInDatabase() {

    let id = localStorage.getItem('assignmentToUpdate');
    var objectStore = database.transaction(["allAssignments"], "readwrite")
        .objectStore("allAssignments");
    const myDesiredObject = objectStore.get(Number(id));
    myDesiredObject.onerror = e => console.log('error');

    myDesiredObject.onsuccess = function (event) {

        let updatedName = document.getElementById("updateName").value;
        let updatedModule = document.getElementById("updateModule").value;
        let updatedDueDate = document.getElementById("updateDueDate").value;
        let updatedNotes = document.getElementById("updateNotes").value;
        let doneStatus = document.getElementById('checkbox');
        document.getElementById("updateName").value = "";
        document.getElementById("updateModule").value = "";
        document.getElementById("updateDueDate").value = "";
        document.getElementById("updateNotes").value = "";

        assignment = event.target.result;
        assignment.name = updatedName;
        assignment.module = updatedModule;
        assignment.duedate = updatedDueDate;
        assignment.notes = updatedNotes;
        assignment.taskDone = doneStatus.checked ? true : false;

        const requestUpdate = objectStore.put(assignment);
        requestUpdate.onsuccess = e => {
            getAllFromDatabase();
        };
        requestUpdate.onerror = e => console.log('Some error!');
    }
};

function setIdToLocalStorage(id) {
    localStorage.setItem("assignmentToUpdate", id);
    const assignmentArray = JSON.parse(localStorage.getItem('assignmentArray'));
    const ourDesiredAssignment = assignmentArray.filter(item => item.id === Number(id));
    if (ourDesiredAssignment) {
        document.getElementById('updateName').value = ourDesiredAssignment[0].name;
        document.getElementById('updateModule').value = ourDesiredAssignment[0].module;
        document.getElementById('updateDueDate').value = ourDesiredAssignment[0].duedate;
        document.getElementById('updateNotes').value = ourDesiredAssignment[0].notes;
        localStorage.setItem('id', id);
    };
}







//This function slides the side menu out by 250px and pushes the main content to the right by 250px.
function openSlideMenu(){
    document.getElementById('side-menu').style.width = '250px';
    document.getElementById('main').style.marginLeft = '250px';
  }
//This function collapses the side menu completely.
  function closeSlideMenu(){
    document.getElementById('side-menu').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
  }

