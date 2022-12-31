$("h1").css("color", "lightpink");
$("h1").css("font-size", "10rem");

$(document).keypress(function(event){
  $("h1").text(event.key);
});

console.log($("a").attr("href"));
$("a").attr("href", "https://www.duckduckgo.com");
