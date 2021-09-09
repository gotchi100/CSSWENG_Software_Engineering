$(document).ready(function () 
{
    getCurrentDate(); // get current date

    let table = $("#sales_order_list_table").DataTable( 
    {
        columnDefs: [{
                    orderable: false,
                    className: "select-checkbox",
                    targets: 0
                    }],
        select: {
                style: "os",
                selector: "td:first-child"
                },
        order: [
                [1, "asc"]
                ]
    });

    table.on("click", "th.select-checkbox", function() {
    if ($("th.select-checkbox").hasClass("selected")) 
    {
        table.rows().deselect();
        $("th.select-checkbox").removeClass("selected");
        $("#delete_button").prop("disabled", true);
        $("#edit_button").prop("disabled", true);
    } 
    else 
    {
        table.rows().select();
        $("th.select-checkbox").addClass("selected");
    }
    }).on("select deselect", function() {
        if (table.rows({ selected: true}).count() !== table.rows().count()) 
        {
            if(table.rows({ selected: true}).count() > 1)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_button").prop("disabled", false);
				$("#edit_button").prop("disabled", false);
            }
            else if (table.rows({ selected: true}).count() == 0)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_button").prop("disabled", true);
				$("#edit_button").prop("disabled", true);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_button").prop("disabled", false);
				$("#edit_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_button").prop("disabled", true);
			$("#edit_button").prop("disabled", true);
        }
    });

   
    //proceed
    $("#proceed_button").on("click", function () 
    {
        $("#details_modal").modal("hide");
        $("#tracker_status_onroute_modal").modal("show");
		$("#tracker_status_onroute_modal").find("#packing_po").text($("#details_modal").find("#customer_po").text());
    });
    
    //add
    $("#edit_button").on("click", function () 
    {
        
    });

    /*
			var po = $(this).closest("tr").children().eq(1).text();
			
			
	*/
    function getCurrentDate() {
        var months = new Array();
        months[0] = "January";
        months[1] = "February";
        months[2] = "March";
        months[3] = "April";
        months[4] = "May";
        months[5] = "June";
        months[6] = "July";
        months[7] = "August";
        months[8] = "September";
        months[9] = "October";
        months[10] = "November";
        months[11] = "December";
      
        var date = new Date();
        var day = date.getDate();
        var month = months[date.getMonth()];
        var year = date.getFullYear();

        $("#current-date").html(day + " " + month + " " + year);
    };

});