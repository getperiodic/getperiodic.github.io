"use strict";
var classie = require("classie"),
	swipeel,
	vid;

var restartVideo = function () {
	vid.currentTime = 0.1; //setting to zero breaks iOS 3.2, the value won't update, values smaller than 0.1 was causing bug as well.
	vid.play();
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
};

var isMobile = function () {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

document.addEventListener("DOMContentLoaded", function (e) {
	// console.log("isMobile", isMobile());
	var swipe = require('swipe');
	swipeel = document.querySelector('#container');
	vid = (isMobile === true) ? document.querySelector('#indexnovideo') : document.querySelector('#indexvideo');
	if (isMobile === true) {
		document.querySelector('#indexvideo').style.display = "none";
	}
	vid.addEventListener('ended', restartVideo, false);
	sizeAndPositionVideo();
	window.vid = vid;
	window.myswipe = swipe(swipeel);
	window.myswipe.on("showing", function (e) {
		// console.log("e", e);
	});
});

window.addEventListener("resize", function (e) {
	window.myswipe.refresh();
	sizeAndPositionVideo();
});
window.myswipe = null;
