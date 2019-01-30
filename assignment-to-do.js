var database;
var request = indexedDB.open('assignments_db1', 4); // verison

request.onsuccess = function (e) {
    console.log('Database is connected Succesfully!');
    database = e.target.result;
    getAllFromDatabase();
};

request.onerror = function () {
    console.log('Some Error Occured!');
};


//Read All Data

function getAllFromDatabase() {
    let assignmentArray = [];
    let completedAssignment = [];
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

// ===== Printing to DOM ===== 

function PrintToDom(docs) {
    localStorage.setItem("assignmentArray", JSON.stringify(docs));
    let upcomingTaskContainer = document.getElementById('upcomingTask');
    document.getElementById('upcomingTask').innerHTML = "";
    let completedAssignment = [];
    let unCompletedAssignment = [];
    docs.map(item => {

        if (item.status === false) {
            unCompletedAssignment.push(item);
        } 
    })
    console.log(unCompletedAssignment);

// UPCOMING TASKS

if (unCompletedAssignment.length > 0) {

    unCompletedAssignment.map((item) => {

        upcomingTaskContainer.innerHTML += ` 

        <div class="card2">
            <h5 class="card2-h5">${item.name}</h5>
            <div class="decriptionHeadeing" style="width: auto">${item.module}</div>
            <div class="decriptionHeadeing btn-margin">
                <button onclick="setIdToLocalStorage(${item.id})" href="#modal2" class="waves-effect waves-light btn red white-text tooltipped modal-trigger" data-delay="1000" data-tooltip="Edit"
                    data-position="top">
                    <i class="material-icons">mode_edit</i>
                </button>
                <button onclick="deleteTodoFromDatabase(${item.id})" class="waves-effect waves-light btn yellow darken-1 white-text tooltipped" data-delay="1000" data-tooltip="Delete"
                    data-position="top">
                    <i class="material-icons">delete</i>
                </button> 
            </div>
        </div>
    `;
    })
} else {
    upcomingTaskContainer.innerHTML = `<div class="white-text" style="text-decoration: underline; font-size: 1.7em;">SEEMS LIKE YOU HAVE NO UPCOMING TASK...
    </div>`
}
}
