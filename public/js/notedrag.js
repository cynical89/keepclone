﻿function stopDefault(e)
{
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    else {
        window.event.returnValue = false;
    }
    return false;
}

var noteDrag = {
	mouseDown: [false, false, false, false],
	dragTarget: {name: "", x: -1, y: -1},
	noteSpace: {width: -1, height: -1},
	noteCount: 5,
				
	toFront: function(w)
	{
		w = parseInt(w.substring(5));
		var el = document.getElementById("noteN"+w);
		el.style.zIndex = noteDrag.noteCount-1;
		for(var i = 0; i < noteDrag.noteCount; i++)
		if(i != w) document.getElementById("noteN"+i).style.zIndex--;
	},
	
	pos: function(el) {
	    var rect = el.getBoundingClientRect(),
	    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	},
	
	clamp: function(x,y,z) {
		if(x < y) return y;
		if(x > z) return z;
		return x;
	},
	
	toggleSelect: function(w, on) {
		var el = document.getElementById("w");
		el.style.userSelect = on;
		el.style.mozUserSelect = on;
	},
	
	getRightMost: function() {
		var p = 0;
		for(var i = 0; i < noteDrag.noteCount; i++)
		{
			var el = document.getElementById("noteN"+i);
			p = Math.max(el.offsetLeft+el.offsetWidth, p);
		}
		return p;
	},
	
	getBottomMost: function() {
		var p = 0;
		for(var i = 0; i < noteDrag.noteCount; i++)
		{
			var el = document.getElementById("noteN"+i);
			p = Math.max(el.offsetTop+el.offsetHeight, p);
		}
		return p;
	},
	
	getNoteSpaceDimensions: function() {
		return {width: document.documentElement.clientWidth-32, height: document.documentElement.clientHeight-128};
	},
	
	setNoteSpaceDimensions: function(w, h) {
		var el = document.getElementById("main");
		el.style.width = w + "px";
		el.style.height = h + "px";
		noteDrag.noteSpace = {width: w, height: h};
	},
	
	refreshNoteSpaceDimensions: function() {
		var dim = noteDrag.getNoteSpaceDimensions();
		noteDrag.setNoteSpaceDimensions(dim.width, dim.height);
	}

};

noteDrag.refreshNoteSpaceDimensions();

document.addEventListener("mousedown", function(e) {
    var target = e.target || e.srcElement,
        text = target.textContent || text.innerText;
	
	noteDrag.mouseDown[e.which] = true;
	
	if(e.which == 1 && target.id.indexOf("noteN") == 0)
	{
		var el = document.getElementById(target.id);
		var pos = noteDrag.pos(el);
		noteDrag.dragTarget = {name: target.id, x: pos.left-e.clientX-32, y: pos.top-e.clientY-106};
		noteDrag.toFront(target.id);
	}
	
	if(target.parentElement.id.indexOf("noteN") == 0)
	noteDrag.toFront(target.parentElement.id);
});

document.addEventListener("mousemove", function(e) {
	if(noteDrag.mouseDown[1] && noteDrag.dragTarget.name != "")
	{
		var el = document.getElementById(noteDrag.dragTarget.name);
		el.style.left = noteDrag.clamp(noteDrag.dragTarget.x+e.clientX, 0, document.getElementById("main").clientWidth-el.offsetWidth-32) + "px";
		el.style.top = noteDrag.clamp(noteDrag.dragTarget.y+e.clientY, 0, document.getElementById("main").clientHeight-el.offsetHeight-64) + "px";
	}
});

document.addEventListener("mouseup", function(e) {
	noteDrag.mouseDown[e.which] = false;
	noteDrag.dragTarget = {name: "", x: -1, y: -1};
});

document.onmousedown = function(e) {
	if(noteDrag.dragTarget.name != "") stopDefault(e);
};

window.onresize = function() {
	var dim = noteDrag.getNoteSpaceDimensions();
	var w = Math.max(noteDrag.getRightMost()+32, dim.width);
	var h = Math.max(noteDrag.getBottomMost()+32, dim.height);
	
	noteDrag.setNoteSpaceDimensions(w, h);
};