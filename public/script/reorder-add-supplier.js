$(document).ready(function () 
{
    var addProductRowCount = 1;


    $("#clear_item_button").on("click", clearAllInputs);

    $("#add_item_button").on("click", addProductAddRow);
    
    $("#delete_item_button").on("click", addProductDeleteRow);

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
});