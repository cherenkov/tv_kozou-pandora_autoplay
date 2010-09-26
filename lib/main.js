const pageMod = require("page-mod");
const timer = require('timer');
const {Cc, Ci} = require('chrome');

pageMod.add({
  include: 'http://veohdownload.blog37.fc2.com/blog-entry-*',
  contentScriptWhen: 'ready',
  onAttach: function onAttach(worker, mod) {
    var wmc = Cc["@mozilla.org/appshell/window-mediator;1"]
             .getService(Ci.nsIWindowMediator).getMostRecentWindow("navigator:browser").content;
    var doc = wmc.document;
    var win = wmc.window;

    var movie = doc.getElementById('movie');
    if(!movie) return;

    var embed = movie.getElementsByTagName('embed')[0];
    if(!/\.pandora\.tv\//.test(embed.src)) return;

    embed.src = embed.src.replace(/countryChk=jp/, "countryChk=kr&autoPlay=1");

    var canvas = doc.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    canvas.style.display = "none";
    doc.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var bounds = getElementPosition(movie);
    var x = bounds.left + movie.width/2 - 100;
    var y = bounds.top

    var t = timer.setInterval(function(){
      ctx.drawWindow(win, x, y, 1, 1, "rgb(0,0,0)");
      var color = ctx.getImageData(0, 0, 1, 1).data;
      console.log(color, new Date);
      console.log(win.location)
      if(color == "0,0,0,255" || color == "255,255,255,255") {
        embed.style.display = "none";
        timer.setTimeout(function() embed.style.display = "block", 0);
      } else {
        timer.clearTimeout(t);
      }
    }, 12000);

    function getElementPosition(elem){
      var position=elem.getBoundingClientRect();
      return {
        left:Math.round(win.scrollX+position.left),
        top:Math.round(win.scrollY+position.top)
      }
    }
  }
});
