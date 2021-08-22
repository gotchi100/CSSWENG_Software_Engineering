$(document).ready(function () 
{
    let table = $('#myTable').DataTable( 
    {
        columnDefs: [{
                    orderable: false,
                    className: 'select-checkbox',
                    targets: 0
                    }],
        select: {
                style: 'os',
                selector: 'td:first-child'
                },
        order: [
                [1, 'asc']
                ]
    });

    table.on("click", "th.select-checkbox", function() {
    if ($("th.select-checkbox").hasClass("selected")) 
    {
        table.rows().deselect();
        $("th.select-checkbox").removeClass("selected");
        $("#edit_button").prop("disabled", false);
        $("#delete_button").prop("disabled", true);
    } 
    else 
    {
        table.rows().select();
        $("th.select-checkbox").addClass("selected");
        $("#edit_button").prop("disabled", true);
    }
    }).on("select deselect", function() {
        if (table.rows({ selected: true}).count() !== table.rows().count()) 
        {
            if(table.rows({ selected: true}).count() > 1)
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_button").prop("disabled", true);
                $("#delete_button").prop("disabled", false);
            }
            else
            {
                $("th.select-checkbox").removeClass("selected");
                $("#edit_button").prop("disabled", false);
                $("#delete_button").prop("disabled", false);
            }
        } 
        else 
        {
            $("th.select-checkbox").addClass("selected");
        }
    });

    $('#myTable tbody').on('click', 'tr td', function () 
    {
        if ($(this).index() != 0) 
        { 
            var name = $(this).closest("tr").children().eq(2).text()
            var price = $(this).closest("tr").children().eq(4).text()
            var quantity = $(this).closest("tr").children().eq(5).text()
            $('#details_modal').modal("show");
            $('#details_product_name span').text(name);
            $('#details_price span').text(price);
            $('#details_quantity span').text(quantity);
             
        }
    });

});