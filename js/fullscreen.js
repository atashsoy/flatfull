var project = "Full Screen";

    var btn = document.getElementById("button");

    button.addEventListener("click", toggleFullScreen);

    function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
    button.classList.add("exitScreen");
    }
    else {
    cancelFullScreen.call(doc);
    button.classList.remove("exitScreen");
    }
}

var project = "Full Screen";

    var btn = document.getElementById("buttonOne");

    buttonOne.addEventListener("click", toggleFullScreen);

    function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
    buttonOne.classList.add("exitScreen");
    }
    else {
    cancelFullScreen.call(doc);
    buttonOne.classList.remove("exitScreen");
    }
}