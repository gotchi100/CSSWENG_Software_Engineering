$(document).ready(function () 
{
    var addProductRowCount = 1;
    var checkDuplicate;
    var nextPONumber = $("#supplier_po").val();

    $("#submit_button").on("click", function() 
    {
        // var checkSelectedSupplier = checkSupplier();
        // if(checkSelectedSupplier)
        // {
        //    $("#error_modal_text").text("Please select a supplier!");
        //    $("#error_modal").modal("show");
        // }
       // else
      //  {
            if(addProductFieldsIncomplete() != true)
            {
                checkDuplicate = checkAddDuplicates();
                if(checkDuplicate) 
                {
                    if(checkDuplicate)
                    {
                        $("#error_modal_text").text("Please avoid using the same product names!");
                    }
                    clearErrors();
                    $("#error_modal").modal("show");
                }
                else
                {
                    var products = [];
    
                    for(var i = 1; i <= addProductRowCount; i++)
                    {
                        var temp = {
                            ProductName: $("#product_name" + i + " :selected").text(),
                            UnitPrice: $("#unit_price" + i).val(),
                            Quantity: $("#quantity" + i).val(),
                            Amount: $("#amount" + i).val()
                        };
                        products.push(temp);
                    }
    
                    var SupplierPOInfo = {
                        PO: $("#supplier_po").val(),
                        SupplierID: $("#supplier_id").val(),
                        SupplierName: $("#select_supplier :selected").text(),
                        ModeOfPayment: $("#mode_of_payment :selected").text(),
                        Products: products,
                        DateOrdered: getCurrentDate(),
                        Status: "Ordering"
                    };
    
                    nextPONumber = parseInt($("#supplier_po").val()) + 1;
    
                    $.post("/reorder-add-supplier-po", {SupplierPOInfo}, function(data, status) 
                    {
                        console.log("POST - Add One Supplier PO - Status: " + status);
            
                        $("#success_modal").modal("show");
                    });
             //   }
            }
    

        }
        
        
    });

    $("#success_close_button").on("click", function ()
    {
        clearErrors();
        clearInputs();
    });

    $("#select_supplier").change(function ()
    {
        var Name = $("#select_supplier :selected").text();

        while(addProductRowCount != 1)
        {
            addProductDeleteRow();
        }
        $("#unit_price1").val("");
        $("#quantity1").val("");
        $("#amount1").val("");
        $("#total_amount").text("");

        if($("#select_supplier :selected").val() == "")
        {
            $("#supplier_po").val(nextPONumber);
            $("#supplier_id").val("");
            $("#supplier_number").val("");
            $("#supplier_email").val("");
            $("#supplier_address").val("");
            $("#product_name1 > option").remove();
            $("#product_name1").append("<option value = \"\" hidden>Select one</option>")
        }
        else
        {
            $.get("/get-supplier-info", {Name: Name}, function(result) 
            {
                $("#supplier_po").val(nextPONumber);
                $("#supplier_id").val(result.Id);
                $("#supplier_number").val(result.Number);
                $("#supplier_email").val(result.Email);
                $("#supplier_address").val(result.Address);
        
                $("#product_name1 > option").remove();
                $("#product_name1").append("<option value = \"\" hidden>Select one</option>")
                for(var i = 0; i < result.Products.length; i++)
                {
                    $("#product_name1").append("<option>" + result.Products[i] + "</option>")
                }
            }); 
        }
        

    });

    $("#add_item_button").on("click", addProductAddRow);

    $("#delete_item_button").on("click", addProductDeleteRow);

    $("#close_error_modal").on("click", setInputErrors);

    for(var i = 1; i <= addProductRowCount; i++)
    {
        $("tbody tr td").on("input", ".calculate-amount" + i, calculateAmount);
    }
    function addProductFieldsIncomplete()
    {
        var UnitPrice, Quantity, ModeOfPayment;
    
        if($("#mode_of_payment :selected").val() == "")
        {
            return true;
        }

        for(var i = 1; i <= addProductRowCount; i++)
        {

            UnitPrice = $("#unit_price" + i).val();
            Quantity = $("#quantity" + i).val();

            if(UnitPrice == "" || Quantity == "" ||  UnitPrice < 1 || Quantity < 1)
            {
                return true;
            }
        }
        return false;
    }
    function calculateAmount() 
    {
        var amount = [];
        var total = 0;

        for(var i = 1; i <= addProductRowCount; i++)
        { 
            amount.push(1);
            $("tbody tr td .calculate-amount" + i).each(function() 
            {
                var inputVal = $(this).val();
                if ($.isNumeric(inputVal)) {
                    amount[i-1] *= parseFloat(inputVal);
                }
            })
            if(($("#unit_price" + i).val() == 1 && $("#quantity" + i).val() == 1 && amount[i-1] == 1) || amount[i-1] != 1)
            {
                if($("#quantity" + i).val() != "")
                {
                    total += amount[i-1];
                    $("#amount" + i).val(amount[i-1]);
                }
                else
                {
                    $("#amount" + i).val(0);
                }
            }
            $("#total_amount").text(total);
        }
        
    }
    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#supplier_add_po_table tbody td:last").text("");
        
        $("#supplier_add_po_table tbody tr:last").after('<tr><td>'+ 
        '<select class="form-control-file" id="product_name' + addProductRowCount + '" required></select>' +
        '</td><td>' +

        '<input type="number" class="form-control-file calculate-amount' + addProductRowCount + '" id="unit_price' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file calculate-amount' + addProductRowCount + '" id="quantity' + addProductRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="amount' + addProductRowCount + '" readonly>' +
        '</td><td>' +

        '<div class="d-flex justify-content-center">' +
        '<button type="button" class="btn btn-secondary mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
        $("#product_name" + addProductRowCount).append($("#product_name1 > option").clone());

        $("#add_item_button").on("click", addProductAddRow);
        $("#delete_item_button").on("click", addProductDeleteRow);
        for(var i = 1; i <= addProductRowCount; i++)
        {
            $("tbody tr td").on("input", ".calculate-amount" + i, calculateAmount);
        }
        
        if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", false);
        }
    
    };
    function addProductDeleteRow() 
    {
        if($("#total_amount").text() != "")
         {
             var temp = parseFloat($("#total_amount").text()) - parseFloat($("#amount" + addProductRowCount).val());
             $("#total_amount").text(temp);
         }

        addProductRowCount--;
    
        $("#supplier_add_po_table tbody tr:last").remove();
        $("#supplier_add_po_table tbody td:last").remove();
        $("#supplier_add_po_table tbody tr:last").append('<td>' +
        '<div class="d-flex justify-content-center">' +
        '<button type="button" class="btn btn-secondary mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
         $("#add_item_button").on("click", addProductAddRow);
         $("#delete_item_button").on("click", addProductDeleteRow);

         if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", true);
        }
    };

    function clearErrors()
    {
        for(var i = 1; i <= addProductRowCount; i++)
        {
            $("#product_name" + i).removeClass("input-border-error");
        }
    }

    function clearInputs()
    {
        $("#select_supplier").val("").change();
        $("#mode_of_payment").val("");

        $("#unit_price1").val("");
        $("#quantity1").val("");
        $("#amount1").val("");
        $("#total_amount").text("");
        
        while(addProductRowCount != 1)
        {
            addProductDeleteRow();
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
                }
            }
        }
        checkDuplicate = [];
    }

    function checkAddDuplicates()
    {
        var data = [];

        for(var k = 1; k <= addProductRowCount; k++)
        {
            data.push($("#product_name" + k + " :selected").text().toLowerCase().trim());
        }
        
        var duplicatePos = [];
        var result = [];

        data.forEach((product, index) => {
            duplicatePos[product] = duplicatePos[product] || [];
            duplicatePos[product].push(index);
        });

        Object.keys(duplicatePos).forEach(function(value) {
            var posArray = duplicatePos[value];
            if (posArray.length > 1 && posArray[value] != "") {
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

    function getCurrentDate() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        return month + "/" + day + "/" + year;
    };
    
});