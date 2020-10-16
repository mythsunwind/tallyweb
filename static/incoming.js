window.onload = function() {

	var xhr = new XMLHttpRequest();
        xhr.open('GET', '/tallyweb/api/incoming');
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.responseType = 'json';

        xhr.onload = function () {
                // Request finished. Do processing here.
		if (xhr.status == 200) {
                	response = xhr.response;
			document.querySelector("#table-body").innerHTML = "";
			response.forEach(time => {
				document.querySelector("#table-body").innerHTML += "<tr><td>" + time + "</td></tr>";
			});
		} else {
			document.querySelector("#table-body").innerHTML = "Konnte die Liste nicht laden";
		}
        };
        xhr.onerror = function() {
		document.querySelector("#table-body").innerHTML = "Konnte die Liste nicht laden";
        };

        xhr.send();
}
