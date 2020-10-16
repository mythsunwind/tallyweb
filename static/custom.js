const triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));
console.log(triggers)

window.addEventListener('click', (ev) => {
  const elm = ev.target;
  if (triggers.includes(elm)) {
	  const selector = elm.getAttribute('data-target');
	  collapse(selector, 'toggle');
  }
}, false);


const fnmap = {
  'toggle': 'toggle',
  'show': 'add',
  'hide': 'remove'
};
const collapse = (selector, cmd) => {
  const targets = Array.from(document.querySelectorAll(selector));
  targets.forEach(target => {
    target.classList[fnmap[cmd]]('show');
  });
}

function enter() {
	if (document.querySelector("#plus-button").hasAttribute("disabled")) return;

	document.querySelector("#plus-button").setAttribute("disabled", true);
	document.querySelector("#plus-text").classList.add("hide");
	document.querySelector("#plus-spinner").classList.remove("hide");
	document.querySelector("#guests-number").classList.add("hide");
	document.querySelector("#guests-spinner").classList.remove("hide");

	var xhr = new XMLHttpRequest();
	xhr.open('PUT', '/tallyweb/api/incoming');
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = 'json';

	xhr.onload = function () {
		if (xhr.status == 200) {
			// Request finished. Do processing here.
			response = xhr.response;
			guests = Number(response.incoming) - Number(response.outgoing);
			document.querySelector("#guests-number").innerHTML = guests;
			document.querySelector("#incoming-number").innerHTML = Number(response.incoming);
			document.querySelector("#outgoing-number").innerHTML = Number(response.outgoing);
			document.querySelector("#guests-number").classList.remove("hide");
			document.querySelector("#guests-spinner").classList.add("hide");
			document.querySelector("#plus-text").classList.remove("hide");
			document.querySelector("#plus-spinner").classList.add("hide");
			ding.play();
			setTimeout('document.querySelector("#plus-button").removeAttribute("disabled")', 1000);
		} else {
			// TODO: show error
		}
	};
	xhr.onerror = function() {
		// TODO: Show error message
		document.querySelector("#plus-button").removeAttribute("disabled");
	};

	xhr.send();
}

function exit() {
	// Do not make request when old request + audio has not finished
	if (document.querySelector("#minus-button").hasAttribute("disabled")) return;

	document.querySelector("#minus-button").setAttribute("disabled", true);
	document.querySelector("#minus-text").classList.add("hide");
	document.querySelector("#minus-spinner").classList.remove("hide");
	document.querySelector("#guests-number").classList.add("hide");
	document.querySelector("#guests-spinner").classList.remove("hide");

	var xhr = new XMLHttpRequest();
	xhr.open('PUT', '/tallyweb/api/outgoing');
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = 'json';

	xhr.onload = function () {
		if (xhr.status == 200) {
			// Request finished. Do processing here.
			response = xhr.response;
			guests = Number(response.incoming) - Number(response.outgoing);
			document.querySelector("#guests-number").innerHTML = guests;
			document.querySelector("#incoming-number").innerHTML = Number(response.incoming);
			document.querySelector("#outgoing-number").innerHTML = Number(response.outgoing);
			document.querySelector("#guests-number").classList.remove("hide");
			document.querySelector("#guests-spinner").classList.add("hide");
			document.querySelector("#minus-text").classList.remove("hide");
			document.querySelector("#minus-spinner").classList.add("hide");
			dong.play();
			setTimeout('document.querySelector("#minus-button").removeAttribute("disabled")', 1000);
		} else {
			// Show error
			document.querySelector('#alert-text').innerHTML = xhr.responseURL + " returned " + xhr.status + ":" + xhr.statusText;
			document.querySelector('.alert').classList.add('show');
		}
	};
	xhr.onerror = function(e) {
		// Show error message
		document.querySelector('#alert-text').innerHTML = e;
		document.querySelector('.alert').classList.add('show');
		document.querySelector("#minus-button").removeAttribute("disabled");
	};

	xhr.send();
}

function update() {
	counter = 10;
	document.querySelector("#guests-number").classList.add("hide");
	document.querySelector("#guests-spinner").classList.remove("hide");
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '/tallyweb/api/current');
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.responseType = 'json';

	xhr.onload = function () {
		// Request finished. Do processing here.
		if (xhr.status == 200) {
			response = xhr.response;
			guests = Number(response.incoming) - Number(response.outgoing);
			document.querySelector("#guests-number").innerHTML = guests;
			document.querySelector("#incoming-number").innerHTML = Number(response.incoming);
			document.querySelector("#outgoing-number").innerHTML = Number(response.outgoing);
			document.querySelector("#guests-number").classList.remove("hide");
			document.querySelector("#guests-spinner").classList.add("hide");
		} else {
			// Wenn das update nicht klappt
			document.querySelector('#alert-text').innerHTML = "Kann gerade nicht die aktuellen Gäste feststellen. Probier mal die Seite neu zu laden.";
			document.querySelector('.alert').classList.add('show');
		}
	};
	xhr.onerror = function() {
		// Wenn das update nicht klappt
		document.querySelector('#alert-text').innerHTML = "Kann gerade nicht die aktuellen Gäste feststellen. Probier mal die Seite neu zu laden.";
		document.querySelector('.alert').classList.add('show');
	};

	xhr.send();
}

function countdown() {
	counter = counter - 1;
	if (counter >= 0) {
		document.querySelector("#update-countdown").innerHTML = Number(counter);
	} else {
		document.querySelector("#update-countdown").innerHTML = "-";
	}
}

var ding = new Audio("static/ding.mp3");
var dong = new Audio("static/dong.mp3");

function mute() {
	if (ding.muted && dong.muted) {
		ding.muted = false;
		dong.muted = false;
	} else {
		ding.muted = true;
		dong.muted = true;
	}
}

var counter = 10;

window.onload = function() {
	update();
	setInterval("update()", 10000);
	counter = 10
	setInterval("countdown()", 1000);
}

document.onkeypress = function (e) {
    var evt = window.event || e;
    switch (evt.keyCode) {
        case 43:  
            enter();
            break;
        case 45:  
            exit();
            break;
    }
}

