function stopDefault(e)
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
		w = parseInt(w.substring(4));
		var el = document.getElementById("note"+w);
		el.style.zIndex = noteDrag.noteCount-1;
		for(var i = 0; i < noteDrag.noteCount; i++)
		if(i != w) document.getElementById("note"+i).style.zIndex--;
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
	
	getNoteSpaceDimensions: function() {
		return {width: document.documentElement.clientWidth, height: document.documentElement.clientHeight-100};
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
	
	if(e.which == 1 && target.id.indexOf("note") == 0)
	{
		var el = document.getElementById(target.id);
		var pos = noteDrag.pos(el);
		noteDrag.dragTarget = {name: target.id, x: pos.left-32, y: pos.top-96};
		noteDrag.toFront(target.id);
	}
	
	if(target.parentElement.id.indexOf("note") == 0)
	noteDrag.toFront(target.parentElement.id);
});

document.addEventListener("mousemove", function(e) {
	if(noteDrag.mouseDown[1] && noteDrag.dragTarget.name != "")
	{
		var el = document.getElementById(noteDrag.dragTarget.name);
		noteDrag.dragTarget.x = noteDrag.clamp(noteDrag.dragTarget.x+e.movementX, 0, document.getElementById("main").offsetWidth-el.offsetWidth-64);
		noteDrag.dragTarget.y = noteDrag.clamp(noteDrag.dragTarget.y+e.movementY, 0, document.getElementById("main").offsetHeight-el.offsetHeight-64);
		el.style.top = noteDrag.dragTarget.y + "px";
		el.style.left = noteDrag.dragTarget.x + "px";
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
};