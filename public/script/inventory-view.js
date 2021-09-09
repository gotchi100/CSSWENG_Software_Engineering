$(document).ready(function () 
{
    getCurrentDate(); // display current date in header
    var addProductRowCount = 1;
    var editProductRowCount = 1;
    var deleteRowCount = 1;
    var ProductNameTaken;
    var checkDuplicate;
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
            var brand = $(this).closest("tr").children().eq(3).text();
            var color = $(this).closest("tr").children().eq(4).text();
            var price = $(this).closest("tr").children().eq(5).text();
            var quantity = $(this).closest("tr").children().eq(6).text();
            var temp = getVariations(name, brand, color);  
            var variations =   "";

            for(var i = 0; i < temp.length; i++)
            {
                variations += temp[i];
                if(i != temp.length - 1)
                {
                    variations += ", ";
                }
            }
            
            $("#details_product_name span").text(name);
            $("#details_price span").text(price);
            $("#details_quantity span").text(quantity);
            $("#details_variations span").text(variations); 
            $("#details_modal").modal("show");
             
        }
    });

    // add data to database
    $("#add_product_button").on("click", async function () 
    {
        if(addProductFieldsIncomplete() != true)
        {
            var checkError = await checkAddInputErrors();
            checkDuplicate = checkAddDuplicates();
    
            if(checkError == true || checkDuplicate) 
            {
                if(checkError == true && checkDuplicate)
                {
                    $("#add_error_modal_text").text("There are multiple errors on the form!");
                }
                else if(checkError == true)
                {
                    $("#add_error_modal_text").text("Please avoid using an existing product name and using numbers less than 0 for inputs that accept numbers.");
                }
                else if(checkDuplicate)
                {
                    $("#add_error_modal_text").text("There are products with the same product name and color.");
                }
                clearAddErrors();
                $("#add_error_modal").modal("show");
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
                        for(var i = 0; i < data.length; i++) 
                        {
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

    // edit data in database
    $("#edit_modal_button").on("click", function () 
    {
        $("#edit_product_button").prop("disabled", false);
        editProductAddRows();
        editProductPopulateInputs();
    });

    $("#edit_product_button").on("click", async function () 
    {
        if(editProductFieldsIncomplete() != true)
        {
            $("#edit_product_button").prop("disabled", true);
            var checkError = await checkEditInputErrors();
            checkDuplicate = checkEditDuplicates();
    
            if(checkError == true || checkDuplicate) 
            {
                if(checkError == true && checkDuplicate)
                {
                    $("#edit_error_modal_text").text("There are multiple errors on the form!");
                }
                else if(checkError == true)
                {
                    $("#edit_error_modal_text").text("Please avoid using an existing product name and using numbers less than 0 for inputs that accept numbers.");
                }
                else if(checkDuplicate)
                {
                    $("#edit_error_modal_text").text("There are products with the same product name and color.");
    
                }
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
                    $.post("/inventory-view-edit-one-product", {ProductInfo}, function(data, status) 
                    {
                        console.log("POST - Edit One Product - Status: " + status);
                
                        Availability = getAvailability(data[0].Quantity, data[0].ReorderPoint); 
                            
                        table.rows(".selected").remove().draw(false);
                        table.row.add(["", data[0].ProductId, data[0].ProductName, data[0].Brand, data[0].Color, 
                                        data[0].SellingPrice, data[0].Quantity, data[0].ReorderPoint, Availability]).draw(false);
                    })
                }
                else
                {
                    $.post("/inventory-view-edit-many-product", {ProductInfo}, function(data, status) 
                    {
                        console.log("POST - Edit Many Product - Status: " + status);
                
                        var Availability;
                        
                        table.rows(".selected").remove().draw(false);
                        
                        for(var i = 0; i < data.length; i++) 
                        {
                            Availability = getAvailability(data[i].Quantity, data[i].ReorderPoint); 
                            table.row.add(["", data[i].ProductId, data[i].ProductName, data[i].Brand, data[i].Color, 
                                        data[i].SellingPrice, data[i].Quantity, data[i].ReorderPoint, Availability]).draw(false);
                        }
                    })
                }
                editProductDeleteRows();
                clearEditErrors();
                $("#edit_modal_button").prop("disabled", true);
                $("#delete_modal_button").prop("disabled", true);
                $("#edit_modal").modal("hide");
            }

        }
        
    });

    
    $("#close_edit_modal").on("click", function () 
    {
        $("#edit_product_button").prop("disabled", false);
        editProductDeleteRows();
        clearEditErrors();
        clearEditInputs() ;
    });

    $("#close_edit_error_modal").on("click", setEditInputErrors);

    // delete data in database
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
        clearDeletePopupRows();
        $("#edit_modal_button").prop("disabled", true);
        $("#delete_modal_button").prop("disabled", true);
        $("#delete_modal").modal("hide");
    });

    // delete popup
    $("#delete_modal_button").on("click", function() 
    {
        var data = table.rows(".selected").data();
        deletePopupAddRows(data.length);

        for(var i = 0; i < data.length; i++)
        {
            $("#delete_product_id" + (i + 1)).text(data[i][1]);
            $("#delete_product_name" + (i + 1)).text(data[i][2]);
            $("#delete_brand" + (i + 1)).text(data[i][3]);
            $("#delete_color" + (i + 1)).text(data[i][4]);
            $("#delete_quantity" + (i + 1)).text(data[i][6]);
            $("#delete_reorder_point" + (i + 1)).text(data[i][7]);
        }
    });

    // close delete popup
    $("#cancel_delete_modal_button").on("click", function()
    {
        clearDeletePopupRows();
    });

    // delete popup functions
    function deletePopupAddRows(length)
    {
        for(var i = 2; i <= length; i++)
        {
            deleteRowCount++;
            $("#delete_modal_table tbody tr:last").after("<tr>" +
                "<td id=\"delete_product_id" + deleteRowCount + "\"></td>" +
                "<td id=\"delete_product_name" + deleteRowCount + "\"></td>" +
                "<td id=\"delete_brand" + deleteRowCount + "\"></td>" +
                "<td id=\"delete_color" + deleteRowCount + "\"></td>" +
                "<td id=\"delete_quantity" + deleteRowCount + "\"></td>" +
                "<td id=\"delete_reorder_point" + deleteRowCount + "\"></td>" +
                "</tr>");
        }
    }

    function clearDeletePopupRows()
    {
        $("#delete_product_id1").text("");
        $("#delete_product_name1").text("");
        $("#delete_brand1").text("");
        $("#delete_color1").text("");
        $("#delete_quantity1").text("");
        $("#delete_reorder_point1").text("");

        while(deleteRowCount != 1)
        {
            deleteRowCount--;
            $("#delete_modal_table tbody tr:last").remove();
        }
    }

    // add data functions
    function addProductFieldsIncomplete()
    {
        var ProductName, Brand, Color, BuyingPrice, SellingPrice, Quantity, ReorderPoint;

        for(var i = 1; i <= addProductRowCount; i++)
        {
            ProductName = $("#add_product_name" + i).val();
            Brand = $("#add_brand" + i).val();
            Color = $("#add_color" + i).val();
            BuyingPrice = $("#add_buying_price" + i).val();
            SellingPrice = $("#add_selling_price" + i).val();
            Quantity = $("#add_quantity" + i).val();
            ReorderPoint = $("#add_reorder_point" + i).val();

            if(ProductName == "" || Brand == "" || Color == "" || BuyingPrice == "" || SellingPrice == "" || Quantity == "" || 
                ReorderPoint == "" || BuyingPrice < 1 || SellingPrice < 1 || Quantity < 1 || ReorderPoint < 1)
            {
                return true;
            }
        }
        return false;
    }
    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#add_product_table td:last").text("");
        
        $("#add_product_table tr:last").after('<tr><td>' + 
        '<input type="text" class="form-control-file" id="add_product_name' + addProductRowCount + '" required>' +
        '<p class="text-danger text-error" id="add_product_name_error' + addProductRowCount + '"></p>' +
        '</td><td>' +
        
        '<input type="text" class="form-control-file" id="add_brand' + addProductRowCount + '" required>' +
        '<p class="text-danger text-error" id="add_brand_error' + addProductRowCount + '"></p>' +
        '</td><td>' +

        '<input type="text" class="form-control-file" id="add_color' + addProductRowCount + '" required>' +
        '<p class="text-danger text-error" id="add_color_error' + addProductRowCount + '"></p>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="add_selling_price' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="add_buying_price' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="add_quantity' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="add_reorder_point' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +
        
        '<div class="d-flex">' +
        '<button type="button" class="btn btn-secondary mr-2" id="add_product_add_row_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="add_product_delete_row_button" disabled><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
        $("#add_product_add_row_button").on("click", addProductAddRow);
        $("#add_product_delete_row_button").on("click", addProductDeleteRow);
        
        if(addProductRowCount == 1) {
            $("#add_product_delete_row_button").prop("disabled", false);
        }
    
    };
    
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
    };

    function clearAddErrors() 
    {
        for(var i = 1; i <= addProductRowCount; i++) {
            $("#add_product_name_error" + i).text("");
            $("#add_brand_error" + i).text("");
            $("#add_color_error" + i).text("");
        }
    };

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
    };

    async function checkAddInputErrors() 
    {
        var ProductName, Color;
        var value;
        var err = false;
        ProductNameTaken = [];
        
        for(var i = 1; i <= addProductRowCount; i++) 
        {
            ProductName = $("#add_product_name" + i).val();
            Color = $("#add_color" + i).val();
            if(ProductName != "") {
                value = await isProductAvailable(ProductName, Color);
            }
            if(value == "unavailable" ) 
            {
                ProductNameTaken[i-1] = true;
                err = true;
            }
            else 
            {
                ProductNameTaken[i-1] = false;
            }
        }
        return err;
    };

    function checkAddDuplicates()
    {
        var data = [];
        var temp;

        for(var k = 1; k <= addProductRowCount; k++)
        {
            temp = {
                ProductName: $("#add_product_name" + k).val().toLowerCase().trim(),
                Color: $("#add_color" + k).val().toLowerCase().trim()
            }
            data.push(temp);
        }
        
        var duplicatePos = [];
        var result = [];

        data.forEach((product, index) => {
            duplicatePos[product.ProductName + " " + product.Color] = duplicatePos[product.ProductName + " " + product.Color] || [];
            duplicatePos[product.ProductName + " " + product.Color].push(index);
        });
        
        Object.keys(duplicatePos).forEach(function(value) {
            var posArray = duplicatePos[value];
            if (posArray.length > 1) {
                result = result.concat(posArray);
            }
        });

        if(result.length > 0)
        {
            return result;
        }
        else
        {
            return null;
        }
    };

    function setAddInputErrors() 
    {
        //if checkDuplicate is null, there are no duplicates on the form
        for(var i = 1; i <= addProductRowCount; i++)
        {
            if(checkDuplicate)
            {
                if(checkDuplicate.includes(i-1))
                {
                    $("#add_product_name_error" + i).text("Duplicate!");
                    $("#add_color_error" + i).text("Duplicate!");
                }
            }
           
            if(ProductNameTaken[i - 1] == true) 
            {
                $("#add_product_name_error" + i).text("Unavailable!");
                $("#add_color_error" + i).text("Unavailable!");
            }
        }
        checkDuplicate = [];
        ProductNameTaken = [];
    };

    // edit data functions
    function editProductFieldsIncomplete()
    {
        var ProductName, Brand, Color, SellingPrice, Quantity, ReorderPoint;

        for(var i = 1; i <= editProductRowCount; i++)
        {
            ProductName = $("#edit_product_name" + i).val();
            Brand = $("#edit_brand" + i).val();
            Color = $("#edit_color" + i).val();
            SellingPrice = $("#edit_selling_price" + i).val();
            Quantity = $("#edit_quantity" + i).val();
            ReorderPoint = $("#edit_reorder_point" + i).val();

            if(ProductName == "" || Brand == "" || Color == "" || SellingPrice == "" || Quantity == "" || ReorderPoint == "" ||
                SellingPrice < 1 || Quantity < 1 || ReorderPoint < 1)
            {
                return true;
            }
        }
        return false;
    }
    function editProductAddRows() 
    {
        var count = table.rows(".selected").data().length;
        if(count > 1) 
        {
            while(editProductRowCount != count)
            {
                editProductRowCount++;

                $("#edit_product_table tr:last").after('<tr><td>' + 

                '<input type="text" class="form-control-file" id="edit_product_id' + editProductRowCount + '" disabled>' +
                '</td><td>' +

                '<input type="text" class="form-control-file" id="edit_product_name' + editProductRowCount + '" required>'+
                '<p class="text-danger" id="edit_product_name_error' + editProductRowCount + '"></p>'+
                '</td><td>' +
                
                '<input type="text" class="form-control-file" id="edit_brand' + editProductRowCount + '" required>'+
                '<p class="text-danger" id="edit_brand_error' + editProductRowCount + '"></p>'+
                '</td><td>' +
                
                '<input type="text" class="form-control-file" id="edit_color' + editProductRowCount + '" required>'+
                '<p class="text-danger" id="edit_color_error' + editProductRowCount + '"></p>'+
                '</td><td>' +
                
                '<input type="number" class="form-control-file" id="edit_selling_price' + editProductRowCount + '" min="1" required>' +
                '</td><td>' +

                '<input type="number" class="form-control-file" id="edit_quantity' + editProductRowCount + '" min="1" required>' +
                '</td><td>' +

                '<input type="number" class="form-control-file" id="edit_reorder_point' + editProductRowCount + '" min="1" required>' +
                '</td></tr>');
            }
        }
        
    };

    function editProductDeleteRows()
    {
        while(editProductRowCount != 1)
        {
            editProductRowCount--;
            $("#edit_product_table tr:last").remove();
        }
    };

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
    };

    function clearEditErrors() 
    {
        for(var i = 1; i <= editProductRowCount; i++) 
        {
            $("#edit_product_name_error" + i).text("");
            $("#edit_brand_error" + i).text("");
            $("#edit_color_error" + i).text("");
        }
    };

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
    };

    async function checkEditInputErrors() 
    {
        var ProductName, Color;
        var data = table.rows(".selected").data();
        var value, parsedName, parsedColor;
        var err = false;
        ProductNameTaken = [];
        for(var i = 1; i <= editProductRowCount; i++) 
        {
            ProductName = $("#edit_product_name" + i).val();
            Color = $("#edit_color" + i).val();
            if(ProductName != "") 
            {
                value = await isProductAvailable(ProductName, Color);
            }
            parsedName = parser.parseFromString(data[i-1][2], 'text/html').body.textContent;
            parsedColor = parser.parseFromString(data[i-1][4], 'text/html').body.textContent;

            if(ProductName.toLowerCase().trim() == parsedName.toLowerCase().trim() && 
                Color.toLowerCase().trim() == parsedColor.toLowerCase().trim())
            {
                value = "available";
            }
            if(value == "unavailable" ) 
            {
                ProductNameTaken[i-1] = true;
                err = true;
            }
            else 
            {
                ProductNameTaken[i-1] = false;
            }
        }
        return err;
    };

    function checkEditDuplicates()
    {
        var data = [];
        var temp;

        for(var k = 1; k <= editProductRowCount; k++)
        {
            temp = {
                ProductName: $("#edit_product_name" + k).val().toLowerCase().trim(),
                Color: $("#edit_color" + k).val().toLowerCase().trim()
            }
            data.push(temp);
        }
        
        var duplicatePos = [];
        var result = [];

        data.forEach((product, index) => {
            duplicatePos[product.ProductName + " " + product.Color] = duplicatePos[product.ProductName + " " + product.Color] || [];
            duplicatePos[product.ProductName + " " + product.Color].push(index);
        });

        Object.keys(duplicatePos).forEach(function(value) {
            var posArray = duplicatePos[value];
            if (posArray.length > 1) {
                result = result.concat(posArray);
            }
        });

        if(result.length > 0)
        {
            return result;
        }
        else
        {
            return null;
        }
    };

    function setEditInputErrors() 
    {
        $("#edit_product_button").prop("disabled", false);
        //if checkDuplicate is null, there are no duplicates on the form
        for(var i = 1; i <= editProductRowCount; i++)
        {
            if(checkDuplicate)
            {
                if(checkDuplicate.includes(i-1))
                {
                    $("#edit_product_name_error" + i).text("Duplicate!");
                    $("#edit_color_error" + i).text("Duplicate!");
                }
            }
            if(ProductNameTaken[i - 1] == true)
            {
                $("#edit_product_name_error" + i).text("Unavailable!");
                $("#edit_color_error" + i).text("Unavailable!");
            }
        };
        checkDuplicate = [];
        ProductNameTaken = [];
    };

    // other functions
    function getVariations(ProductName, Brand, Color) 
    {   var data = table.rows().data();
        var result = [];
        var parsedName, parsedBrand, parsedColor;

        for(var i = 0; i < data.length; i++)
        {
            parsedName = parser.parseFromString(data[i][2], 'text/html').body.textContent
            parsedBrand = parser.parseFromString(data[i][3], 'text/html').body.textContent
            parsedColor = parser.parseFromString(data[i][4], 'text/html').body.textContent

            if(ProductName.toLowerCase().trim() == parsedName.toLowerCase().trim() && 
                    Brand.toLowerCase().trim() == parsedBrand.toLowerCase().trim())
            {
                //if(Color.toLowerCase().trim() != parsedColor.toLowerCase().trim())
                    result.push(parsedColor);
            }
        }
        
        if(result.length > 0)
        {
            return result;
        }
        else
        {
            return null;
        }
    };
    function getAvailability(Quantity, ReorderPoint) 
    {
        if(Quantity > ReorderPoint + 10) 
        {
            return "High"; 
        }else if(Quantity > ReorderPoint + 5) 
        {
            return "Medium"; 
        }else if(Quantity <= ReorderPoint + 5) 
        {
            return "Low";
        } 
    };

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
    };

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