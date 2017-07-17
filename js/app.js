$(document).ready(function() {
  $("#projects").hide()
  $("#skills").hide()
  $("#contact").hide()
  $("#about").show()

  $("#navbar li a").on("click", function(event) {
    event.preventDefault();

    $("#navbar li a.active").removeClass("active");
    $(".container").hide();
    $(this).addClass("active");

    var tab = $(this).attr("href");
    $(tab).fadeIn(2000);
  })
});
