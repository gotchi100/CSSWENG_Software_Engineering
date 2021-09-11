$(document).ready(function () 
{
    var addRowCount = 1;
    var checkDuplicate;

    $("#submit_button").on("click", function()
    {
        if(checkErrors() != true)
        {
            checkDuplicate = checkAddDuplicates();
            if(checkDuplicate)
            {
                $("#error_modal_text").text("Please avoid selecting the same product!");
                clearErrors();
                $("#error_modal").modal("show");
            }
            else
            {   
                var temp1, temp2, Product;
                var ShrinkageInfo = [];
                for(var i = 1; i <= addRowCount; i++)
                {
                    temp1 = $("#select_product" + i + " :selected").text();
                    Product = temp1.split(", ");
                    temp2 = {
                        Date: getCurrentDate(),
                        ProductName: Product[0],
                        Brand: Product[1],
                        Color: Product[2],
                        OriginalQuantity: $("#quantity_on_hand" + i).val(),
                        AdjustedQuantity: $("#new_quantity" + i).val()
                    }
                    ShrinkageInfo.push(temp2);
                }

                if(addRowCount == 1)
                {
                    $.post('/shrinkage-post-one-data', {ShrinkageInfo}, function(data, status)
                    {
                        console.log("Post - Shrinkage One Action - Status: " + status);
                        
                        $("#success_modal").modal("show");
                    });
                }
                else
                {
                    $.post('/shrinkage-post-many-data', {ShrinkageInfo}, function(data, status)
                    {
                        console.log("Post - Shrinkage Many Action - Status: " + status);
                        
                        $("#success_modal").modal("show");
                    });
                }
                


            }
        }
        else
        console.log("button clicked")
    });

    $("#success_close_button").on("click", function ()
    {
        clearErrors();
        clearInputs();
    });
    $("#close_error_modal").on("click", setInputErrors);

    function clearInputs()
    {
        $("#select_product1").val("");
        $("#quantity_on_hand1").val("");
        $("#new_quantity1").val("");
        
        while(addRowCount != 1)
        {
            addProductDeleteRow();
        }
    }

    function clearErrors()
    {
        for(var i = 1; i <= addRowCount; i++)
        {
            $("#select_product" + i).removeClass("input-border-error");
        }
    }
    function setInputErrors() 
    {
        for(var i = 1; i <= addRowCount; i++)
        {
            if(checkDuplicate)
            {
                if(checkDuplicate.includes(i-1))
                {
                    $("#select_product" + i).addClass("input-border-error");
                }
            }
        }
        checkDuplicate = [];
    }

    function checkErrors()
    {
        var Product, NewQTY;
        var err = false;
        for(var i = 1; i <= addRowCount; i++)
        {
            Product = $("#select_product" + i + " :selected").text().trim();
            NewQTY = $("#new_quantity" + i).val().trim();

            if(Product == "" || NewQTY == "")
            {
                err = true;
            }
        }

        return err;
    }
    function checkAddDuplicates()
    {
        var data = [];

        for(var k = 1; k <= addRowCount; k++)
        {
            data.push($("#select_product" + k).val().toLowerCase().trim());
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
        
    $(".products").on("change", getOnHandQTY);

    async function getOnHandQTY()
    {
        for(var i = 1; i <= addRowCount; i++)
        {
            if($(this).attr("id") == "select_product" + i)
            {
                var temp = $("#select_product" + i + " :selected").text();
                var Product = temp.split(", ");
    
                await $.get("/get-product-for-shrinkage", {Product}, function(result) 
                {
                    $("#quantity_on_hand" + i).val(result.Quantity);
                }); 
            }


        }
    }

    $("#add_item_button").on("click", addProductAddRow);

    $("#delete_item_button").on("click", addProductDeleteRow);

    function addProductAddRow() 
    {
        addRowCount++;
        
        $("#supplier_add_po_table tbody td:last").text("");
        
        $("#supplier_add_po_table tbody tr:last").after('<tr><td>'+ 
        '<select class="products form-control-file" id="select_product' + addRowCount + '" required></select>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="quantity_on_hand' + addRowCount + '" min="1" required>' +
        '</td><td>' +

        '<input type="number" class="form-control-file" id="new_quantity' + addRowCount + '" min="1" required>' +
        '</td><td>' +
        '<div class="d-flex justify-content-center">' +
        '<button type="button" class="btn btn-secondary mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
        $("#select_product" + addRowCount).append($("#select_product1 > option").clone());

        $(".products").on("change", getOnHandQTY);
        $("#add_item_button").on("click", addProductAddRow);
        $("#delete_item_button").on("click", addProductDeleteRow);
        
        if(addRowCount == 1) {
            $("#delete_item_button").prop("disabled", false);
        }
    
    };
    function addProductDeleteRow() 
    {

        addRowCount--;
    
        $("#supplier_add_po_table tbody tr:last").remove();
        $("#supplier_add_po_table tbody td:last").remove();
        $("#supplier_add_po_table tbody tr:last").append('<td>' +
        '<div class="d-flex justify-content-center">' +
        '<button type="button" class="btn btn-secondary mr-2" id="add_item_button"><span class="fas fa-plus"></span></button>' +
        '<button type="button" class="btn btn-secondary" id="delete_item_button"><span class="fas fa-trash"></span></button>' +
        '</div></td></tr>');
    
         $("#add_item_button").on("click", addProductAddRow);
         $("#delete_item_button").on("click", addProductDeleteRow);

         if(addRowCount == 1) {
            $("#delete_item_button").prop("disabled", true);
        }
    };
    function getCurrentDate() {
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        if(month < 10)
        {
            month = "0" + month;
        }
        if(day < 10)
        {
            day = "0" + day;
        }
        return month + "/" + day + "/" + year;
    };

    $("#delete_all").on("click", function(){
        var temp = 1;
        $.post('/temp-delete-all-shrinkages', {temp}, function(data, status) {
            console.log("deleted status: " + status);
        })
    })
});