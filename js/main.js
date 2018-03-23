// function for callback
function fadeDone() {
    console.log(this)};

// Event handler
$("p").click(function(){
    //$(this).hide();
    //$(this).fadeTo(5000,1, fadeDone);
    //$(this).slideDown(3500).css("color","blue");
});

// Fire an event
// $("p").click();

// disable clicking, add effect and then lead to the link target
/*
$("nav a.nav-link").click(function(ev){
    ev.preventDefault();
    var link = $(this);
    var prop = link.data("prop") || "opacity";
    var val = link.data("value") || "0";
    var speed = link.data("speed") || 1000;
    var settings = {};
    settings[prop] = val;

    $(document.body).animate(settings,speed, function(){
        document.location = link.attr("href");
    });
});
*/

//Events page
// search box
$(".events-search-row input").on("keyup", function(ev) {
    $.each( $(".events-card-deck .card .card-title"), function(i,e) {
      var elem = $(e);
      var search = ev.target.value.toLowerCase();
      var content = elem.html().toLowerCase();
        
      if (content.indexOf(search) == -1) {
        elem.parents(".card").hide();
      } else {
        elem.parents(".card").show();
      }
    });
  });

  //tooltip
  $(function () {
    $('[data-toggle="tooltip"]').tooltip();
  });

//   //filtering tickets table
//    $(".tickets-search-row input").on("keyup", filterTickets);
//    function filterTickets() {
//        var currentValue = $(this).val().toLowerCase(); /*take the value that is typed into the box, and make it lower case */
//        var filteredTickets = [];
//        if (currentValue == "") {
//            filteredTickets = tickets; 
//        }   else {
//            filteredTickets = tickets.filter( function(item) {
//                var done = false;
//                for (var k in item) {
//                    if (item[k].toString().toLowerCase().indexOf(currentValue) > -1) {
//                        done=true;
//                    }
//                }
//                return done;
//            });
//        }  
//        fillTicketsTable (filteredTickets);
//    }; /* if the input box is empty, render the whole array, otherwise compare the entered value with a loop with the array and render the table accordingly*/
//
//    // arranging tickets table
//
//    var ticketTable= $("#ticket-list");
//    ticketTable.find("thead th[data-key]").on("click", orderTicketTable);
//    function orderTicketTable () {
//        var th = $(this);
//        $.each(ticketTable.find("thead th[data-key]"), function (index, elem) {
//            var currentTh = $(elem);
//            if (th.data("key") != currentTh.data("key")) {
//                currentTh
//                .removeClass("asc")
//                .removeClass("desc");
//            };
//        }); /* check if any of the th elements has the "asc" or "desc" class and remove, if yes. */
//        var key = th.data("key");
//        var sortedTickets = tickets.map (function(item) {
//            return item;
//        }); /* clone the tickets array*/
//
//        if (th.hasClass ("asc")) {
//            th.removeClass("asc").addClass("desc");
//        } else {
//            th.removeClass("desc").addClass("asc");
//        }
//        /* if the column is already assigned to "asc" or "desc" class, it swithces to the other class. */
//        
//        sortedTickets.sort(function(a,b){
//            if (th.hasClass ("asc")) {
//            return a[key].toString().localeCompare(b[key].toString());
//            } else {
//            return b[key].toString().localeCompare(a[key].toString());    
//            }
//        });
//        fillTicketsTable(sortedTickets);
//        /* this does the actual filtering by rendering the table one way if the class is "asc" and the other way if not. */
//    } 
        

  //Login page
  var alertBox = $(".alert.alert-primary")
  function showInvalidMessage() {
    alertBox
      .removeClass("alert-primary")
      .addClass("alert-danger")
      .find(".alert-message")
      .text("Nem jóóóó!!!!");
  };

// JQuery plugin for sending form

$.fn.sendForm = function(){
  var form= $(this);
  var action = form.attr("action");
  var method = form.attr("method") || "post";
  var callBack = form.attr("callBack")

  function checkFormItem (input) {
    input = $(input);
    var inputParent = input.parents(".form-group");
    if (input.attr("required") && input.val() == ""){
      console.log("Hibas input")
      inputParent.addClass("invalid");
      return false;
    } else {
      inputParent.removeClass("invalid");
    }
    return true;
  }

  $(this).on("submit", function(ev){
      ev.preventDefault();
      var formData = {};
      var formIsValid = [];
      $(this).find("input, select").each( function(index, input) {
          formData[input.name] = input.value;
          formIsValid.push(checkFormItem(input));
      });
      if (formIsValid.indexOf(false) > -1){
        return
      }
      $.ajax({
        type: method.toUpperCase(),
        url: action,
        data: formData,
        dataType:"json"
      }).done( function(resp){
        console.log(resp);
        if (window[callBack]){
          window[callBack]();
        }
      });
  }); 
  return this;
};

$("#newEventForm").sendForm();
