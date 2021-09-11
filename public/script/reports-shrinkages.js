$(document).ready(function () 
{
    var tableRowCount = 1;
    
    $("#start_range").attr("max", getCurrentDate(2))
    $("#end_range").attr("max", getCurrentDate(2))

    $("#current_date").text(getCurrentDate(1));

    $("#shrinkages-timeline-form").on("input", "#start_range", function ()
    {
        var input = $(this).val();
        var temp = new Date(input);
        $("#date_from").text(getReportDate(temp));
        $("#end_range").val("");
        $("#end_range").prop("disabled", false);
        $("#end_range").attr("min", input)
    });

    $("#shrinkages-timeline-form").on("input", "#end_range", function ()
    {
        var input = $(this).val();
        var temp = new Date(input);
        $("#date_to").text(getReportDate(temp));
    });

    $("#generate_report").on("click", function()
    {
        if($("#start_range").val().length != 0 && $("#end_range").val().length != 0)
        {
            clearReport();

            $.get('/get-shrinkages-report', function(data, status)
            {   
                if(data)
                {
                    addTableRow(data.length);
                    populateShrinkagesTableRow(data);
                }
            });
    
        }
    });

    function clearReport()
    {
        
        $("#date1").text("");
        $("#product_name1").text("");
        $("#brand1").text("");
        $("#original_quantity1").text("");
        $("#adjusted_quantity1").text("");
        $("#difference").text("");
        $("#cost1").text("");
        while(tableRowCount != 1)
        {
            tableRowCount--;
            $("#report_table tbody tr:last").remove();
        }
    }

    function addTableRow(length)
    {
        for(var i = 1; i < length; i++)
        {
            tableRowCount++;
            $("#report_table tbody tr:last").after('<tr>' +
            '<td id="date' + tableRowCount + '"></td>'+
            '<td id="product_name' + tableRowCount + '"></td>'+
            '<td id="brand' + tableRowCount + '"></td>'+
            '<td id="original_quantity' + tableRowCount + '"></td>'+
            '<td id="adjusted_quantity' + tableRowCount + '"></td>'+
            '<td id="difference' + tableRowCount + '"></td>'+
            '<td id="cost' + tableRowCount + '"></td>'+
            '</tr>');

        }
    }

    function populateShrinkagesTableRow(data)
    {
        var totalAmount = 0;
        for(var i = 0; i < data.length; i++)
        {
            $("#date" + (i + 1)).text(data[i].DateAdjusted);
            $("#product_name" + (i + 1)).text(data[i].ProductName);
            $("#brand" + (i + 1)).text(data[i].Brand);
            $("#original_quantity" + (i + 1)).text(data[i].OriginalQuantity);
            $("#adjusted_quantity" + (i + 1)).text(data[i].Quantity);
            var difference = data[i].OriginalQuantity - data[i].Quantity;
            $("#difference" + (i + 1)).text(difference);
            var cost = data[i].BuyingPrice * difference
            $("#cost" + (i + 1)).text(cost);
            totalAmount += cost;
        }
        $("#total_amount").text(totalAmount);
    }
    function getCurrentDate(val) 
    {
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
        
        if(val == 1)
        {
            return month + "/" + day + "/" + year;
        }
        else
        {
            return year + "-" + month + "-" + day;
        }
    };

    function getReportDate(date)
    {
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
    }

});