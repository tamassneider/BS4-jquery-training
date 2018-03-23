$(document).ready(function (){
    var RESTURL = "http://localhost:3000";
    var searchString = '';
    var sortKey = '';
    var sortDirection = '';
    var ticketListTable = $("#ticket-list");
    // pagination variables
    var pageLimit = 4; // the number of table rows on one page
    var currentPage = 1; 
    var maxPage = 0; // the number of pages will be calculates based on the number of elements
    var totalCount = 0;


// Tickets table generator - brings in elements from the server javascript object
    function fillTicketsTable(currentTickets){
        var tbody = $("#ticket-list tbody");
        tbody.html('');

        $.each(currentTickets, function(index, ticket){
            var row = $(".templates .ticket-row").clone();
            row.find("td").eq(0).html(index+1);
            row.find("td").eq(1).html(ticket.event);
            row.find("td").eq(2).html(ticket.time);
            row.find("td").eq(3).html(ticket.seller);
            row.find("td").eq(4).html(ticket.pcs);
            row.find("td").eq(5).html(ticket.link);
            tbody.append(row);
        });
    }

    function refreshTicketList(){
        var urlParams = [];
        var url = RESTURL + "/tickets";
        var reg = /\?.*event\=([0-9]*)/
        var eventId=0

        // determine the page limit
        urlParams.push("_limit=" + pageLimit);
        urlParams.push("_page=" + currentPage);

        // add event id
        try {
            eventId = window.location.toString().match(reg)[1];
            urlParams.push("eventId=" + eventId);
        }
        catch(err) {
            eventId = 0;
        }

        // if there is something in the search box, the search string is added to the url
        if(searchString.length > 0){
            urlParams.push('q='+searchString);
        }

        // if the headers are clicked to sort, this is pushed to the url
        if(sortKey.length>0){
            urlParams.push("_sort="+sortKey);
            urlParams.push("_order="+sortDirection);
        }

        if(urlParams.length > 0){
            url = url + "?"+urlParams.join('&');
        }

        $.getJSON(url).done(
            function(ticketList, textStatus, request){
                // determine the number of items sent by the server
                var oldMaxPage = maxPage
                totalCount = request.getResponseHeader('X-Total-Count');
                maxPage = totalCount/pageLimit;
                if(maxPage % 1!==0){
                    maxPage = parseInt(maxPage)+1;
                }
                // if the number of items has changed, render the paginator
                if(oldMaxPage != maxPage){
                    renderTicketTablePaginator();
                }

                refreshPaginate();
                fillTicketsTable(ticketList);
            }
        );
    }

    // this will activate/deactivate elements of the paginator
    function refreshPaginate(){
        var paginatorElem = $("#ticket-list-paginator");

        var firstElem = paginatorElem.find("ul > li:first-child");
        var lastElem = paginatorElem.find("ul > li:last-child");

        if (currentPage == 1){
            // disable left arrow, if we are on the first page
            firstElem.addClass("disabled");
            // if the right arrow is disabled, then it is enabled here
            lastElem.removeClass("disabled");
            // if the last page is disabled, then it is enabled here
            lastElem.prev().removeClass("disabled");
        } else if (currentPage == maxPage){
            firstElem.removeClass("disabled");
            firstElem.next().removeClass("disabled");
            lastElem.addClass("disabled");
        } else {
            firstElem.removeClass("disabled");
            lastElem.removeClass("disabled");
        }

        // check if there is an active element on the paginator and deactivate it
        var currentActiveElem = paginatorElem.find("ul > li.active");
        if (currentActiveElem.length > 0) {
            currentActiveElem.removeClass("active");
        }

        paginatorElem.find("ul > li").eq(currentPage).addClass("active");

    }

    // this will render the paginator
    function renderTicketTablePaginator(){
        var paginatorULElem = $("#ticket-list-paginator > ul");

        paginatorULElem.html("");

        var html = [];
        // left arrow
        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Previous" data-paginate-size="prev"><span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span></a></li>')
        // numbers based on server data
        for(var i=1;i<=maxPage;i++){
            html.push('<li class="page-item"><a class="page-link" href="#" data-paginate-size="'+i+'">'+i+'</a></li>')
        }
        // right arrow
        html.push('<li class="page-item"><a class="page-link" href="#" aria-label="Next" data-paginate-size="next"><span aria-hidden="true">&raquo;</span><span class="sr-only">Previous</span></a></li>')
    
        paginatorULElem.html(html.join(""));
        // add the event handler of the buttons
        bindPaginatorEvents();
    }

    // this handles the buttons of the paginator
    function bindPaginatorEvents() {
        $("#ticket-list-paginator > ul > li > a").click(
            function(event) {
                var oldCurrentPage = currentPage;
                event.preventDefault();
                var paginateSize = $(this).data("paginate-size");
                if (paginateSize == "prev"){
                    currentPage--;
                } else if (paginateSize == "next") {
                    currentPage++;
                } else {
                    currentPage = parseInt(paginateSize);
                }
                if (oldCurrentPage != currentPage){
                    refreshTicketList();
                }
            }
        );
    }
    

      //filtering tickets table
      $(".tickets-search-row input").on("keyup",
        function () {
            searchString=$(this).val();
            refreshTicketList();
        });
    
  
      // arranging tickets table
  
      var ticketTable = $("#ticket-list");
      ticketTable.find("thead th[data-key]").on("click",
      function () {
          var th = $(this);
          $.each(ticketTable.find("thead th[data-key]"), function (index, elem) {
              var currentTh = $(elem);
              if (th.data("key") != currentTh.data("key")) {
                  currentTh
                  .removeClass("asc")
                  .removeClass("desc");
              };
          }); /* check if any of the th elements has the "asc" or "desc" class and remove, if yes. */
          sortKey = th.data("key");

  
          if (th.hasClass ("asc")) {
              sortDirection ="desc";
              th.removeClass("asc").addClass("desc");
          } else {
            sortDirection ="asc";
              th.removeClass("desc").addClass("asc");
          }
          /* if the column is already assigned to "asc" or "desc" class, it swithces to the other class. */
          
          
          refreshTicketList();
          /* this does the actual filtering by rendering the table one way if the class is "asc" and the other way if not. */
      }); 

      // Refresh the data from the server
      refreshTicketList();

      ticketListTable.on("ticketDataChanged", function (){
        refreshTicketList();
      });
});

window.currentEvent = null;

function refreshTicketPage (){
    $("#newTicketModal").modal("hide");
    $("#ticket-list").trigger("ticketDataChanged");
}

function openNewTicketModal() {
    $("#newTicketModal").modal("show");
}

function setEventDetails(event) {
    $("#event").val(event.title);
    $("#time").val(event.time);
}

$.getJSON("http://localhost:3000/events")
.done(function(events){
    var select = $("#eventId")
                    .on("change", function(ev) {
                        var event = $(this)
                                    .find("option:selected")
                                    .data("event");
                        setEventDetails(event);
                    });
    var select = $("#eventId");               
    var reg = /\?.*event\=([0-9]*)/
    try {
        var eventId = window.location.toString().match(reg)[1];
    }
    catch(err) {
        eventId = 0;
    }
    $.each(events, function (index, event){
        var option = $("<option />");
        option.data("event", event);
        option.val(event.id);
        option.text(event.title);
        if (event.id == eventId) {
            option.prop("selected", true)
            setEventDetails(event);
        }
        select.append(option);
    });
});

$("#newTicketForm").sendForm();