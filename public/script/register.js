$(document).ready(function () 
{
   
    $("#register_button").on("click", async function()
    {
        if(checkInputs() != true)
        {
            var usernameAvailable = await isUsernameAvailable();
            var emailAvailable = await isEmailAvailable();
    
            if(!usernameAvailable || !emailAvailable)
            {
                if(!usernameAvailable && !emailAvailable)
                {
                    $("#error_modal_text").text("Username and Email are taken!");
                }
                else if(!usernameAvailable)
                {
                    $("#error_modal_text").text("Username is taken!");
                }
                else if(!emailAvailable)
                {
                    $("#error_modal_text").text("Email is taken!");
                }
                $("#error_modal").modal("show");
            }
            else
            {
                var AccountInfo = {
                    FirstName: $("#first_name").val(),
                    LastName: $("#last_name").val(),
                    Username: $("#username").val().toLowerCase(),
                    Email: $("#email").val().toLowerCase(),
                    Role: $("#role :selected").text(),
                    Password: $("#password").val()
                }
                
    
                $.post('/submit-register', {AccountInfo}, function(data, status)
                {
                    console.log("Post - Register - Status: " + status);

                    $("#success_modal").modal("show");
                });
    
            }
        }
        else if($("#confirm_password").val() != $("#password").val())
        {
            $("#error_modal_text").text("Passwords do not match!");
            $("#error_modal").modal("show");
        }

    });

    $("#username").keyup(function()
    {
        var username = $(this).val().toLowerCase();
        $.get('/check-register-username', {username}, function(result)
        {
            if(result.Username == null)
            {
                $("#username_error").text("");
            }
            else
            {
                $("#username_error").text("Username is taken!");
            }
        });
    });

    $("#email").keyup(function()
    {
        var email = $(this).val().toLowerCase();
        $.get('/check-register-email', {email}, function(result)
        {
            if(result.Email == null)
            {
                $("#email_error").text("");
            }
            else
            {
                $("#email_error").text("Email is taken!");
            }
        });

    });

    $("#confirm_password").keyup(function()
    {
        if($(this).val() != $("#password").val())
        {
            $("#confirm_password_error").text("Passwords do not match!");
        }
        else
        {
            $("#confirm_password_error").text("");
        }
    });

    $("#close_success_modal_button").on("click", function()
    {
        window.location.href = '/';
    });

    async function isUsernameAvailable()
    {
        var username = $("#username").val().toLowerCase();
        var err = true;
        await $.get('/check-register-username', {username}, function(result)
        {
            if(result.Username)
            {
                err = false;
            }
        });

        return err;
    }

    async function isEmailAvailable()
    {
        var email = $("#email").val().toLowerCase();
        var err = true;
        await $.get('/check-register-email', {email}, function(result)
        {
            if(result.Email)
            {
                err = false;
            }
        });
        
        return err;
    }

    function checkInputs()
    {
        if($("#first_name").val() == "" || $("#last_name").val() == "" || $("#username").val() == "" || $("#email").val() == "" ||
            $("#role").text() == "" || $("#password").val() == "" || $("#confirm_password").val() == "" || $("#password").val().length < 8 || 
            $("#confirm_password").val().length < 8 || ($("#confirm_password").val() != $("#password").val())) 
        {
            return true;
        }

        return false;
    }

});