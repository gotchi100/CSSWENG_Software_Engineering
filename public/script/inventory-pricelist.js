$(document).ready(function () 
{
    getCurrentDate();
    
    let table = $("#inventory_pricelist_table").DataTable( 
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
            $("#edit_modal_button").prop("disabled", false);
            $("#delete_modal_button").prop("disabled", true);
        } 
        else 
        {
            table.rows().select();
            $("th.select-checkbox").addClass("selected");
            $("#edit_modal_button").prop("disabled", true);
        }
    }).on("select deselect", function() 
    {
        if (table.rows({ selected: true}).count() !== table.rows().count()) 
        {
            if(table.rows({ selected: true}).count() > 1)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", true);
                $("#delete_modal_button").prop("disabled", false);
            }
            else if (table.rows({ selected: true}).count() == 0)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", true);
                $("#delete_modal_button").prop("disabled", true);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", false);
                $("#delete_modal_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_modal_button").prop("disabled", false);
        }
    });
    
    var ProductNameTaken = false;

    // edit data
    $("#edit_modal_button").on("click", function () 
    {
        // get value from table
        var id =  $(".selected").closest("tr").children().eq(1).text();
        var name =  $(".selected").closest("tr").children().eq(2).text();
        var price =  $(".selected").closest("tr").children().eq(3).text();
        var buying_price =  $(".selected").closest("tr").children().eq(4).text();

        $("#edit_product_id").val(id);
        $("#edit_product_name").val(name);
        $("#edit_selling_price").val(price);
        $("#edit_buying_price").val(buying_price);
    });

    $("#edit_product_button").on("click", async function () 
    {
        var ProductId = $(".selected").closest("tr").children().eq(1).text();
        var OldProductName = $(".selected").closest("tr").children().eq(2).text();
        var ProductName =  $("#edit_product_name").val();
        var BuyingPrice = $("#edit_buying_price").val();
        var SellingPrice = $("#edit_selling_price").val();

        var checkSellingPrice = checkNumberInput($("#edit_selling_price").val());
        var checkBuyingPrice = checkNumberInput($("#edit_buying_price").val());

        var value = await checkProductName(ProductName);

        if(OldProductName == ProductName) 
        {
            value = "available";
        }

        if(value == "unavailable" || ProductName == "" || !checkSellingPrice || !checkBuyingPrice) 
        {
            if(value == "unavailable") 
            {
                ProductNameTaken = true;
            }
            else 
            {
                ProductNameTaken = false;
            }
            $("#edit_error_modal_text").text("There are some errors on the form! Please try to avoid using an existing product name and numbers less than 0 for inputs that accept numbers.");
            
            $("#edit_error_modal").modal("show");
        }
        else if(value == "available" && checkSellingPrice && checkBuyingPrice)
        {
                ProductNameTaken = false;
                $.post("/inventory-edit-product", {ProductId, ProductName, SellingPrice, BuyingPrice}, function(data, status) 
                {
                    console.log("POST - Edit Product - Status: " + status);
    
                    table.rows(".selected").remove().draw(false);
                    table.row.add(["", ProductId, ProductName, SellingPrice, BuyingPrice]).draw(false);
        
                    $("#edit_modal_button").prop("disabled", true);
                    $("#delete_modal_button").prop("disabled", true);
                    $("#edit_modal").modal("hide");
                })
        }
    });

    $("#close_edit_error_modal").on("click", function () 
    {
        if($("#edit_product_name").val() == "" || ProductNameTaken == true) 
        {
            $("#edit_product_name_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#edit_selling_price").val())) 
        {
            $("#edit_selling_price_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#edit_buying_price").val())) 
        {
            $("#edit_buying_price_error").text("Unavailable!");
        }
        
    })
    
    $("#close_edit_modal").on("click", function () 
    {
        $("#edit_product_name").val("");
        $("#edit_selling_price").val("");
        $("#edit_buying_price").val("");
        clearEditErrors();
    })

    // delete data
    $("#delete_button").on("click", function () 
    {
        var count = table.rows(".selected").data().length;
        var data = table.rows( { selected: true } ).data();
        var tempProductId = [];
        //if only one item is selected
        if(count == 1) 
        {
            tempProductId = data[0][1];
            $.post("/inventory-delete-one-product", {tempProductId}, function(data, status) 
            {
                console.log("POST - Delete One Product - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        //if only multiple items are selected
        else 
        {
            for(var i = 0; i < count; i++) 
            {
                tempProductId[i] = data[i][1];
            }
            var ProductId = JSON.stringify(tempProductId);
            $.post("/inventory-delete-many-product", {ProductId}, function(data, status) 
            {
                console.log("POST - Delete Many Products - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        $("#edit_modal_button").prop("disabled", true);
        $("#delete_modal_button").prop("disabled", true);
        $("#delete_modal").modal("hide");
    })

    function checkNumberInput(Number) 
    {
        if(Number > 0) 
        {
            return true;
        }
        else 
        {
            return false;
        }
    }

    function checkProductName(ProductName) 
    {
        return new Promise((resolve, reject) => 
        {
            $.get("/is-product-available", {ProductName: ProductName}, function(result) 
            {

                if(result) 
                {
                    resolve("unavailable");
                }
                else 
                {
                    $("#add_product_name_error").text("");
                    resolve("available");
                }
    
                reject("Error occured");
            }); 
        });
    }

    function clearEditErrors() 
    {
        $("#edit_product_name_error").text("");
        $("#edit_selling_price_error").text("");
        $("#edit_buying_price_error").text("");
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
    }

});