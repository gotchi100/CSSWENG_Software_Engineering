$(document).ready(function () 
{
    var addProductRowCount = 1;
    var checkDuplicate;
    var nextPONumber = $("#supplier_po").val();

    $("#submit_button").on("click", function() {

        var checkError = false//checkErrors();
        checkDuplicate = null//checkAddDuplicates();
        if(checkError == true || checkDuplicate) 
        {

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
                Supplier: {
                    Name: $("#supplier_name").val(),
                    Number: $("#supplier_number").val(),
                    Email: $("#supplier_email").val(),
                    Address: $("#supplier_address").val()
                },
                ModeOfPayment: $("#mode_of_payment :selected").text(),
                Products: products,
                DateOrdered: getCurrentDate(),
                Status: "Ordering"
            };

            nextPONumber = parseInt($("#supplier_po").val()) + 1;

            $.post("/reorder-add-supplier-po", {SupplierPOInfo}, function(data, status) 
            {
                console.log("POST - Add One Supplier PO - Status: " + status);
            });
        }
    });
    $("#select_supplier").change(function ()
    {
        var Name = $("#select_supplier :selected").text();
        $.get("/get-supplier-info", {Name: Name}, function(result) 
        {
            $("#supplier_po").val(nextPONumber);
            $("#supplier_name").val(result.Name);
            $("#supplier_number").val(result.Number);
            $("#supplier_email").val(result.Email);
            $("#supplier_address").val(result.Address);
    
            $("#product_name1 > option").remove();
    
            for(var i = 0; i < result.Products.length; i++)
            {
                $("#product_name1").append("<option>" + result.Products[i] + "</option>")
            }


        }); 

    });

    $("#add_item_button").on("click", addProductAddRow);

    $("#delete_item_button").on("click", addProductDeleteRow);
   
    function addProductAddRow() 
    {
        addProductRowCount++;
        
        $("#supplier_add_po_table tbody td:last").text("");
        
        $("#supplier_add_po_table tbody tr:last").after("<tr><td>" + 
        "<select class=\"form-control-file\" id=\"product_name" + addProductRowCount + "\">" +
        " </select>" +
        "</td><td>" +

        "<input type=\"number\" class=\"form-control-file\" id=\"unit_price" + addProductRowCount + "\"></input>" +
        "</td><td>" +

        "<input type=\"number\" class=\"form-control-file\" id=\"quantity" + addProductRowCount + "\">" +
        "</td><td>" +

        "<input type=\"number\" class=\"form-control-file\" id=\"amount" + addProductRowCount + "\"></input>" +
        "</td><td>" +
        "<div class=\"d-flex justify-content-center\">" +
        "<button type=\"button\" class=\"btn btn-secondary ml-2 mr-2\" id=\"add_item_button\"><span class=\"fas fa-plus\"></span></button>" +
        "<button type=\"button\" class=\"btn btn-secondary\" id=\"delete_item_button\"><span class=\"fas fa-trash\"></span></button>" +
        "</div></td></tr>");
    
        $("#product_name" + addProductRowCount).append($("#product_name1 > option").clone());

        $("#add_item_button").on("click", addProductAddRow);
        $("#delete_item_button").on("click", addProductDeleteRow);
        
        if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", false);
        }
    
    };

    function addProductDeleteRow() 
    {
        addProductRowCount--;
    
        $("#supplier_add_po_table tbody tr:last").remove();
        $("#supplier_add_po_table tbody td:last").remove();
        $("#supplier_add_po_table tbody tr:last").append("<td>" +
        "<div class=\"d-flex justify-content-center\">" +
        "<button type=\"button\" class=\"btn btn-secondary ml-2 mr-2\" id=\"add_item_button\"><span class=\"fas fa-plus\"></span></button>" +
        "<button type=\"button\" class=\"btn btn-secondary\" id=\"delete_item_button\"><span class=\"fas fa-trash\"></span></button>" +
        "</div></td></tr>");
    
         $("#add_item_button").on("click", addProductAddRow);
         $("#delete_item_button").on("click", addProductDeleteRow);
    
         if(addProductRowCount == 1) {
            $("#delete_item_button").prop("disabled", true);
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