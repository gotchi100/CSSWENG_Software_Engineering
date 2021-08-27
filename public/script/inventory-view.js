$(document).ready(function () 
{
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

    table.on("click", "th.select-checkbox", function() {
    if ($("th.select-checkbox").hasClass("selected")) 
    {
        table.rows().deselect();
        $("th.select-checkbox").removeClass("selected");
        $("#edit_modal_button").prop("disabled", false);
        $("#delete_button").prop("disabled", true);
    } 
    else 
    {
        table.rows().select();
        $("th.select-checkbox").addClass("selected");
        $("#edit_modal_button").prop("disabled", true);
    }
    }).on("select deselect", function() {
        if (table.rows({ selected: true}).count() !== table.rows().count()) 
        {
            if(table.rows({ selected: true}).count() > 1)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", true);
                $("#delete_button").prop("disabled", false);
            }
            else if (table.rows({ selected: true}).count() == 0)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", true);
                $("#delete_button").prop("disabled", true);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", false);
                $("#delete_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_button").prop("disabled", false);
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

    $("#edit_modal_button").on("click", function () 
    {
        // get value from table
        var name =  $(".selected").closest("tr").children().eq(2).text();
        var brand =  $(".selected").closest("tr").children().eq(3).text();
        var price =  $(".selected").closest("tr").children().eq(4).text();
        var quantity =  $(".selected").closest("tr").children().eq(5).text();
        var reorder_point =  $(".selected").closest("tr").children().eq(6).text();

        $("#edit_product_name").val(name);
        $("#edit_brand").val(brand);
        $("#edit_price").val(price);
        $("#edit_quantity").val(quantity);
        $("#edit_reorder_point").val(reorder_point);
    });

    $("#add_product_button").on("click", function () 
    {
        var ProductName = $("#add_product_name").val();
        var Brand = $("#add_brand").val();
        var BuyingPrice = $("#add_buying_price").val();
        var SellingPrice = $("#add_selling_price").val();
        var Quantity = $("#add_quantity").val();
        var ReorderPoint = $("#add_reorder_point").val();

        $.post("/inventory-add-product", {ProductName, Brand, BuyingPrice, SellingPrice, Quantity, ReorderPoint}, function(data, status) {
            
            console.log("POST - Add Product - Status: " + status);
            console.log("POST - Add Product - Data: " + data.ProductId);

            var Availability = ""; 

            if(Quantity > ReorderPoint + 10) {
                Availability = "High"; 
            }else if(Quantity > ReorderPoint + 5) {
                Availability = "Medium"; 
            }else if(Quantity <= ReorderPoint) {
                Availability = "Low";
            } 

            table.row.add(["", data.ProductId, ProductName, Brand, SellingPrice, Quantity, ReorderPoint, Availability]).draw(false);

            $("#add_product_name").val("");
            $("#add_brand").val("");
            $("#add_buying_price").val("");
            $("#add_selling_price").val("");
            $("#add_quantity").val("");
            $("#add_reorder_point").val("");
            $("#add_modal").modal("hide");
        })
        
    });
    $("#delete_button").on("click", function () 
    {
        var count = table.rows('.selected').data().length;
        var data = table.rows( { selected: true } ).data();
        var tempProductId = [];
        //if only one item is selected
        if(count == 1) {
            tempProductId = data[0][1];
            $.post("/inventory-delete-one-product", {tempProductId}, function(data, status) {
                console.log("POST - Delete One Product - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        //if only multiple items are selected
        else {
            for(var i = 0; i < count; i++) {
                tempProductId[i] = data[i][1];
            }
            var ProductId = JSON.stringify(tempProductId);
            $.post("/inventory-delete-many-product", {ProductId}, function(data, status) {
                console.log("POST - Delete Many Products - Status: " + status);
                table.rows(".selected").remove().draw(false);
            })
        }
        
    });

});