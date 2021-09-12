$(document).ready(function () 
{
    var addProductRowCount = 1;
    var checkDuplicate;

    $("#add_item_button").on("click", addProductAddRow);

    $("#delete_item_button").on("click", addProductDeleteRow);
    
    $("#close_error_modal").on("click", setInputErrors);

    $("#submit_button").on("click", function() {

        if(checkErrors() != true)
        {
            checkDuplicate = checkAddDuplicates();
            if(checkDuplicate)
            {
                $("#error_modal_text").text("Please avoid using the same product names, brands, and colors!");
                clearErrors();
                $("#error_modal").modal("show");
            }
            else
            {
                var SupplierInfo = {
                    Id: $("#supplier_id").val().trim(),
                    Name: $("#supplier_name").val().trim(),
                    Number: $("#supplier_number").val().trim(),
                    Email: $("#supplier_email").val().trim(),
                    Address: $("#supplier_address").val().trim(),
                    Products: []
                };
    
                for(var i = 1; i <= addProductRowCount; i++) 
                {
                    SupplierInfo.Products.push($("#product_name" + i).val().trim() + ", " + $("#brand" + i).val().trim() + ", " + $("#color" + i).val().trim());
                }
    
                $.post("/reorder-edit-supplier", {SupplierInfo}, function(data, status) 
                {
                    console.log("POST - Edit One Supplier - Status: " + status);

                    
                    $("#select_supplier > option").remove();
                    $("#select_supplier").append('<option value = "" hidden>Select one</option>');

                    for(var i = 0; i < data.length; i++)
                    {
                        $("#select_supplier").append('<option>' + data[i].Name + '</option>');
                    }

                    $("#success_modal").modal("show");
                });
            }
        }
        
    });
    
    $("#select_supplier").change(function ()
    {
        var Name = $("#select_supplier :selected").text();

        while(addProductRowCount != 1)
        {
            addProductDeleteRow();
        }

        if($("#select_supplier :selected").val() == "")
        {
            clearErrors();
            clearAllInputs();
            while(addProductRowCount != 1)
            {
                addProductDeleteRow();
            }
        }
        else
        {
            $.get("/get-supplier-info", {Name: Name}, function(result) 
            {
                $("#supplier_id").val(result.Id);
                $("#supplier_name").val(result.Name);
                $("#supplier_number").val(result.Number);
                $("#supplier_email").val(result.Email);
                $("#supplier_address").val(result.Address);
        
                var temp;
                addOldProductNamesRows(result.Products.length);   
                for(var i = 1; i <= result.Products.length; i++)
                {
                    temp = result.Products[i-1].split(", ");

                    $("#product_name" + i).val(temp[0]);
                    $("#brand" + i).val(temp[1]);
                    $("#color" + i).val(temp[2]);               
                }
                
                

            }); 
        }
        

    });


    $("#close_success_modal").on("click", function()
    {
        clearErrors();
        clearAllInputs();
        while(addProductRowCount != 1)
        {
            addProductDeleteRow();
        }
        $("#select_supplier").val("").change();
        $("#success_modal").modal("hide");
        
    })

    function addOldProductNamesRows(length)
    {
        while(length != addProductRowCount)
        {
            addProductAddRow();
        }
    }
    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#supplier_add_supplier_table td:last").text("");
        
        $("#supplier_add_supplier_table tr:last").after('<tr>' + 
        '<td style="width: 10%">' +
        '<p class="col-form-label font-weight-bold text-right mr-2" id="product_number' + addProductRowCount +'">' + addProductRowCount + '.</p>' +
        '</td>' +

        '<td style="width: 25%">' +
        '<input type="text" class="form-control-file" id="product_name' + addProductRowCount + '" required>' +
        '</td>' +

        
        '<td style="width: 25%">' +
        '<input type="text" class="form-control-file" id="brand' + addProductRowCount + '" required>' +
        '</td>' +

        '<td style="width: 25%">' +
        '<input type="text" class="form-control-file" id="color' + addProductRowCount + '" required>' +
        '</td>' +

        '<td style="width: 15%">' +
        '<div class="d-flex justify-content-start">' +
        '<button type="button" class="btn btn-secondary ml-2 mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
        $("#add_item_button").on("click", addProductAddRow);
        $("#delete_item_button").on("click", addProductDeleteRow);
        
        if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", false);
        }
    
    };

    function addProductDeleteRow() 
    {
        addProductRowCount--;
    
        $("#supplier_add_supplier_table tr:last").remove();
        $("#supplier_add_supplier_table td:last").remove();
        $("#supplier_add_supplier_table tr:last").append('<td style="width: 15%">' +
        '<div class="d-flex justify-content-start">' +
        '<button type="button" class="btn btn-secondary ml-2 mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td>');
         $("#add_item_button").on("click", addProductAddRow);
         $("#delete_item_button").on("click", addProductDeleteRow);
    
         if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", true);
        }
    };

    function clearAllInputs()
    {
        $("#supplier_po").val("");
        $("#supplier_email").val("");
        $("#supplier_address").val("");
        $("#supplier_name").val("");
        $("#supplier_number").val("");
        for(var i = 1; i <= addProductRowCount; i++) {
            $("#product_name" + i).val(""); 
            $("#brand" + i).val(""); 
            $("#color" + i).val(""); 
        }
    }

    function checkErrors()
    {
        var Name = $("#supplier_name").val().trim();
        var Number = $("#supplier_number").val().trim();
        var Email = $("#supplier_email").val().trim();
        var Address = $("#supplier_address").val().trim();
        var err = false;

        if(Name == "" || Number == "" || Email == "" || Address == "")
        {
            err = true;
        }
        for(var i = 1; i <= addProductRowCount; i++)
        {
            if($("#product_name" + i).val().trim() == "" || $("#brand" + i).val().trim() == "" || $("#color" + i).val().trim() == "")
            {
                err = true;
            }
        }
        return err;
    }

    function checkAddDuplicates()
    {
        var data = [];
        var temp;

        for(var k = 1; k <= addProductRowCount; k++)
        {
            temp = {
                ProductName: $("#product_name" + k).val().toLowerCase().trim(),
                Brand: $("#brand" + k).val().toLowerCase().trim(),
                Color: $("#color" + k).val().toLowerCase().trim()
            }
            data.push(temp);
        }
        
        var duplicatePos = [];
        var result = [];

        data.forEach((product, index) => {
            duplicatePos[product.ProductName + " " + product.Brand + " " + product.Color] = duplicatePos[product.ProductName + " " + product.Brand + " " + product.Color] || [];
            duplicatePos[product.ProductName + " " + product.Brand + " " + product.Color].push(index);
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

    function clearErrors()
    {
        for(var i = 1; i <= addProductRowCount; i++)
        {
            $("#product_name" + i).removeClass("input-border-error");
            $("#brand" + i).removeClass("input-border-error");
            $("#color" + i).removeClass("input-border-error");
        }
    }

    function setInputErrors() 
    {
        for(var i = 1; i <= addProductRowCount; i++)
        {
            if(checkDuplicate)
            {
                if(checkDuplicate.includes(i-1))
                {
                    $("#product_name" + i).addClass("input-border-error");
                    $("#brand" + i).addClass("input-border-error");
                    $("#color" + i).addClass("input-border-error");
                }
            }
        }
        checkDuplicate = [];
    }
});