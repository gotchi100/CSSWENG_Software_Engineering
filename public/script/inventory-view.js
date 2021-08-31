$(document).ready(function () 
{
    getCurrentDate();
    
    let table = $("#inventory_view_table").DataTable( 
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

    $("#inventory_view_table tbody").on("click", "tr td", function () 
    {
        if ($(this).index() != 0) 
        { 
            var name = $(this).closest("tr").children().eq(2).text();
            var price = $(this).closest("tr").children().eq(4).text();
            var quantity = $(this).closest("tr").children().eq(5).text();

            //add here
            var variations = "";    

            $("#details_modal").modal("show");
            $("#details_product_name span").text(name);
            $("#details_price span").text(price);
            $("#details_quantity span").text(quantity);
            $("#details_variations span").text(variations); 
             
        }
    });

    var ProductNameTaken = false;

    // add data
    $("#add_product_button").on("click", async function () 
    {
        var ProductName = $("#add_product_name").val();
        var Brand = $("#add_brand").val();
        var BuyingPrice = $("#add_buying_price").val();
        var SellingPrice = $("#add_selling_price").val();
        var Quantity = $("#add_quantity").val();
        var ReorderPoint = $("#add_reorder_point").val();

        var checkBuyingPrice = checkNumberInput($("#add_buying_price").val());
        var checkSellingPrice = checkNumberInput($("#add_selling_price").val());
        var checkQuantity = checkNumberInput($("#add_quantity").val());
        var checkReorderPoint = checkNumberInput($("#add_reorder_point").val());

        var value = await checkProductName(ProductName);

        if(value == "unavailable" || ProductName == "" || Brand == "" || !checkBuyingPrice || !checkSellingPrice || !checkQuantity || !checkReorderPoint) 
        {
            if(value == "unavailable") 
            {
                ProductNameTaken = true;
            }
            else 
            {
                ProductNameTaken = false;
            }
            $("#add_error_modal_text").text("There are some errors on the form! Please try to avoid using an existing product name and numbers less than 0 for inputs that accept numbers.");
            clearAddErrors();
            $("#add_error_modal").modal("show");
        }
        else if(value == "available" && checkBuyingPrice && checkSellingPrice && checkQuantity && checkReorderPoint)
        {
                ProductNameTaken = false;
                $.post("/inventory-add-product", {ProductName, Brand, BuyingPrice, SellingPrice, Quantity, ReorderPoint}, function(data, status) 
                {
                    console.log("POST - Add Product - Status: " + status);
        
                    var Availability = getAvailability(Quantity, ReorderPoint); 
                    
        
                    table.row.add(["", data.ProductId, ProductName, Brand, SellingPrice, Quantity, ReorderPoint, Availability]).draw(false);
        
                    $("#add_product_name").val("");
                    $("#add_brand").val("");
                    $("#add_buying_price").val("");
                    $("#add_selling_price").val("");
                    $("#add_quantity").val("");
                    $("#add_reorder_point").val("");
                    clearAddErrors();
                    $("#add_modal").modal("hide");
                })
        }
    });

    $("#close_add_error_modal").on("click", function () 
    {
        if($("#add_product_name").val() == "" || ProductNameTaken == true) 
        {
            $("#add_product_name_error").text("Unavailable!");
        }
        if($("#add_brand").val() == "") 
        {
            $("#add_brand_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#add_buying_price").val())) 
        {
            $("#add_buying_price_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#add_selling_price").val())) 
        {
            $("#add_selling_price_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#add_quantity").val())) 
        {
            $("#add_quantity_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#add_reorder_point").val())) 
        {
            $("#add_reorder_point_error").text("Unavailable!");
        }
        
    })
    
    $("#close_add_modal").on("click", function () 
    {
        $("#add_product_name").val("");
        $("#add_brand").val("");
        $("#add_buying_price").val("");
        $("#add_selling_price").val("");
        $("#add_quantity").val("");
        $("#add_reorder_point").val("");
        clearAddErrors();
    })

    // edit data
    $("#edit_modal_button").on("click", function () 
    {
        // get value from table
        var ProductId = $(".selected").closest("tr").children().eq(1).text();
        var ProductName =  $(".selected").closest("tr").children().eq(2).text();
        var Brand =  $(".selected").closest("tr").children().eq(3).text();
        var SellingPrice =  $(".selected").closest("tr").children().eq(4).text();
        var Quantity =  $(".selected").closest("tr").children().eq(5).text();
        var ReorderPoint =  $(".selected").closest("tr").children().eq(6).text();

        $("#edit_product_name").val(ProductName);
        $("#edit_brand").val(Brand);
        $("#edit_price").val(SellingPrice);
        $("#edit_quantity").val(Quantity);
        $("#edit_reorder_point").val(ReorderPoint);
    });

    $("#edit_product_button").on("click", async function () 
    {
        var ProductId = $(".selected").closest("tr").children().eq(1).text();
        var OldProductName = $(".selected").closest("tr").children().eq(2).text();
        var ProductName =  $("#edit_product_name").val();
        var Brand = $("#edit_brand").val();
        var SellingPrice = $("#edit_price").val();
        var Quantity = $("#edit_quantity").val();
        var ReorderPoint = $("#edit_reorder_point").val();

        var checkSellingPrice = checkNumberInput($("#edit_price").val());
        var checkQuantity = checkNumberInput($("#edit_quantity").val());
        var checkReorderPoint = checkNumberInput($("#edit_reorder_point").val());

        var value = await checkProductName(ProductName);

        if(OldProductName == ProductName) 
        {
            value = "available";
        }

        if(value == "unavailable" || ProductName == "" || Brand == "" || !checkSellingPrice || !checkQuantity || !checkReorderPoint) 
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
        else if(value == "available" && checkSellingPrice && checkQuantity && checkReorderPoint)
        {
                ProductNameTaken = false;
                $.post("/inventory-edit-product", {ProductId, ProductName, Brand, SellingPrice, Quantity, ReorderPoint}, function(data, status) 
                {
                    console.log("POST - Edit Product - Status: " + status);
        
                    var Availability = getAvailability(Quantity, ReorderPoint); 

                    table.rows(".selected").remove().draw(false);
                    table.row.add(["", ProductId, ProductName, Brand, SellingPrice, Quantity, ReorderPoint, Availability]).draw(false);
        
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
        if($("#edit_brand").val() == "") 
        {
            $("#edit_brand_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#edit_selling_price").val())) 
        {
            $("#edit_selling_price_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#edit_quantity").val())) 
        {
            $("#edit_quantity_error").text("Unavailable!");
        }
        if(!checkNumberInput($("#edit_reorder_point").val())) 
        {
            $("#edit_reorder_point_error").text("Unavailable!");
        }
        
    })

    $("#close_edit_modal").on("click", function () 
    {
        $("#edit_product_name").val("");
        $("#edit_brand").val("");
        $("#edit_selling_price").val("");
        $("#edit_quantity").val("");
        $("#edit_reorder_point").val("");
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

    function getAvailability(Quantity, ReorderPoint) 
    {
        if(Quantity > ReorderPoint + 10) 
        {
            return "High"; 
        }else if(Quantity > ReorderPoint + 5) 
        {
            return "Medium"; 
        }else if(Quantity <= ReorderPoint) 
        {
            return "Low";
        } 
    }

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
            $.get("/check-product-name", {ProductName: ProductName}, function(result) 
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

    function clearAddErrors() 
    {
        $("#add_product_name_error").text("");
        $("#add_brand_error").text("");
        $("#add_buying_price_error").text("");
        $("#add_selling_price_error").text("");
        $("#add_quantity_error").text("");
        $("#add_reorder_point_error").text("");
    }

    function clearEditErrors() 
    {
        $("#edit_product_name_error").text("");
        $("#edit_brand_error").text("");
        $("#edit_selling_price_error").text("");
        $("#edit_quantity_error").text("");
        $("#edit_reorder_point_error").text("");
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