import $ from 'jquery';
$(document).ready(function(e) {
    e.preventDefault;
    $("#btnLogin").click(function() {
        $.post(
            "/api/login",
            {
                user: $("#lo-u-name").val(),
                pass: $("#lo-pw").val()    
            },
            function(data) {
                if (data != '') {
                    window.localStorage.setItem("login", "user");
                    window.location.reload();
                }
                else {
                    alert('FAIL');
                }                
            }
        );
    });
});