if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}


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
  var addtoDB = document.getElementById('addAssignmentForm');
    if(addtoDB){
      addtoDB.addEventListener('submit', addToDatabase);
    }

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
    var upTask = document.getElementById('upcomingTask');
      if(upTask){
        upTask.innerHTML = "";
      }
    let unCompletedAssignment = [];
    docs.map(item => {

       
            unCompletedAssignment.push(item);
    })
  

    // Upcoming Assignments

    if (unCompletedAssignment.length > 0) {
        unCompletedAssignment.map((item) => {
            upcomingTaskContainer.innerHTML += ` 
            <div class="new-assignment">
            <span onclick = "document.getElementById('modal2').style.display='block'; setIdToLocalStorage(${item.id})" style="width:auto;" class = "editAssignment">
            <i class="fas fa-pencil-alt"></i>
            </span>
            <h5 class="assignment-name">  ${item.name}</h5>
           
            <span onclick = "deletetheAssignmentFromDatabase(${item.id})" class = "deleteAssignment">
            <i class="fas fa-trash-alt"></i>
            </span>
           
         
            <div class="assignment-details" > Module: ${item.module}</div>
            <div class="assignment-details" > Due Date: ${item.duedate}</div>
            <div class="assignment-details" > Notes: ${item.notes}</div>
             
              
            </div>
            <div class = "view_assets" onclick="document.getElementById('modal3').style.display='block'">View Assets</div> 
            <div class = "track_progress" onclick="document.getElementById('modal4').style.display='block'">Track Progress</div> 
            <br>
            <br>
        `;
        })
    } else {
        upTask.innerHTML = `<div class="white-text" style="font-size: 20px; text-align: center;">You currently have no upcoming assignments. Tap '+' to add.
        </div>`
    }

}

// Delete data

function deletetheAssignmentFromDatabase(id) {
if (confirm('Are you sure you want to delete this assignment?')) {
    var request = database.transaction(["allAssignments"], "readwrite")
        .objectStore("allAssignments")
        .delete(id);
    request.onsuccess = () => {
        getAllFromDatabase();
    };
    
} else {
    // Do nothing!
}
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
        document.getElementById("updateName").value = "";
        document.getElementById("updateModule").value = "";
        document.getElementById("updateDueDate").value = "";
        document.getElementById("updateNotes").value = "";

        assignment = event.target.result;
        assignment.name = updatedName;
        assignment.module = updatedModule;
        assignment.duedate = updatedDueDate;
        assignment.notes = updatedNotes;

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

  
