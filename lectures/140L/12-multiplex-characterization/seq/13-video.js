/* ------------------------------------------------------------------ *
 * 13-video.js : play an embedded video full screen from a slide.
 *
 * Turns every  <button class="playvid" data-yt="<id>">  into a control
 * that opens the video full screen and plays it.  JCA asked for this on
 * 2026-11-17 for source 13, whose source slide carries the YouTube URL
 * as a bare line of text that someone would have to read out and type.
 *
 * WHY A BUTTON AND NOT AN IFRAME ON THE SLIDE.  An iframe on the slide
 * loads YouTube on every visit to the section, contacts Google whether
 * or not anyone watches, and puts a focusable thing in the tab order of
 * a slide that is not about the video.  Nothing is loaded here until
 * the control is pressed.
 *
 * THE KEY TRAP IS THE POINT, NOT A DETAIL.  deck.js listens for keydown
 * on document and advances the deck on ArrowRight, ArrowDown, Space,
 * PageDown and "n".  Space is also how you pause a video.  Without a
 * trap, pausing the video advances the slide behind it, and the
 * presenter comes out of the video somewhere they did not expect.  So
 * while the overlay is open every keydown is stopped in the CAPTURE
 * phase, before deck.js sees it, and only Escape is acted on.
 *
 * nocookie.com, and no "rel" of other channels' videos.
 * ------------------------------------------------------------------ */
(function(){
"use strict";

var open = null;

function trap(e){
  /* capture phase: deck.js never sees these */
  e.stopPropagation();
  if (e.key === "Escape"){ e.preventDefault(); close(); }
}

function close(){
  if (!open) return;
  var o = open; open = null;
  document.removeEventListener("keydown", trap, true);
  if (document.fullscreenElement === o && document.exitFullscreen){
    document.exitFullscreen().catch(function(){});
  }
  o.remove();
  if (o.returnFocus && o.returnFocus.focus) o.returnFocus.focus();
}

function play(btn){
  if (open) return;
  var id = btn.getAttribute("data-yt");
  if (!id) return;

  var o = document.createElement("div");
  o.className = "vidovl";
  o.returnFocus = btn;

  var frame = document.createElement("iframe");
  frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
              "?autoplay=1&rel=0&modestbranding=1";
  frame.title = btn.getAttribute("data-title") || "Video";
  frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
  frame.setAttribute("allowfullscreen", "");
  frame.setAttribute("frameborder", "0");

  var x = document.createElement("button");
  x.className = "vidclose";
  x.type = "button";
  x.textContent = "Close";
  x.addEventListener("click", close);

  o.appendChild(frame);
  o.appendChild(x);
  document.body.appendChild(o);
  open = o;

  document.addEventListener("keydown", trap, true);
  if (o.requestFullscreen) o.requestFullscreen().catch(function(){});
  x.focus();
}

function wire(){
  var list = document.querySelectorAll("button.playvid");
  for (var i = 0; i < list.length; i++){
    (function(b){
      b.addEventListener("click", function(e){
        e.preventDefault(); e.stopPropagation(); play(b);
      });
    })(list[i]);
  }
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wire);
else wire();

})();
