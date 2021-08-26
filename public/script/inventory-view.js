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
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/inventory-add-product', true);
        
        //console.log("XHTTP instance created!");
    
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
        xhttp.onload = function() {
            
            console.log("POST - Add Product - Status: " + this.status);

            var product_id = (table.column(1).data() > 0) ? (Math.max.apply(Math, table.column(1).data()) + 1) : 1;

            var availability = ""; 

            if(quantity > reorder_point + 10) {
                availability = "High"; 
            }else if(quantity > reorder_point + 5) {
                availability = "Medium"; 
            }else if(quantity <= reorder_point) {
                availability = "Low";
            } 

            table.row.add(["", product_id, name, brand, selling_price, quantity, reorder_point, availability]).draw(false);

            $("#add_product_name").val("");
            $("#add_brand").val("");
            $("#add_buying_price").val("");
            $("#add_selling_price").val("");
            $("#add_quantity").val("");
            $("#add_reorder_point").val("");
            $("#add_modal").modal("hide");
        };
        
        var name = $("#add_product_name").val();
        var brand = $("#add_brand").val();
        var buying_price = $("#add_buying_price").val();
        var selling_price = $("#add_selling_price").val();
        var quantity = $("#add_quantity").val();
        var reorder_point = $("#add_reorder_point").val();

        xhttp.send("&ProductName=" + name
                + "&Brand=" + brand
                + "&BuyingPrice=" + buying_price
                + "&SellingPrice=" + selling_price
                + "&Quantity=" + quantity
                + "&ReorderPoint=" + reorder_point);
    });

    $("#delete_button").on("click", function () 
    {
        var count = table.rows('.selected').data().length;

        if(count == 1) {
            var xhttp = new XMLHttpRequest();

            xhttp.open('POST', '/inventory-delete-one-product', true);
            
            //console.log("XHTTP instance created!");
        
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
            xhttp.onload = function() {
                console.log("POST - Delete One Product - Status: " + this.status);
            };

            var ProductId =  $(".selected").closest("tr").children().eq(1).text();
            table.rows(".selected").remove().draw(false);
            xhttp.send("ProductId=" + ProductId);
        }
        else {
            var xhttp = new XMLHttpRequest();

            xhttp.open('POST', '/inventory-delete-many-product', true);
            
            //console.log("XHTTP instance created!");
        
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
            xhttp.onload = function() {
                console.log("POST - Delete Many Product - Status: " + this.status);
            };

            var data = table.rows( { selected: true } ).data();

            var ProductId = [];
            for(var i = 0; i < count; i++) {
                ProductId[i] = data[i][1];
            }
            table.rows(".selected").remove().draw(false);

            xhttp.send("ProductId=" + JSON.stringify(ProductId));
        }
        
    });

});