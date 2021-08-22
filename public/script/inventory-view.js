$(document).ready(function () 
{
    let table = $("#myTable").DataTable( 
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
                console.log("SELECTED " + table.rows().count());
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_modal_button").prop("disabled", false);
                $("#delete_button").prop("disabled", false);
                console.log("SELECTED " + table.rows().count());
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
            $("#delete_button").prop("disabled", true);
        }
    });

    $("#myTable tbody").on("click", "tr td", function () 
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
        var id =  $(".selected").closest("tr").children().eq(1).text();
        var name =  $(".selected").closest("tr").children().eq(2).text();
        var brand =  $(".selected").closest("tr").children().eq(3).text();
        var price =  $(".selected").closest("tr").children().eq(4).text();
        var quantity =  $(".selected").closest("tr").children().eq(5).text();
        var reorder_point =  $(".selected").closest("tr").children().eq(6).text();
        var availability =  $(".selected").closest("tr").children().eq(7).text();

        $("#edit_product_id").val(id);
        $("#edit_product_name").val(name);
        $("#edit_brand").val(brand);
        $("#edit_price").val(price);
        $("#edit_quantity").val(quantity);
        $("#edit_reorder_point").val(reorder_point);
        $("#edit_availability").val(availability);
    });


    // not done
    $("#add_modal_button").on("click", function () 
    {
        // get value from input
        var id =  $("#add_product_id").val();
        var name =  $("#add_product_name").val();
        var brand =  $("#add_brand").val();
        var price =  $("#add_price").val();
        var quantity =  $("#add_quantity").val();
        var reorder_point =  $("#add_reorder_point").val();
        var availability =  $("#add_availability").val();

        $("#myTable").append(
            "<tr><td></td>" + 
            "<td>" + id + "</td>" + 
            "<td>" + name + "</td>" + 
            "<td>" + brand + "</td>" + 
            "<td>" + price + "</td>" + 
            "<td>" + quantity + "</td>" + 
            "<td>" + reorder_point + "</td>" + 
            "<td>" + availability + "</td></tr>");
    });

});