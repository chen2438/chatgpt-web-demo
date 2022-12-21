const evtSource = new EventSource("test.js");

evtSource.onmessage = function (event) {
    const newElement = document.createElement("li");
    const eventList = document.getElementById("list");

    newElement.innerHTML = "message: " + event.data;
    eventList.appendChild(newElement);
}
