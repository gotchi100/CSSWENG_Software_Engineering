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

        var checkError = checkErrors();
        checkDuplicate = checkAddDuplicates();
        if(checkError == true || checkDuplicate) 
        {
            if(checkError == true && checkDuplicate)
            {
                $("#error_modal_text").text("Please fill in all the fields and avoid using the same product names!");
            }
            else if(checkError == true)
            {
                $("#error_modal_text").text("Please fill in all the fields!");
            }
            else if(checkDuplicate)
            {
                $("#error_modal_text").text("Please avoid using the same product names!");
            }
            clearErrors();
            $("#confirm_modal").modal("hide");
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
                SupplierInfo.Products.push($("#product_name" + i).val().trim());
            }

            nextPONumber = parseInt($("#supplier_po").val()) + 1;

            $.post("/reorder-add-supplier", {SupplierInfo}, function(data, status) 
            {
                console.log("POST - Add One Supplier - Status: " + status);

                clearErrors();
                clearAllInputs();
                while(addProductRowCount != 1)
                {
                    addProductDeleteRow();
                }
                $("#supplier_id").val(nextIdNumber);
                $("#confirm_modal").modal("hide");
            });
        }
    });
    
    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#supplier_add_supplier_table td:last").text("");
        
        $("#supplier_add_supplier_table tr:last").after("<tr>" + 
        "<td style=\"width: 10%\">" +
        "<p class=\"col-form-label font-weight-bold text-right mr-2\" id=\"product_number" + addProductRowCount +"\">" + addProductRowCount + ".</p>" +
        "</td>" +

        "<td style=\"width: 75%\">" +
        "<input type=\"text\" class=\"form-control-file\" id=\"product_name" + addProductRowCount + "\">" +
        "</td>" +

        "<td style=\"width: 15%\">" +
        "<div class=\"d-flex justify-content-start\">" +
        "<button type=\"button\" class=\"btn btn-secondary ml-2 mr-2\" id=\"add_item_button\"><span class=\"fas fa-plus\"></span></button>" +
        "<button type=\"button\" class=\"btn btn-secondary\" id=\"delete_item_button\"><span class=\"fas fa-trash\"></span></button>" +
        "</div></td></tr>");
    
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
        $("#supplier_add_supplier_table tr:last").append("<td style=\"width: 15%\">" +
        "<div class=\"d-flex justify-content-start\">" +
        "<button type=\"button\" class=\"btn btn-secondary ml-2 mr-2\" id=\"add_item_button\"><span class=\"fas fa-plus\"></span></button>" +
        "<button type=\"button\" class=\"btn btn-secondary\" id=\"delete_item_button\"><span class=\"fas fa-trash\"></span></button>" +
        "</div></td>");
    
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
            if($("#product_name" + i).val().trim() == "")
            {
                err = true;
            }
        }
        return err;
    }
    function checkAddDuplicates()
    {
        var data = [];

        for(var k = 1; k <= addProductRowCount; k++)
        {
            data.push($("#product_name" + k).val().toLowerCase().trim());
        }
        
        var duplicatePos = [];
        var result = [];

        data.forEach((product, index) => {
            duplicatePos[product] = duplicatePos[product] || [];
            duplicatePos[product].push(index);
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
        $("#supplier_name").removeClass("input-border-error");
        $("#supplier_number").removeClass("input-border-error");
        $("#supplier_email").removeClass("input-border-error");
        $("#supplier_address").removeClass("input-border-error");
        for(var i = 1; i <= addProductRowCount; i++)
        {
            $("#product_name" + i).removeClass("input-border-error");
        }
    }

    function setInputErrors() 
    {
        if($("#supplier_name").val().trim() == "")
        {
            $("#supplier_name").addClass("input-border-error");
        }
        if($("#supplier_number").val().trim() == "")
        {
            $("#supplier_number").addClass("input-border-error");
        }
        if($("#supplier_email").val().trim() == "")
        {
            $("#supplier_email").addClass("input-border-error");
        }
        if($("#supplier_address").val().trim() == "")
        {
            $("#supplier_address").addClass("input-border-error");
        }
        for(var i = 1; i <= addProductRowCount; i++)
        {
            if(checkDuplicate)
            {
                if(checkDuplicate.includes(i-1))
                {
                    $("#product_name" + i).addClass("input-border-error");
                }
            }
            else if($("#product_name" + i).val().trim() == "")
            {
                $("#product_name" + i).addClass("input-border-error");
            }
        }
        checkDuplicate = [];
    }
});