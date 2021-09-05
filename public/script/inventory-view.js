$(document).ready(function () 
{
    getCurrentDate();
    var addProductRowCount = 1;
    var editProductRowCount = 1;
    var addProductNameTaken;
    var editProductNameTaken;
    var parser = new DOMParser;

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
            $("#edit_modal_button").prop("disabled", true);
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
                $("#edit_modal_button").prop("disabled", false);
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
            $("#edit_modal_button").prop("disabled", false);
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

    // add data
    $("#add_product_button").on("click", async function () 
    {

        var checkError = await checkAddInputErrors();
        var checkDuplicate = checkAddDuplicates();

        if(checkError == true || checkDuplicate == true) 
        {
            if(checkDuplicate == true)
            {
                $("#duplicate_error_modal_text").text("There are products with the same product name and color.");
                clearAddErrors();
                $("#duplicate_error_modal").modal("show");

            }
            else
            {
                $("#add_error_modal_text").text("There are some errors on the form! Please try to avoid using an existing product name and numbers less than 0 for inputs that accept numbers.");
                clearAddErrors();
                $("#add_error_modal").modal("show");
            }
        }
        else 
        {   var ProductInfo = [];

            for(var i = 1; i <= addProductRowCount; i++) 
            {
                var temp = {
                    ProductId: "",
                    ProductName: $("#add_product_name" + i).val(),
                    Brand: $("#add_brand" + i).val(),
                    Color: $("#add_color" + i).val(),
                    BuyingPrice: $("#add_buying_price" + i).val(),
                    SellingPrice: $("#add_selling_price" + i).val(),
                    Quantity: $("#add_quantity" + i).val(),
                    ReorderPoint: $("#add_reorder_point" + i).val()
                }
                ProductInfo.push(temp);
            }

            if(addProductRowCount == 1)
            {
                $.post("/inventory-add-one-product", {ProductInfo}, function(data, status) 
                {
                    console.log("POST - Add One Product - Status: " + status);
        
                    var Availability = getAvailability(data.Quantity, data.ReorderPoint); 
                    table.row.add(["", data.ProductId, data.ProductName, data.Brand, data.Color, 
                                data.SellingPrice, data.Quantity, data.ReorderPoint, Availability]).draw(false);
                });
            }
            else
            {
                $.post("/inventory-add-many-products", {ProductInfo}, function(data, status) 
                {
                    console.log("POST - Add Many Products - Status: " + status);

                    var Availability;
                    for(var i = 0; i < data.length; i++) {
                        Availability = getAvailability(data[i].Quantity, data[i].ReorderPoint); 
                        table.row.add(["", data[i].ProductId, data[i].ProductName, data[i].Brand, data[i].Color, 
                                    data[i].SellingPrice, data[i].Quantity, data[i].ReorderPoint, Availability]).draw(false);
                    }
                });
            }
            
            clearAddErrors();
            clearAddInputs();
            while(addProductRowCount != 1) {
                addProductDeleteRow();
            }
            $("#add_modal").modal("hide");
                
        }
    });

    $("#close_add_modal").on("click", function () 
    {
        clearAddErrors();
        clearAddInputs();
        while(addProductRowCount != 1) {
            addProductDeleteRow();
        }
    })

    $("#close_add_error_modal").on("click", setAddInputErrors);

    $("#add_product_add_row_button").on("click", addProductAddRow);

    $("#add_product_delete_row_button").on("click", addProductDeleteRow);

    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#add_product_table td:last").text("");
        
        $("#add_product_table tr:last").after("<tr><td>" + 
        "<input type=\"text\" class=\"form-control-file\" id=\"add_product_name" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_product_name_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
    
        "<input type=\"text\" class=\"form-control-file\" id=\"add_brand" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_brand_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
    
        "<input type=\"text\" class=\"form-control-file\" id=\"add_color" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_color_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
        
        "<input type=\"text\" class=\"form-control-file\" id=\"add_selling_price" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_selling_price_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
        
        "<input type=\"text\" class=\"form-control-file\" id=\"add_buying_price" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_buying_price_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
        
        "<input type=\"text\" class=\"form-control-file\" id=\"add_quantity" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_quantity_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
        
        "<input type=\"text\" class=\"form-control-file\" id=\"add_reorder_point" + addProductRowCount + "\">" +
        "<p class=\"text-danger\" id=\"add_reorder_point_error" + addProductRowCount + "\"></p>" +
        "</td><td>" +
    
        "<div class=\"d-flex\">" +
        "<button type=\"button\" class=\"btn btn-secondary mr-2\" id=\"add_product_add_row_button\"><span class=\"fas fa-plus\"></span></button>" +
        "<button type=\"button\" class=\"btn btn-secondary\" id=\"add_product_delete_row_button\"><span class=\"fas fa-trash\"></span></button>" +
        
        "</div></td></tr>");
    
        $("#add_product_add_row_button").on("click", addProductAddRow);
        $("#add_product_delete_row_button").on("click", addProductDeleteRow);
        
        if(addProductRowCount == 1) {
            $("#add_product_delete_row_button").prop("disabled", false);
        }
    
    }
    
    function addProductDeleteRow() 
    {
        addProductRowCount--;
    
        $("#add_product_table tr:last").remove();
        $("#add_product_table td:last").remove();
        $("#add_product_table tr:last").append("<td>" +
            "<div class=\"d-flex\">" +
            "<button type=\"button\" class=\"btn btn-secondary mr-2\" id=\"add_product_add_row_button\"><span class=\"fas fa-plus\"></span></button>" +
            "<button type=\"button\" class=\"btn btn-secondary\" id=\"add_product_delete_row_button\"><span class=\"fas fa-trash\"></span></button>" +
            "</div></td>");
    
         $("#add_product_add_row_button").on("click", addProductAddRow);
         $("#add_product_delete_row_button").on("click", addProductDeleteRow);
    
         if(addProductRowCount == 1) {
            $("#add_product_delete_row_button").prop("disabled", true);
        }
    }

    function clearAddErrors() 
    {
        for(var i = 1; i <= addProductRowCount; i++) {
            $("#add_product_name_error" + i).text("");
            $("#add_brand_error" + i).text("");
            $("#add_color_error" + i).text("");
            $("#add_buying_price_error" + i).text("");
            $("#add_selling_price_error" + i).text("");
            $("#add_quantity_error" + i).text("");
            $("#add_reorder_point_error" + i).text("");
        }
    }

    function clearAddInputs() 
    {
        for(var i = 1; i <= addProductRowCount; i++) {
            $("#add_product_name" + i).val("");
            $("#add_brand" + i).val("");
            $("#add_color" + i).val("");
            $("#add_buying_price" + i).val("");
            $("#add_selling_price" + i).val("");
            $("#add_quantity" + i).val("");
            $("#add_reorder_point" + i).val("");        
        }
    }

    async function checkAddInputErrors() 
    {
        var ProductName, Brand, Color, BuyingPrice, SellingPrice, Quantity, ReorderPoint;
        var value;
        var err = false;
        addProductNameTaken = [];
        
        for(var i = 1; i <= addProductRowCount; i++) 
        {
            ProductName = $("#add_product_name" + i).val();
            Brand = $("#add_brand" + i).val();
            Color = $("#add_color" + i).val();
            BuyingPrice = $("#add_buying_price" + i).val();
            SellingPrice = $("#add_selling_price" + i).val();
            Quantity = $("#add_quantity" + i).val();
            ReorderPoint = $("#add_reorder_point" + i).val();
            addProductNameTaken[i-1] = false;
            if(ProductName != "") {
                value = await isProductAvailable(ProductName, Color);
            }

            if(value == "unavailable" || ProductName == "" || Brand == "" || Color == "" ||
                !checkNumberInput(BuyingPrice) || !checkNumberInput(SellingPrice) || 
                !checkNumberInput(Quantity) || !checkNumberInput(ReorderPoint)) 
            {
                if(value == "unavailable") 
                {
                    addProductNameTaken[i-1] = true;
                }
                else 
                {
                    addProductNameTaken[i-1] = false;
                }
                err = true;
            }
        }
        return err;
    }

    function setAddInputErrors() 
    {
        for(var i = 1; i <= addProductRowCount; i++)
        {
            if($("#add_product_name" + i).val() == "") 
            {
                $("#add_product_name_error" + i).text("Unavailable!");
            }
            else if(addProductNameTaken[i - 1] == true) 
            {
                $("#add_product_name_error" + i).text("Unavailable!");
                $("#add_color_error" + i).text("Unavailable!");
            }
            if($("#add_brand" + i).val() == "") 
            {
                $("#add_brand_error" + i).text("Unavailable!");
            }
            if($("#add_color" + i).val() == "") 
            {
                $("#add_color_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#add_buying_price" + i).val())) 
            {
                $("#add_buying_price_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#add_selling_price" + i).val())) 
            {
                $("#add_selling_price_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#add_quantity" + i).val())) 
            {
                $("#add_quantity_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#add_reorder_point" + i).val())) 
            {
                $("#add_reorder_point_error" + i).text("Unavailable!");
            }
        }

    }

    function checkAddDuplicates()
    {
        var data = [];
        for(var k = 1; k <= addProductRowCount; k++)
        {
            var temp = {
                ProductName: $("#add_product_name" + k).val(),
                Brand: $("#add_brand" + k).val(),
                Color: $("#add_color" + k).val(),
                BuyingPrice: $("#add_buying_price" + k).val(),
                SellingPrice: $("#add_selling_price" + k).val(),
                Quantity: $("#add_quantity" + k).val(),
                ReorderPoint: $("#add_reorder_point" + k).val()
            }
            data.push(temp);
        }

        for(var i = 0; i < data.length; i++)
        {
            for(var j = i+1; j < data.length; j++)
            {
                if(data[i].ProductName == data[j].ProductName && data[i].Color == data[j].Color)
                {
                    return true;
                }
            }
        }
        return false;
    }

    // edit data
    $("#edit_modal_button").on("click", function () 
    {
        editProductAddRows();
        editProductPopulateInputs();
    });

    $("#edit_product_button").on("click", async function () 
    {
        var checkError = await checkEditInputErrors();
        if(checkError == true) 
        {
            $("#edit_error_modal_text").text("There are some errors on the form! Please try to avoid using an existing product name and numbers less than 0 for inputs that accept numbers.");
            clearEditErrors();
            $("#edit_error_modal").modal("show");
        }
        else
        {
            var ProductInfo = [];

            for(var i = 1; i <= editProductRowCount; i++) 
            {
                var temp = {
                    ProductId: $("#edit_product_id" + i).val(),
                    ProductName: $("#edit_product_name" + i).val(),
                    Brand: $("#edit_brand" + i).val(),
                    Color: $("#edit_color" + i).val(),
                    SellingPrice: $("#edit_selling_price" + i).val(),
                    Quantity: $("#edit_quantity" + i).val(),
                    ReorderPoint: $("#edit_reorder_point" + i).val()
                }
                ProductInfo.push(temp);
            }

            if(editProductRowCount == 1)
            {
                $.post("/inventory-edit-one-product", {ProductInfo}, function(data, status) 
                {
                    console.log("POST - Edit One Product - Status: " + status);
            
                    Availability = getAvailability(data[0].Quantity, data[0].ReorderPoint); 
                        
                    table.rows(".selected").remove().draw(false);
                    table.row.add(["", data[0].ProductId, data[0].ProductName, data[0].Brand, data[0].Color, 
                                    data[0].SellingPrice, data[0].Quantity, data[0].ReorderPoint, Availability]).draw(false);

                    $("#edit_modal_button").prop("disabled", true);
                    $("#delete_modal_button").prop("disabled", true);
                    $("#edit_modal").modal("hide");
                })
            }
            else
            {
                $.post("/inventory-edit-many-product", {ProductInfo}, function(data, status) 
                {
                    console.log("POST - Edit Many Product - Status: " + status);
            
                    var Availability;
                    
                    table.rows(".selected").remove().draw(false);
                    
                    for(var i = 0; i < data.length; i++) {
                        Availability = getAvailability(data[i].Quantity, data[i].ReorderPoint); 
                        table.row.add(["", data[i].ProductId, data[i].ProductName, data[i].Brand, data[i].Color, 
                                    data[i].SellingPrice, data[i].Quantity, data[i].ReorderPoint, Availability]).draw(false);
                    }

                    $("#edit_modal_button").prop("disabled", true);
                    $("#delete_modal_button").prop("disabled", true);
                    $("#edit_modal").modal("hide");
                })
            }

            

        }
        
    });

    function editProductAddRows() 
    {
        var count = table.rows(".selected").data().length;
        if(count > 1) 
        {
            while(editProductRowCount != count)
            {
                editProductRowCount++;

                $("#edit_product_table tr:last").after("<tr><td>" + 

                "<input type=\"text\" class=\"form-control-file\" id=\"edit_product_id" + editProductRowCount + "\"disabled>" +
                "</td><td>" +

                "<input type=\"text\" class=\"form-control-file\" id=\"edit_product_name" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_product_name_error" + editProductRowCount + "\"></p>" +
                "</td><td>" +
            
                "<input type=\"text\" class=\"form-control-file\" id=\"edit_brand" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_brand_error" + editProductRowCount + "\"></p>" +
                "</td><td>" +
            
                "<input type=\"text\" class=\"form-control-file\" id=\"edit_color" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_color_error" + editProductRowCount + "\"></p>" +
                "</td><td>" +
                
                "<input type=\"text\" class=\"form-control-file\" id=\"edit_selling_price" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_selling_price_error" + editProductRowCount + "\"></p>" +
                "</td><td>" +
                
                "<input type=\"text\" class=\"form-control-file\" id=\"edit_quantity" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_quantity_error" + editProductRowCount + "\"></p>" +
                "</td><td>" +
                
                "<input type=\"text\" class=\"form-control-file\" id=\"edit_reorder_point" + editProductRowCount + "\">" +
                "<p class=\"text-danger\" id=\"edit_reorder_point_error" + editProductRowCount + "\"></p>" +
                "</td></tr>");
            }
        }
        
    }

    function editProductDeleteRows()
    {
        while(editProductRowCount != 1)
        {
            editProductRowCount--;
            $("#edit_product_table tr:last").remove();
        }
    }

    function editProductPopulateInputs()
    {
        var data = table.rows(".selected").data();
        var parsedName, parsedBrand, parsedColor;

        for(var i = 0; i < data.length; i++)
        {
            parsedName = parser.parseFromString(data[i][2], 'text/html').body.textContent
            parsedBrand = parser.parseFromString(data[i][3], 'text/html').body.textContent
            parsedColor = parser.parseFromString(data[i][4], 'text/html').body.textContent

            $("#edit_product_id" + (i + 1)).val(data[i][1]);
            $("#edit_product_name" + (i + 1)).val(parsedName);
            $("#edit_brand" + (i + 1)).val(parsedBrand);
            $("#edit_color" + (i + 1)).val(parsedColor);
            $("#edit_selling_price" + (i + 1)).val(data[i][5]);
            $("#edit_quantity" + (i + 1)).val(data[i][6]);
            $("#edit_reorder_point" + (i + 1)).val(data[i][7]);
        }
    }

    async function checkEditInputErrors() 
    {
        var ProductName, Brand, Color, SellingPrice, Quantity, ReorderPoint;
        var data = table.rows(".selected").data();
        var value, parsedName, parsedColor;
        var err = false;
        editProductNameTaken = [];
        for(var i = 1; i <= editProductRowCount; i++) 
        {
            ProductName = $("#edit_product_name" + i).val();
            Brand = $("#edit_brand" + i).val();
            Color = $("#edit_color" + i).val();
            SellingPrice = $("#edit_selling_price" + i).val();
            Quantity = $("#edit_quantity" + i).val();
            ReorderPoint = $("#edit_reorder_point" + i).val();
            editProductNameTaken[i-1] = false;
            if(ProductName != "") {
                value = await isProductAvailable(ProductName, Color);
            }

            
            parsedName = parser.parseFromString(data[i-1][2], 'text/html').body.textContent
            parsedColor = parser.parseFromString(data[i-1][4], 'text/html').body.textContent
            // data[i-1][2] = Product Name column
            if(ProductName == parsedName)
            {
                value = "available";
            }

            if(value == "unavailable" || ProductName == "" || Brand == "" || Color == "" ||
                !checkNumberInput(SellingPrice) || !checkNumberInput(Quantity) || !checkNumberInput(ReorderPoint)) 
            {
                if(value == "unavailable") 
                {
                    editProductNameTaken[i-1] = true;
                }
                else 
                {
                    editProductNameTaken[i-1] = false;
                }
                err = true;
            }
        }
        return err;
    }

    function setEditInputErrors() 
    {
        for(var i = 1; i <= editProductRowCount; i++)
        {
            if($("#edit_product_name" + i).val() == "") 
            {
                $("#edit_product_name_error" + i).text("Unavailable!");
            }
            else if(editProductNameTaken[i - 1] == true)
            {
                $("#edit_product_name_error" + i).text("Unavailable!");
                $("#edit_color_error" + i).text("Unavailable!");
            }
            if($("#edit_brand" + i).val() == "") 
            {
                $("#edit_brand_error" + i).text("Unavailable!");
            }
            if($("#edit_color" + i).val() == "") 
            {
                $("#edit_color_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#edit_selling_price" + i).val())) 
            {
                $("#edit_selling_price_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#edit_quantity" + i).val())) 
            {
                $("#edit_quantity_error" + i).text("Unavailable!");
            }
            if(!checkNumberInput($("#edit_reorder_point" + i).val())) 
            {
                $("#edit_reorder_point_error" + i).text("Unavailable!");
            }
        }

    }

    $("#close_edit_error_modal").on("click", setEditInputErrors);

    $("#close_edit_modal").on("click", function () 
    {
        editProductDeleteRows();
        clearEditErrors();
        clearEditInputs() ;
    })

    function clearEditErrors() 
    {
        for(var i = 1; i <= editProductRowCount; i++) 
        {
            $("#edit_product_name_error" + i).text("");
            $("#edit_brand_error" + i).text("");
            $("#edit_color_error" + i).text("");
            $("#edit_selling_price_error" + i).text("");
            $("#edit_quantity_error" + i).text("");
            $("#edit_reorder_point_error" + i).text("");
        }
    }
    function clearEditInputs() 
    {
        for(var i = 1; i <= editProductRowCount; i++) {
            $("#edit_product_name" + i).val("");
            $("#edit_brand" + i).val("");
            $("#edit_color" + i).val("");
            $("#edit_selling_price" + i).val("");
            $("#edit_quantity" + i).val("");
            $("#edit_reorder_point" + i).val("");        
        }
    }

    // delete data
    $("#delete_button").on("click", function () 
    {
        var count = table.rows(".selected").data().length;
        var data = table.rows(".selected").data();
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
            $.post("/inventory-delete-many-products", {ProductId}, function(data, status) 
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

    function isProductAvailable(ProductName, Color) 
    {
        return new Promise((resolve, reject) => 
        {
            $.get("/is-product-available", {ProductName: ProductName, Color: Color}, function(result) 
            {
                if(result) 
                {
                    resolve("unavailable");
                }
                else 
                {
                    resolve("available");
                }
    
                reject("Error occured");
            }); 
        });
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