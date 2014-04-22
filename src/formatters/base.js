/* Our base formatters */
(function(){

  var Bold = SirTrevor.Formatter.extend({
    title: "bold",
    cmd: "bold",
    keyCode: 66,
    text : "B"
  });

  var Italic = SirTrevor.Formatter.extend({
    title: "italic",
    cmd: "italic",
    keyCode: 73,
    text : "i"
  });

  // Link formatters are in linking.js


  /*
    Create our formatters and add a static reference to them
  */
  SirTrevor.Formatters.Bold = new Bold();
  SirTrevor.Formatters.Italic = new Italic();

})();
