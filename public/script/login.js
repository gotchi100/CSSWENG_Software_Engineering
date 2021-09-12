$(document).ready(function () 
{
   
    $("#login_button").on("click", async function()
    {
        if(checkInputs() != true)
        {
            $("#password").removeClass("input-border-error");
            $("#username").removeClass("input-border-error");
            var LoginInfo = {
                Username: $("#username").val().toLowerCase().trim(),
                Password: $("#password").val()
            };
            $.get('/check-login-information', {LoginInfo}, function(result)
            {
                if(result == "invalidpassword")
                {
                    $("#username").removeClass("input-border-error");
                    $("#password").addClass("input-border-error");
                    $("#error_modal_text").text("Password is incorrect!");
                    $("#error_modal").modal("show");
                }
                else if(result == "invalidusername")
                {
                    $("#username").addClass("input-border-error");
                    $("#password").removeClass("input-border-error");
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