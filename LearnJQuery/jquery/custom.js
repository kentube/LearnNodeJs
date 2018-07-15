
$(document).ready(function() {

    //document.write("Hello, from jQuery sample!");
    jQuery("p:first").css("background-color", "blue");
    jQuery("p:first").width(150);
    $("p").eq(1).css({"color":"red", "background-color":"green"});
    $("#clickMe").click(function() {
        alert("Hello, you clicker there!");
    });

    $("em").addClass("selected");
    $("#myid").addClass("highlight");
    var custom = $("#myid").attr("custom");
    $("li").eq(2).addClass("selected");
    $("li").filter(".bot").addClass("selected");
    $("p").find("span").addClass("selected");

    $(".box2:first").css("background-color", "blue");
    $(".box2:first").width(150);
    $(".box2").click(function() {
        var content = $(this).html();
        $("#click_result").text(content);
        $(this).replaceWith("<h4>JQuery is great!</43>");
    });

    $(".removeMe").click(function() { $(this).remove(); });
    $(".insertOne").click(function() { $(this).after('<div>Inserted</div>'); });

    $("#loadButton").click(function() { $("#loadResult").load('./jquery/load_result.html'); });
    $("#loadJsonButton").click(function(event) {
        $.getJSON('/jquery/load_result.json', function(jd) {
            $('#loadResult').html('<p>Name: ' + jd.name + '</p>');
            $('#loadResult').append('<p>Age: ' + jd.age + '</p>');
            $('#loadResult').append('<p>Sex: ' + jd.sex + '</p>');
        });
    });
    $("#queryButton").click(function() { $("#loadResult")
    .load('/myquery', {"name": "myname"} ); });
});
