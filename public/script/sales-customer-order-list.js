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
            }
            else if (table.rows({ selected: true}).count() == 0)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_button").prop("disabled", true);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_button").prop("disabled", false);
        }
    });

	$("#sales_order_list_table tbody").on("click", "tr td", function () 
	{
		if ($(this).index() != 0) 
		{   
			var po = $(this).closest("tr").children().eq(1).text();
			$.get('/sales-get-sale', {po: po}, function(result) {
				var id = result.CustomerOrderID;
				var name = result.CustomerName;
				var ordered = result.DateOrdered;
				var pickup = result.PickupDate;
				var physical = result.Physical;
				var online = result.Online;
				var products = result.ProductNames;
				var unitprices = result.ProductUnitPrices;
				var quantities = result.ProductQuantities;
				var prices = result.ProductPrices;
				var total = result.TotalPrice
				
				$("#details_modal").modal("show");
				$("#sales_products").find("tbody").detach();
				$("#sales_products").append($("<tbody>")); 
				$("#customer_po").val(po);
				$("#customer_order_id").val(id);
				$("#customer_name").val(name);
				$("#date_ordered").val(ordered);
				$("#pickup_date").val(pickup);
				
				if(physical == "on")
				{
					$("#physical_checkbox").prop("checked", true);
					$("#online_checkbox").prop("checked", false);
				}
				else if(online == "on")
				{
					$("#online_checkbox").prop("checked", true);
					$("#physical_checkbox").prop("checked", false);
				}
				else
				{
					$("#physical_checkbox").prop("checked", false);
					$("#online_checkbox").prop("checked", false);
				}
						
				for(var i = 0; i < products.length; i++) 
				{ 
					$("#sales_products").last().append(`<tr><td><input type="string" class="form-control-file" id="products_name" readonly></td><td><input type="number" class="form-control-file" id="products_unit_price" readonly></td><td><input type="number" class="form-control-file" id="products_quantity" readonly></td><td><input type="number" class="form-control-file" id="products_amount" readonly></td></tr>`);
					$("#sales_products tbody").children().eq(i).find("#products_name").val(products[i]);
					$("#sales_products tbody").children().eq(i).find("#products_unit_price").val(unitprices[i]);
					$("#sales_products tbody").children().eq(i).find("#products_quantity").val(quantities[i]);
					$("#sales_products tbody").children().eq(i).find("#products_amount").val(prices[i]);
				}
				
				$("#total").val(total);
			});
		}
	});

    //proceed
    $("#proceed_button").on("click", function () 
    {
        $("#details_modal").modal("hide");
		var po = $("#details_modal").find("#customer_po").val();
		$.get('/sales-get-sale', {po: po}, function(result) {
			if (result.Status == "packing")
			{
				$("#tracker_status_onroute_modal").modal("show");
				$("#tracker_status_onroute_modal").find("#onroute_po").val(po);
				$("#tracker_status_onroute_modal").find("#onroute_date_ordered").val(result.DateOrdered);
				$("#tracker_status_onroute_modal").find("#onroute_customer_name").val(result.CustomerName);
				$("#tracker_status_onroute_modal").find("#onroute_status").val(result.Status);
			}
			else if (result.Status == "delivering")
			{
				$("#tracker_status_delivered_modal").modal("show");
				$("#tracker_status_delivered_modal").find("#delivered_po").val(po);
				$("#tracker_status_delivered_modal").find("#delivered_date_ordered").val(result.DateOrdered);
				$("#tracker_status_delivered_modal").find("#delivered_customer_name").val(result.CustomerName);
				$("#tracker_status_delivered_modal").find("#delivered_status").val(result.Status);
			}
		});
    });
    
	//change status to delivering
	$("#onroute_confirm_button").on("click", function () 
    {
		var po = $("#tracker_status_onroute_modal").find("#onroute_po").val();
		$("#tracker_status_onroute_modal").modal("hide");
		$.post('/sales-update-status', {po: po, type: "onroute"});
		window.location.reload(true);
    });
	
	//change status to delivered
	$("#delivered_confirm_button").on("click", function () 
    {
		var po = $("#tracker_status_delivered_modal").find("#delivered_po").val();
		$("#tracker_status_delivered_modal").modal("hide");
		$.post('/sales-update-status', {po: po, type: "delivering"});
		window.location.reload(true);
    });
	
    //add
    $("#delete_button").on("click", function () 
    {
		$("#delete_sale_modal_table").find("tbody").detach();
		$("#delete_sale_modal_table").append($("<tbody>"));
        var data = table.rows(".selected").data();
		for(var i = 1; i <= data.length; i++)
        {
            $("#delete_sale_modal_table tbody").append(`<tr><td><input type="string" class="form-control-file" id="delete_po` + i + `" readonly></td><td><input type="string" class="form-control-file" id="delete_date_ordered` + i + `" readonly></td><td><input type="string" class="form-control-file" id="delete_customer_name` + i + `" readonly></td><td><input type="string" class="form-control-file" id="delete_status` + i + `" readonly></td></tr>`);
        }
		
		for(var i = 0; i < data.length; i++)
        {
			$("#delete_sale_modal").modal("show");
			$("#delete_sale_modal").find("#delete_po" + (i + 1)).val(data[i][1]);
			$("#delete_sale_modal").find("#delete_date_ordered" + (i + 1)).val(data[i][2]);
			$("#delete_sale_modal").find("#delete_customer_name" + (i + 1)).val(data[i][3]);
			$("#delete_sale_modal").find("#delete_status" + (i + 1)).val(data[i][4]);
		}
    });
	
	$("#delete_confirm_button").on("click", function () 
    {
		var count = table.rows(".selected").data().length;
        var data = table.rows(".selected").data();
        var tempSalesPO = [];
        //if only one item is selected
        if(count == 1) 
        {
            tempSalesPO = data[0][1];
			$("#delete_sale_modal").modal("hide");
            $.post("/sales-delete-one-product", {tempSalesPO});
        }
        //if only multiple items are selected
        else 
        {
            for(var i = 0; i < count; i++) 
            {
                tempSalesPO[i] = data[i][1];
            }
            var SalesPO = JSON.stringify(tempSalesPO);
			$("#delete_sale_modal").modal("hide");
            $.post("/sales-delete-many-products", {SalesPO});
        }
		
		table.rows(".selected").remove().draw(false);
    });
	
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