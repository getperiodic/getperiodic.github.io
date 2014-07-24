"use strict";
var classie = require("classie"),
	swipeel,
	t,
	flippedPanels = false,
	vid;

var restartVideo = function () {
	vid.currentTime = 0.1; //setting to zero breaks iOS 3.2, the value won't update, values smaller than 0.1 was causing bug as well.
	vid.play();
};

var isMobile = function () {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

var lazyloadPanes = function () {
	var panes = document.querySelectorAll(".pane.lazyload");
	for (var x in panes) {
		if (typeof panes[x] === "object") {
			classie.removeClass(panes[x], "lazyload");
		}
	}
};

var lazyloadVid = function () {
	classie.removeClass(vid, "lazyload");
};

var flipPanels = function (argument) {
	var panels = document.querySelectorAll("#pane2 .panel"),
		numpanels = panels.length,
		i = 0,
		interval;
	flippedPanels = true;
	interval = setInterval(function () {
		if (i < numpanels) {
			classie.removeClass(panels[i], "flip");
		}
		else {
			clearInterval(interval);
		}
		i++;
	}, 800);
};

var sizeAndPositionVideo = function () {
	if (vid.clientWidth > window.innerWidth || vid.clientHeight < window.innerHeight) {
		if (vid.clientWidth > window.innerWidth) {
			var offsetMarginLeft = (vid.clientWidth - window.innerWidth) / 2 * -1;
			vid.style["margin-left"] = offsetMarginLeft + 'px';
		}
		vid.style.width = 'auto';
		vid.style.height = '100%';
	}
	else if (vid.clientWidth <= window.innerWidth) {
		vid.style.width = '100%';
		vid.style.height = 'auto';
		vid.style["margin-left"] = '0px';
		// var offsetMarginTop = (vid.clientHeight - window.innerHeight) / 2 * -1;
		// vid.style.top = offsetMarginTop + 'px';
	}
	if (classie.hasClass(vid, "lazyload")) {
		lazyloadVid();
	}
};

document.addEventListener("DOMContentLoaded", function (e) {
	var swipe = require('swipe');
	swipeel = document.querySelector('#container');
	vid = (isMobile()) ? document.querySelector('#indexnovideo') : document.querySelector('#indexvideo');
	if (isMobile()) {
		document.querySelector('#indexvideo').parentElement.removeChild(document.querySelector('#indexvideo'));
	}
	else {
		document.querySelector('#indexnovideo').parentElement.removeChild(document.querySelector('#indexnovideo'));
	}
	vid.addEventListener('ended', restartVideo, false);
	vid.addEventListener("load", sizeAndPositionVideo);
	vid.addEventListener("loadeddata", sizeAndPositionVideo);
	document.querySelector('#goto-next-page').addEventListener("click", function () {
		window.myswipe.cycle();
	});
	window.vid = vid;
	window.myswipe = swipe(swipeel);
	window.myswipe.on("showing", function (e) {
		clearTimeout(t);
		if (e === 1 && flippedPanels === false) {
			flipPanels();
		}
	});
	// sizeAndPositionVideo();
	lazyloadPanes();
	t = setTimeout(function () {
		if (window.myswipe.current === 0) {
			window.myswipe.show(1);
		}
	}, 10000);
});

window.addEventListener("resize", function (e) {
	window.myswipe.refresh();
	sizeAndPositionVideo();
});
// window.myswipe = null;
