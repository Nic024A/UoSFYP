if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}


//This function slides the side menu out by 250px and pushes the main content to the right by 250px.
function openSlideMenu() {
  document.getElementById('side-menu').style.width = '250px';
  document.getElementById('main').style.marginLeft = '250px';
}
//This function collapses the side menu completely.
function closeSlideMenu() {
  document.getElementById('side-menu').style.width = '0';
  document.getElementById('main').style.marginLeft = '0';
}


$(document).ready(function () {
  $('.click').on('click', function () {
    $(this).toggleClass('flip');
  });
});

//Toggle Progress
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}

$(document).ready(function () {
  var $ul = $('#favorite-links');
  var $title = $('#title');
  var $url = $('#url');

  //get items from local storage
  if (localStorage.getItem('vk-links')) {
    $ul.html(localStorage.getItem('vk-links'));
  }

  // add nwe item
  $('#add').click(function () {

    //add new item
    $('#favorite-links').append('<li><a href="' + $url.val() + '" target="_blank">' + $title.val());

    //save changes to localstorage
    localStorage.setItem('vk-links', $ul.html());

    //reset form
    $title.val("");
    $url.val("http://");
    $("#add-link-form").slideToggle("100");

  });



  //form toggle
  $("#new-link-button").click(function () {
    $("#add-link-form").slideToggle("100");
  });

});


function isNumberKey(evt)
      {
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
            return false;

         return true;
      }