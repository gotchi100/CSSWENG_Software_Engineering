$(document).ready(function () 
{
   
    $("#login_button").on("click", async function()
    {
        if(checkInputs() != true)
        {
            var LoginInfo = {
                Username: $("#username").val().toLowerCase().trim(),
                Password: $("#password").val()
            };
            $.get('/check-login-information', {LoginInfo}, function(result)
            {
                console.log("credentials not found = " + result);
                if(result == "invalidpassword")
                {
                    $("#error_modal_text").text("Password is incorrect!");
                    $("#error_modal").modal("show");
                }
                else if(result == "invalidusername")
                {
                    $("#error_modal_text").text("Username does not exist!");
                    $("#error_modal").modal("show");
                }
                else if(result == "success")
                {
                    window.location.href = '/';
                }
            });
        }

    });


    function checkInputs()
    {
        if($("#username").val() == "" ||  $("#password").val() == "" || $("#password").val().length < 8) 
        {
            return true;
        }
        return false;
    }

});