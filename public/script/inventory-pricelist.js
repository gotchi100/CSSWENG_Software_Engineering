$(document).ready(function () 
{
    let table = $("#inventory_pricelist_table").DataTable( 
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
            $("#delete_button").prop("disabled", true);
        }
    });

    $("#edit_modal_button").on("click", function () 
    {
        // get value from table
        var id =  $(".selected").closest("tr").children().eq(1).text();
        var name =  $(".selected").closest("tr").children().eq(2).text();
        var price =  $(".selected").closest("tr").children().eq(3).text();
        var buying_price =  $(".selected").closest("tr").children().eq(4).text();

        $("#edit_product_id").val(id);
        $("#edit_product_name").val(name);
        $("#edit_price").val(price);
        $("#edit_buying_price").val(buying_price);
    });

});