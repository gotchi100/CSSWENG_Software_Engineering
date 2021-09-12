$(document).ready(function () 
{
    var addProductRowCount = 1;
    var checkDuplicate;
    var nextIdNumber = $("#supplier_id").val();

    $("#clear_item_button").on("click", function() {
        clearErrors();
        clearAllInputs();
        while(addProductRowCount != 1)
        {
            addProductDeleteRow();
        }
        $("#clear_modal").modal("hide");
    });

    $("#add_item_button").on("click", addProductAddRow);

    $("#delete_item_button").on("click", addProductDeleteRow);
    
    $("#close_error_modal").on("click", setInputErrors);

    $("#submit_button").on("click", function() {

        if(checkErrors() != true)
        {
            checkDuplicate = checkAddDuplicates();
            if(checkDuplicate)
            {
                $("#error_modal_text").text("Please avoid using the same product names!");
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
    
                nextIdNumber = parseInt($("#supplier_id").val()) + 1;
    
                $.post("/reorder-add-supplier", {SupplierInfo}, function(data, status) 
                {
                    console.log("POST - Add One Supplier - Status: " + status);
    
                    $("#success_modal").modal("show");
                });
            }
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
        $("#supplier_id").val(nextIdNumber);
        $("#success_modal").modal("hide");
        
    })
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