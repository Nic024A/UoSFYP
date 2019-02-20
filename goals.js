// Open Database

var database;
var request = indexedDB.open('goals', 4); // verison
request.onsuccess = function (e) {
    console.log('Database is connected Succesfully!');
    database = e.target.result;

    getallgoals(function(goals) {
        
        var userDate = new Date(goals[0].date);
        var userGoal = goals[0].goalname;
        var today = new Date();
        var diff = 0;
        var days = 1000 * 60 * 60 * 24;
        
        diff = userDate - today;
        countdown = document.getElementById("countdown")
        countdown.innerHTML = Math.floor(diff / days) + ' days until ' + userGoal + ' due date';
    });
    //getallgoals();
};

//Error Handling
request.onerror = function () {
    console.log('Some Error Occured!');
};



// Creating an object store

request.onupgradeneeded = function (e) {
    database = e.target.result;
    if (!database.objectStoreNames.contains('allGoals')) {
        var os = database.createObjectStore('allGoals', { keyPath: "id", autoIncrement: true })
    };
};

// Event Handler 
  var addtoDB = document.getElementById('addGoalForm');
    if(addtoDB){
      addtoDB.addEventListener('submit', addGoalToDatabase);
    }

//Add Goal

function addGoalToDatabase(e) {
    e.preventDefault();
    let goalname = document.getElementById('goalname').value;
    let date = document.getElementById('date').value;
    let details = document.getElementById('details').value;
    document.getElementById('goalname').value = "";
    document.getElementById('date').value = "";
    document.getElementById('details').value = "";
 
    const goal = {
        goalname,
        date,
        details
    };

    // Write to DB

    var request = database.transaction(["allGoals"], "readwrite")
        .objectStore("allGoals")
        .add(goal);
      

    request.onsuccess = e => {
        getallgoals();
   
        window.location.href = 'goals.html';
        
        
        
        console.log('Written with e => ', e)
    };
    request.onerror = e => console.log('Error with e => ', e);

};

  //Read all data from DB

  function getallgoals(cb) {
      let goalArray = [];
      var request = database.transaction(["allGoals"], "readwrite")
          .objectStore("allGoals")
          .openCursor()
          .onsuccess = (e) => {

          
              let cursor = e.target.result;
              if (cursor) {
                  let newGoalObject = {
                      id: cursor.value.id,
                      goalname: cursor.value.goalname,
                      date: cursor.value.date,
                      details: cursor.value.details
                    
                  };
                  goalArray.push(newGoalObject);
                  cursor.continue();
              }
              
              PrintToDom(goalArray)
              cb(goalArray)
              
          }
          

  };

    // Print to DOM

    function PrintToDom(docs) {
        localStorage.setItem("goalArray", JSON.stringify(docs));
        let upcomingGoalContainer = document.getElementById('upcomingGoals');
        var upcomingGoal = document.getElementById('upcomingGoals');
        if(upcomingGoal){
            upcomingGoal.innerHTML = "";
        }
        let unCompletedGoal = [];
        docs.map(item => {

        
                unCompletedGoal.push(item);
        })
  

    // Upcoming Assignments

    if (unCompletedGoal.length > 0) {
        unCompletedGoal.map((item) => {
            upcomingGoalContainer.innerHTML += ` 
            <div class="new-assignment">
            <span onclick = "document.getElementById('modal2').style.display='block'; setIdToLocalStorage(${item.id});" style="width:auto;" class = "editAssignment">
            <i class="fas fa-pencil-alt"></i>
            </span>
            <h5 class="assignment-name">  ${item.goalname}🎯 </h5>
           
            <span onclick = "deletetheGoalFromDatabase(${item.id})" class = "deleteAssignment">
            <i class="fas fa-trash-alt"></i>
            </span>
           
         
            <div class="assignment-details" > I aim to complete this goal by: ${item.date}</div>
            <div class="assignment-details" > This will help me to: ${item.details}</div>
            </div>
            <div class = "track_progress" onclick="completeGoalInDatabase(${item.id})">Complete 🏆</div>
            <br>
            <br>
        `
                   
        ;

        })

    } else {
        upcomingGoal.innerHTML = `<div class="white-text" style="font-size: 20px; text-align: center;">You currently have no goals. Tap '+' to add.
        </div>`

    }

}

        // Delete data

        function deletetheGoalFromDatabase(id) {
        if (confirm('Are you sure you want to delete this goal?')) {
            var request = database.transaction(["allGoals"], "readwrite")
                .objectStore("allGoals")
                .delete(id);
            request.onsuccess = () => {
                getallgoals();
                location.reload();
            };
            
        } else {
            // Do nothing!
        }
        };


    

        // Update data

        function updateGoalInDatabase() {

            let id = localStorage.getItem('goalToUpdate');
            var objectStore = database.transaction(["allGoals"], "readwrite")
                .objectStore("allGoals");
            const myDesiredObject = objectStore.get(Number(id));
            myDesiredObject.onerror = e => console.log('error');

            myDesiredObject.onsuccess = function (event) {

                let updatedGoalName = document.getElementById("updateGoalName").value;
                let updatedDate = document.getElementById("updateDate").value;
                let updatedDetails = document.getElementById("updateDetails").value;
                document.getElementById("updateGoalName").value = "";
                document.getElementById("updateDate").value = "";
                document.getElementById("updateDetails").value = "";


                goal = event.target.result;
                goal.goalname = updatedGoalName;
                goal.date = updatedDate;
                goal.details = updatedDetails;
           
                const requestUpdate = objectStore.put(goal);
                requestUpdate.onsuccess = e => {
                    getallgoals();

                };
                requestUpdate.onerror = e => console.log('Some error!');
            }
        };

        //Set ID to Local storage when updating an assignment.
        function setIdToLocalStorage(id) {
            localStorage.setItem("goalToUpdate", id);
            const goalArray = JSON.parse(localStorage.getItem('goalArray'));
            const ourDesiredGoal = goalArray.filter(item => item.id === Number(id));
            if (ourDesiredGoal) {
                document.getElementById('updateGoalName').value = ourDesiredGoal[0].goalname;
                document.getElementById('updateDate').value = ourDesiredGoal[0].date;
                document.getElementById('updateDetails').value = ourDesiredGoal[0].details;
                localStorage.setItem('id', id);
            };
        }


         //Ask user if they want to delete assignment from database when completed
         function completeGoalInDatabase(id) {
            if (confirm('Well done! Do you want to remove this goal from the list?')) {
                var request = database.transaction(["allGoals"], "readwrite")
                    .objectStore("allGoals")
                    .delete(id);
                request.onsuccess = () => {
                    getallgoals();
                    location.reload();
                };

               //Show success Modal and start confetti
                document.getElementById('modal5').style.display='block'; 
                     

            } else {
                // Do nothing!
            }
            };

               //Confetti Celebration when user completes assignment.

               for (var i = 0; i < 250; i++) {
                create(i);
              }
              
              function create(i) {
                var width = Math.random() * 8;
                var height = width * 0.4;
                var colourIdx = Math.ceil(Math.random() * 3);
                var colour = "red";
                switch(colourIdx) {
                  case 1:
                    colour = "yellow";
                    break;
                  case 2:
                    colour = "blue";
                    break;
                  default:
                    colour = "red";
                }
                $('<div class="confetti-'+i+' '+colour+'"></div>').css({
                  "width" : width+"px",
                  "height" : height+"px",
                  "top" : -Math.random()*20+"%",
                  "left" : Math.random()*100+"%",
                  "opacity" : Math.random()+0.5,
                  "transform" : "rotate("+Math.random()*360+"deg)"
                }).appendTo('.celebrate');  
                
                drop(i);
              }
              
              function drop(x) {
                $('.confetti-'+x).animate({
                  top: "100%",
                  left: "+="+Math.random()*15+"%"
                }, Math.random()*3000 + 3000, function() {
                  reset(x);
                });
              }
              
              function reset(x) {
                $('.confetti-'+x).animate({
                  "top" : -Math.random()*20+"%",
                  "left" : "-="+Math.random()*15+"%"
                }, 0, function() {
                  drop(x);             
                });
              }
            

                            
                
            
