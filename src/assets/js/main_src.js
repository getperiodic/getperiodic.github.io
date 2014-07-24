"use strict";
var classie = require("classie"),
	swipeel,
	t,
	flippedPanels = false,
	expandedLayers = false,
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
	}, 500);
};

var expandLayers = function () {
	expandedLayers = true;
	var figurediagram = document.querySelector("#pane3 figure.diagram"),
		t;

	t = setTimeout(function () {
		classie.removeClass(figurediagram, 'expanded');
	}, 1000);
};

var setSectionListeners = function () {
	var figuresections = document.querySelectorAll("#pane3 figure.diagram section"),
		figureSectionClick = function (e) {
			// console.log(e.target);
			classie.toggleClass(e.target, 'detail');
		};

	for (var z in figuresections) {
		if (typeof figuresections[z] === "object") {
			figuresections[z].addEventListener("click", figureSectionClick);
		}
	}
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

var setNextButtonListners = function () {
	var nextButtons = document.querySelectorAll('.goto-next-page'),
		nextButtonClick = function () {
			window.myswipe.cycle();
		};

	for (var z in nextButtons) {
		if (typeof nextButtons[z] === "object") {
			nextButtons[z].addEventListener("click", nextButtonClick);
		}
	}
};

document.addEventListener("DOMContentLoaded", function (e) {
	var swipe = require('swipe'),
		Mousetrap = require("Mousetrap");

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
	Mousetrap.bind('right', function () {
		window.myswipe.next();
	});
	Mousetrap.bind('left', function () {
		window.myswipe.prev();
	});
	setNextButtonListners();
	setSectionListeners();
	window.vid = vid;
	window.myswipe = swipe(swipeel);
	window.myswipe.on("showing", function (e) {
		clearTimeout(t);
		if (e === 1 && flippedPanels === false) {
			flipPanels();
		}
		if (e === 2 && expandedLayers === false) {
			expandLayers();
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
