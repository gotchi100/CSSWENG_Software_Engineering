$(document).ready(function () 
{
    let table = $("#report_table").DataTable(
                {
                    rowReorder: true,
                    columnDefs: [
                        { orderable: true, className: 'reorder', targets: 0 },
                        { orderable: false, targets: '_all' }
                    ],
                    "info":     false,
                    "paging":   false,
                    "filter": false
                });
    
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
                    var tempStart = new Date($("#start_range").val());
                    var tempEnd = new Date($("#end_range").val());
                    var count = countItemsInRange(data, tempStart.getTime(), tempEnd.getTime());
                    populateShrinkagesTableRow(data, count);
                }
            });
    
        }
    });

    function countItemsInRange(data, start_range, end_range)
    {
        var ctr = [];
        var temp;
        for(var i = 0; i < data.length; i++)
        {
            temp = new Date(data[i].Date);
            if(temp.getTime() >= start_range && temp.getTime() <= end_range)
            {
                ctr.push(i);
            }
        }
        return ctr;

    }

    function clearReport()
    {
       table.rows().remove().draw(false);
    }

    function populateShrinkagesTableRow(data, ctr)
    {
        var totalAmount = 0;
        for(var i = 0; i < ctr.length; i++)
        {
            table.row.add([data[ctr[i]].Date, data[ctr[i]].ProductName, data[ctr[i]].Brand, data[ctr[i]].Color, 
                            data[ctr[i]].OriginalQuantity, data[ctr[i]].AdjustedQuantity, data[ctr[i]].Difference,
                            data[ctr[i]].Cost]).draw(false);
            totalAmount += data[ctr[i]].Cost;
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

    $("#delete_all").on("click", function(){
       table.rows().remove().draw(false);
    })
});