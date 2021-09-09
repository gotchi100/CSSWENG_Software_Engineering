$(document).ready(function () 
{
    getCurrentDate(); // display current date in header
    var productsRowCount = 1;
    var deleteRowCount = 1;

    let table = $("#reorder_supplier_order_list_table").DataTable( 
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

    table.on("click", "th.select-checkbox", function() 
    {
        if ($("th.select-checkbox").hasClass("selected")) 
        {
            table.rows().deselect();
            $("th.select-checkbox").removeClass("selected");
            $("#delete_modal_button").prop("disabled", true);
        } 
        else 
        {
            table.rows().select();
            $("th.select-checkbox").addClass("selected");
        }
    })
    .on("select deselect", function() 
    {
        if (table.rows({ selected: true}).count() !== table.rows().count()) 
        {
            if(table.rows({ selected: true}).count() > 1)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_modal_button").prop("disabled", false);
            }
            else if (table.rows({ selected: true}).count() == 0)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_modal_button").prop("disabled", true);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#delete_modal_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_modal_button").prop("disabled", false);
        }
    });

    // an item in table is clicked
    $("#reorder_supplier_order_list_table tbody").on("click", "tr td", function () 
    {
        if ($(this).index() != 0) 
        {    
            var PONumber = $(this).closest("tr").children().eq(1).text();
            $.get('/reorder-get-one-supplier-po', {PONumber}, function(result) {

                if(result)
                {
                    $("#supplier_po").val(result.SupplierPO.PO);
                    $("#supplier_email").val(result.Supplier.Email);
                    $("#supplier_address").val(result.Supplier.Address);
                    $("#supplier_name").val(result.Supplier.Name);
                    $("#supplier_number").val(result.Supplier.Number);
                    $("#mode_of_payment").append("<option>" + result.SupplierPO.ModeOfPayment + "</option>")

                    if(result.SupplierPO.Status == "Ordering")
                    {
                        $("#proceed_button").prop("disabled", false);
                    }
                    else
                    {
                        $("#proceed_button").prop("disabled", true);
                    }

                    addProductRows(result.SupplierPO.Products.length);
                    populateTable(result.SupplierPO.Products);
                    
                    $("#details_modal").modal("show");
                }
                else
                {
                    console.log("Result not found");
                }
            });
        }
    });

    // close details popup
    $("#close_details_modal").on("click", function() 
    {
        clearPopupDetails();
    })

    // update status
    $("#proceed_button").on("click", function()
    {
        $("#details_modal").modal("hide");
        var PONumber = $("#supplier_po").val();
        $.get('/reorder-get-one-supplier-po', {PONumber}, function(result) {

            if(result)
            {
                $("#proceed_supplier_po").text(result.SupplierPO.PO);
                $("#proceed_date_ordered").text(result.SupplierPO.DateOrdered);
                $("#proceed_supplier_name").text(result.SupplierPO.SupplierName);
                $("#proceed_status").text(result.SupplierPO.Status);
                $("#proceed_modal").modal("show");
            }
        });
    });

    $("#confirm_button").on("click", function()
    {
        var data = table.rows().data()
        var PONumber = $("#proceed_supplier_po").text();

        for(var i = 0; i < data.length; i++)
        {
            if(data[i][1] == PONumber)
            {
                var SupplierPOInfo = {
                    PONumber: PONumber,
                    Status: "Received"

                }
                
                $.post('/reorder-update-status', {SupplierPOInfo}, function()
                {
                    table.row(i).remove().draw(false); 
                    table.row.add(["", PONumber, $("#proceed_date_ordered").text(), $("#proceed_supplier_name").text(), 
                                "Recieved"]).draw(false);

                    $("#proceed_modal").modal("hide");
                });
               break;
            }
        }
    });

    $("#cancel_proceed_modal_button").on("click", function()
    {
        $("#details_modal").modal("show");
    })

    // delete data in database
    $("#delete_button").on("click", function () 
    {
        var count = table.rows(".selected").data().length;
        var data = table.rows(".selected").data();
        var PONumber = [];
        //if only one item is selected
        if(count == 1) 
        {
            PONumber = data[0][1];
            $.post("/reorder-delete-one-po", {PONumber}, function(data, status) 
            {
                console.log("POST - Delete One Supplier PO - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        //if only multiple items are selected
        else 
        {
            for(var i = 0; i < count; i++) 
            {
                PONumber[i] = data[i][1];
            }
            var PONumberArr = JSON.stringify(PONumber);
            $.post("/reorder-delete-many-po", {PONumberArr}, function(data, status) 
            {
                console.log("POST - Delete Many Supplier PO - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        $("delete_modal").modal("hide");
    });

    // delete popup
    $("#delete_modal_button").on("click", function() 
    {
        var data = table.rows(".selected").data();
        deletePopupAddRows(data.length);

        for(var i = 0; i < data.length; i++)
        {
            $("#supplier_po" + (i + 1)).text(data[i][1]);
            $("#date_ordered" + (i + 1)).text(data[i][2]);
            $("#supplier_name" + (i + 1)).text(data[i][3]);
            $("#status" + (i + 1)).text(data[i][4]);
        }
    });

    // close delete popup
    $("#cancel_delete_modal_button").on("click", function()
    {
        clearDeletePopupRows()
    });

    // delete popup functions
    function deletePopupAddRows(length)
    {
        for(var i = 2; i <= length; i++)
        {
            deleteRowCount++;
            $("#delete_modal_table tbody tr:last").after("<tr>" +
                "<td id=\"supplier_po" + deleteRowCount + "\"></td>" +
                "<td id=\"date_ordered" + deleteRowCount + "\"></td>" +
                "<td id=\"supplier_name" + deleteRowCount + "\"></td>" +
                "<td id=\"status" + deleteRowCount + "\"></td>" +
                "</tr>");
        }
    }

    function clearDeletePopupRows()
    {
        $("#supplier_po1").text("");
        $("#date_ordered1").text("");
        $("#supplier_name1").text("");
        $("#status1").text("");

        while(deleteRowCount != 1)
        {
            deleteRowCount--;
            $("#delete_modal_table tbody tr:last").remove();
        }
    }

    // details popup functions
    function clearPopupDetails() 
    {
        $("#supplier_po").val("");
        $("#supplier_email").val("");
        $("#supplier_address").val("");
        $("#supplier_name").val("");
        $("#supplier_number").val("");
        $("#mode_of_payment > option").remove();

        while(productsRowCount != 1)
        {
            deleteProductRows();
        }

        $("#product_name1").val("");
        $("#unit_price1").val("");
        $("#quantity1").val("");
        $("#amount1").val("");
        $("#total_amount").text("");

    }

    function addProductRows(length) 
    {
        for(var i = 2; i <= length; i++)
        {
            productsRowCount++;
            $("#reorder_details_table tbody tr:last").after("<tr><td>" + 
            "<select class=\"form-control-file\" id=\"product_name" + productsRowCount + "\">" +
            " </select>" +
            "</td><td>" +
    
            "<input type=\"number\" class=\"form-control-file\" id=\"unit_price" + productsRowCount + "\"readonly></input>" +
            "</td><td>" +
    
            "<input type=\"number\" class=\"form-control-file\" id=\"quantity" + productsRowCount + "\"readonly>" +
            "</td><td>" +
    
            "<input type=\"number\" class=\"form-control-file\" id=\"amount" + productsRowCount + "\"readonly></input>" +
            "</td></tr>");
        }
    }

    function deleteProductRows()
    {
        productsRowCount--;
        $("#reorder_details_table tbody tr:last").remove();
    }

    function populateTable(products) {
        var totalAmount = 0;
        for(var i = 0; i < products.length; i++)
        {
            $("#product_name" + (i + 1)).append("<option>" + products[i].ProductName + "</option>");
            $("#unit_price" + (i + 1)).val(products[i].UnitPrice)
            $("#quantity" + (i + 1)).val(products[i].Quantity)
            $("#amount" + (i + 1)).val(products[i].Amount);
            totalAmount += products[i].Amount;
        }
        $("#total_amount").text(totalAmount)

    }

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