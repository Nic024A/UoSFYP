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

    var addProgress = document.getElementById('addProgress');
    if(addProgress){
      addProgress.addEventListener('submit', addToDatabase);
    }



//Add Assignment

function addToDatabase(e) {
    e.preventDefault();
    let name = document.getElementById('name').value;
    let module = document.getElementById('module').value;
    let duedate = document.getElementById('duedate').value;
    let notes = document.getElementById('notes').value;
    let research = document.getElementById('research').value;
    let development = document.getElementById('dev').value;
    let report = document.getElementById('report').value;
    document.getElementById('name').value = "";
    document.getElementById('module').value = "";
    document.getElementById('duedate').value = "";
    document.getElementById('notes').value = "";
    document.getElementById('research').value = "";
    document.getElementById('dev').value = "";
    document.getElementById('report').value = "";
    const assignment = {
        name,
        module,
        duedate,
        notes,
        research,
        development,
        report
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
                      research:cursor.value.research,
                      development: cursor.value.development,
                      report: cursor.value.report
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
            <span onclick = "document.getElementById('modal2').style.display='block'; setIdToLocalStorage(${item.id}); updateResearchProgress(); updateDevProgress(); updateReportProgress();" style="width:auto;" class = "editAssignment">
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
            <div class = "view_assets" onclick="document.getElementById('modal3').style.display='block'; setIdToLocalStorage(${item.id}); " style="width:auto;" >View Assets</div> 
            <div class = "track_progress" onclick="completeAssignmentInDatabase(${item.id})">Complete 🏆</div> 
            <br>
            <br>
        `
                   
        ;

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
                let updatedResearch = document.getElementById("updateResearch").value;
                let updatedDevelopment = document.getElementById("updateDev").value;
                let updatedReport = document.getElementById("updateReport").value;
                document.getElementById("updateName").value = "";
                document.getElementById("updateModule").value = "";
                document.getElementById("updateDueDate").value = "";
                document.getElementById("updateNotes").value = "";
                document.getElementById("updateResearch").value = "";
                document.getElementById("updateDev").value = "";
                document.getElementById("updateReport").value = "";

                assignment = event.target.result;
                assignment.name = updatedName;
                assignment.module = updatedModule;
                assignment.duedate = updatedDueDate;
                assignment.notes = updatedNotes;
                assignment.research = updatedResearch;
                assignment.development = updatedDevelopment;
                assignment.report = updatedReport;

                const requestUpdate = objectStore.put(assignment);
                requestUpdate.onsuccess = e => {
                    getAllFromDatabase();

                };
                requestUpdate.onerror = e => console.log('Some error!');
            }
        };

        //Set ID to Local storage when updating an assignment.
        function setIdToLocalStorage(id) {
            localStorage.setItem("assignmentToUpdate", id);
            const assignmentArray = JSON.parse(localStorage.getItem('assignmentArray'));
            const ourDesiredAssignment = assignmentArray.filter(item => item.id === Number(id));
            if (ourDesiredAssignment) {
                document.getElementById('updateName').value = ourDesiredAssignment[0].name;
                document.getElementById('updateModule').value = ourDesiredAssignment[0].module;
                document.getElementById('updateDueDate').value = ourDesiredAssignment[0].duedate;
                document.getElementById('updateNotes').value = ourDesiredAssignment[0].notes;
                document.getElementById('updateResearch').value = ourDesiredAssignment[0].research;
                document.getElementById('updateDev').value = ourDesiredAssignment[0].development;
                document.getElementById('updateReport').value = ourDesiredAssignment[0].report;
                localStorage.setItem('id', id);
            };
        }


         //Countdown Banner
        





        //Toggle Progress
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight){
            panel.style.maxHeight = null;
            } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        });
        }

        //WHEN ADDING ASSIGNMENT: Progres Circles for each Assessment Stage

        document.getElementById('research').addEventListener('keyup', function(){
            var currentVal = this.value;
            if (currentVal<=100) {
                document.getElementById('researchfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                document.getElementById('researchpercentageText').innerHTML = currentVal+'%';	
            }
            if (currentVal>100) {
                alert('Please Enter Below 100')
                return false;
            }
            if (currentVal=='') {
                document.getElementById('researchfillStroke').setAttribute('stroke-dasharray', '0 100');
                document.getElementById('researchpercentageText').innerHTML = '0%';	
            }
        });
        
        document.getElementById('dev').addEventListener('keyup', function(){
            var currentVal = this.value;
            if (currentVal<=100) {
                document.getElementById('devfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                document.getElementById('devpercentageText').innerHTML = currentVal+'%';	
            }
            if (currentVal>100) {
                alert('Please Enter Below 100')
                return false;
            }
            if (currentVal=='') {
                document.getElementById('devfillStroke').setAttribute('stroke-dasharray', '0 100');
                document.getElementById('devpercentageText').innerHTML = '0%';	
            }
        });

        document.getElementById('report').addEventListener('keyup', function(){
            var currentVal = this.value;
            if (currentVal<=100) {
                document.getElementById('reportfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                document.getElementById('reportpercentageText').innerHTML = currentVal+'%';	
            }
            if (currentVal>100) {
                alert('Please Enter Below 100')
                return false;
            }
            if (currentVal=='') {
                document.getElementById('reportfillStroke').setAttribute('stroke-dasharray', '0 100');
                document.getElementById('reportpercentageText').innerHTML = '0%';	
            }
        });


                //WHEN UPDATING ASSIGNMENT: Progres Circles for each Assessment Stage 

            function updateReportProgress(){
                var progress = document.getElementById('updateReport');
                    var currentVal = progress.value;
                    
                    if (currentVal<=100) {
                        document.getElementById('newreportfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                        document.getElementById('newreportpercentageText').innerHTML = currentVal+'%';	
                    }
                    if (currentVal>100) {
                        alert('Please Enter Below 100')
                        return false;
                    }

                    if (currentVal=='') {
                        document.getElementById('newreportfillStroke').setAttribute('stroke-dasharray', '0 100');
                        document.getElementById('newreportpercentageText').innerHTML = '0%';	
                    }
               
                };


                document.getElementById('updateReport').addEventListener('keyup', function(){
                    var currentVal = this.value;
                    if (currentVal<=100) {
                        document.getElementById('newreportfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                        document.getElementById('newreportpercentageText').innerHTML = currentVal+'%';	
                    }
                    if (currentVal>100) {
                        alert('Please Enter Below 100')
                        return false;
                    }
                    if (currentVal=='') {
                        document.getElementById('newreportfillStroke').setAttribute('stroke-dasharray', '0 100');
                        document.getElementById('newreportpercentageText').innerHTML = '0%';	
                    }
                });

                function updateDevProgress(){
                    var progress = document.getElementById('updateDev');
                    var currentVal = progress.value;

                   
                        if (currentVal<=100) {
                            document.getElementById('newdevfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                            document.getElementById('newdevpercentageText').innerHTML = currentVal+'%';	
                        }
                        if (currentVal>100) {
                            alert('Please Enter Below 100')
                            return false;
                        }

                       if (currentVal=='') {
                            document.getElementById('newdevfillStroke').setAttribute('stroke-dasharray', '0 100');
                            document.getElementById('newdevpercentageText').innerHTML = '0%';	
                        }
                       
                    }


                    
                document.getElementById('updateDev').addEventListener('keyup', function(){
                    var currentVal = this.value;
                    if (currentVal<=100) {
                        document.getElementById('newdevfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                        document.getElementById('newdevpercentageText').innerHTML = currentVal+'%';	
                    }
                    if (currentVal>100) {
                        alert('Please Enter Below 100')
                        return false;
                    }
                    if (currentVal=='') {
                        document.getElementById('newdevfillStroke').setAttribute('stroke-dasharray', '0 100');
                        document.getElementById('newdevpercentageText').innerHTML = '0%';	
                    }
                });
                    
                    function updateResearchProgress(){
                        var progress = document.getElementById('updateResearch');
                            var currentVal = progress.value;
                            if (currentVal<=100) {
                                document.getElementById('newresearchfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                                document.getElementById('newresearchpercentageText').innerHTML = currentVal+'%';	
                            }
                            if (currentVal>100) {
                                alert('Please Enter Below 100')
                                return false;
                            }
        
        
                            if (currentVal=='') {
                                document.getElementById('newresearchtfillStroke').setAttribute('stroke-dasharray', '0 100');
                                document.getElementById('newresearchpercentageText').innerHTML = '0%';	
                            }
                        };

                        
                document.getElementById('updateResearch').addEventListener('keyup', function(){
                    var currentVal = this.value;
                    if (currentVal<=100) {
                        document.getElementById('newresearchfillStroke').setAttribute('stroke-dasharray', currentVal +' 100');
                        document.getElementById('newresearchpercentageText').innerHTML = currentVal+'%';	
                    }
                    if (currentVal>100) {
                        alert('Please Enter Below 100')
                        return false;
                    }
                    if (currentVal=='') {
                        document.getElementById('newresearchfillStroke').setAttribute('stroke-dasharray', '0 100');
                        document.getElementById('newresearchpercentageText').innerHTML = '0%';	
                    }
                });
                    
            


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
                
            
            
            //Ask user if they want to delete assignment from database when completed
            function completeAssignmentInDatabase(id) {
                if (confirm('Well done! Do you want to remove this assignment from your list?')) {
                    var request = database.transaction(["allAssignments"], "readwrite")
                        .objectStore("allAssignments")
                        .delete(id);
                    request.onsuccess = () => {
                        getAllFromDatabase();
                    };

                   //Show success Modal and start confetti
                    document.getElementById('modal4').style.display='block'; 
                         
 
                } else {
                    // Do nothing!
                }
                };
                
                function calcCountdown(){
                    var assignmentdate = document.getElementsByClassName("duedate");
                    var userDate = new Date(assignmentdate)
                    var today = new Date();
                    var diff = 0;
                    var days = 1000 * 60 * 60 * 24;
                    
                    diff = userDate - today;
                    countdown = document.getElementById('days')
                    countdown.innerHTML += Math.floor(diff / days) + ' days until next assignment';
                
                
                }
         
                    $(document).ready(function() {
                        showImages();
                    
                      $("body").on("change", ".file-upload", function() {
                          var $input = $(this);
                        var file = $input[0].files[0];
                    
                        var reader = new FileReader();
                        reader.onload = function() {
                          var images = JSON.parse(localStorage.getItem('images')) || [];
                          images[$input.index('.file-upload')] = reader.result;
                          localStorage.setItem('images', JSON.stringify(images));
                          showImages(images);
                        }
                        reader.readAsDataURL(file);
                      });
                    });
                    
                    function showImages(content) {
                        $('.imgPreview').empty();
                      var images = content || JSON.parse(localStorage.getItem('images')) || [];
                      images.forEach(function(image, i) {
                        $('<img />').prop('src', image).appendTo($('.imgPreview').eq(i));
                      })
                    }
    
     