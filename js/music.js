const form = document.querySelector(".search-form");
const front = document.querySelector(".front");
const play = document.querySelector(".play-wrap");
const back = document.querySelector(".back");
const loop = document.querySelector(".repeat");
const search = document.querySelector(".search-button");
const progress = document.querySelector(".progress");
const playHead = document.querySelector(".circle");
const effect = document.querySelector(".effects-option");
const sample = document.querySelector(".samples-option");
var playlist = document.querySelector(".playlist");
var playlistItems;
const audio = new Audio();
var soundMode = "Effects";
var searchResults;
var index = 0;
var animate;
var movePlayhead;
var pageNumber = 1;
var allData = [];


progress.addEventListener("mousedown", function (event) {
	var playHeadPercent = (event.x / progress.clientWidth) * 100;
	document.querySelector(".played").style.width = playHeadPercent - 15 + "%";
	gsap.set(".circle", {
		left: event.x - 45
	});
	Draggable.get(".circle").startDrag(event);
});

function windowNormalize() {
	var playerHeight = document.querySelector(".player-window").clientHeight;
	var titleHeight = document.querySelector(".app-title").clientHeight;
	document.querySelector(".playlist-window").style.height =
		playerHeight - titleHeight + "px";
}

form.addEventListener("submit", function (e) {
	input = document.querySelector(".sound-search").value;
	//reset search page
	pageNumber = 1;
	if (soundMode == "Effects") {
		getEffects(e);
	} else if (soundMode == "Samples") {
		getSamples(e);
	}
});

//run an empty search on start
var submit = new Event('submit');
setTimeout(() =>{
	form.dispatchEvent(submit);
}, 500);

window.addEventListener("load", windowNormalize());
window.addEventListener("resize", windowNormalize());

search.addEventListener("click", function (e) {
	input = document.querySelector(".sound-search").value;
	//reset search page
	pageNumber = 1;
	if (soundMode == "Effects") {
		getEffects(e);
	} else if (soundMode == "Samples") {
		getSamples(e);
	}
});

loop.addEventListener("click", function (e) {
	if (audio.loop) {
		audio.loop = false;
	} else {
		audio.loop = true;
	}
	loop.classList.toggle("looping");
});

front.addEventListener("click", nextSound);
play.addEventListener("click", (e) => togglePlay(e));
back.addEventListener("click", lastSound);

effect.addEventListener("click", (e) => {
	soundMode = "Effects";
	document.querySelector(".current-type").innerHTML = "Effects";
});
sample.addEventListener("click", (e) => {
	soundMode = "Samples";
	document.querySelector(".current-type").innerHTML = "Samples";
});

function togglePlay(event) {
	if (!audio.paused) {
		audio.pause();
		document.querySelector(".play-wrap").classList.remove("playing");
		animatePlayHead(false);
	} else {
		audio.play();
		document.querySelector(".play-wrap").classList.add("playing");
		animatePlayHead(true);
	}
}

//allows us to drag the playhead
Draggable.create(".circle", {
	type: "left",
	bounds: ".progress",
	onClick: function () {
		animatePlayHead(false);
	},
	onDrag: function () {
		animatePlayHead(false);
		var playHeadPercent =
			(this.x / this.target.parentElement.parentElement.clientWidth) * 100;
		document.querySelector(".played").style.width = playHeadPercent + "%";
	},
	onDragEnd: function (e) {
		var playHeadPercent =
			(this.x / this.target.parentElement.parentElement.clientWidth) * 100;
		if (audio.currentSrc != "") {
			audio.currentTime = audio.duration * (playHeadPercent / 100) + 0.2;
			if (!audio.paused) {
				animatePlayHead(true);
			}
		}
	}
});

async function getSamples(event) {
	//stops the click events default behavior
	if (event) {
		event.preventDefault();
	}
	
	//origin header for proxy server
	var headers = { origin: "samplefocus.com" };
	//bypasses cors policy via my proxy server
	var proxyUrl = "https://api.allorigins.win/get?url=https://";
	var url = `samplefocus.com/samples?search=${input}&page=${pageNumber}`;
	var final = proxyUrl + url;

	//fetch the page that has the sounds we're looking for
	var response = await fetch(final, headers).then(async (response) => {
		//parse the recieved html page into a format
		//we can use the query selector on
		var text = await response.text();
		const parser = new DOMParser();
		return parser.parseFromString(text, "text/html");
	});

	let soundTitles = response.documentElement.getElementsByClassName('\\"card-title-text\\"');
	/*response.documentElement.children[1].children[30].children[0].children[4].children[2].children[1].children[0].children[1].children[0].children[0].children[6].lastChild
	console.log(soundTitles.className);*/
	let soundArtists = response.documentElement.getElementsByClassName('\\"by-author\\"');

	console.log("Page " + pageNumber + " Loaded!");
	//clear out data
	allData = [];
	//reset current sound to 0
	index = 0;
	//empty out current playlist
	playlist.innerHTML = "";
	//combine the sample data into a single array
	sampleCombiner(soundTitles, soundArtists);
	//fill the playlist with the currently loaded sounds
	fillPlaylist();
	//display sample data in player
	displaySample();
	//scroll back to the top of the playlist
	var active = document.querySelector(".active");
	gsap.to(".playlist-body", {
				duration: 0.8,
				scrollTop: active.offsetTop - 250
			});
}

function sampleCombiner(titles, artists) {
	for (i = 0; i < titles.length; i++) {
		var title = titles[i].innerHTML;
		var name = artists[i].nextElementSibling.innerHTML;
		var link = titles[i].parentElement.parentElement.children[2].defaultValue;
		link = link.replaceAll("\\", "").replaceAll('"', "");
		allData[i] = { title: title, link: link, artistname: name };
	}
	//console.log(allData);
}

function fillPlaylist() {
	if (allData.length > 0) {
		for (let i = 0; i < allData.length; i++) {
			//creates the playlist element
			var soundTitle = allData[i].title;
			var artistName = allData[i].artistname;
			var image = allData[i].image;
			var playlistItem = document.createElement("div");
			playlistItem.classList.add("playlist-item");
			var titleElem = document.createElement("h3");
			titleElem.classList.add("item-name");
			titleElem.innerHTML = soundTitle;
			var artistElem = document.createElement("h4");
			artistElem.classList.add("artist-name");
			artistElem.innerHTML = artistName;
			var imageElem = document.createElement("img");
			imageElem.classList.add("image-item");
			imageElem.innerHTML = image;
			playlistItem.append(titleElem);
			playlistItem.append(artistElem);
			playlistItem.append(imageElem);
			//adds the element to the playlist
			playlist.append(playlistItem);
		}
		storePlaylist();
	}
}

//adds all of the playlist items to an array
//and assigns them click listeners that switch the current sound
function storePlaylist() {
	playlistItems = document.querySelectorAll(".playlist-item");
	for (let i = 0; i <= playlistItems.length - 1; i++) {
		playlistItems[i].addEventListener("click", () => soundSwitch(i));
	}
}

function effectsCombiner() {
	var pre = searchResults.output.searchResultsData.prePromoResults;
	var post = searchResults.output.searchResultsData.postPromoResults;
	searchResults = [...pre, ...post];
	for (i = 0; i < searchResults.length; i++) {
		allData[i] = {
			title: searchResults[i].name,
			link: searchResults[i].itemUrl.m4a,
			artistname: searchResults[i].username
		};
	}
}

async function getEffects(event) {
	//stops the click events default behavior
	if (event) {
		event.preventDefault();
	}
	//takes the input and turns it into a url that
	//points to the search results
	var url = `https://www.pond5.com/index.php?page=ajax_search&bmtext=sound-effects&pagenum=${pageNumber}&q=${input}&perPage=48`;
	//fetch the page that has the sounds we're looking for
	var response = await fetch(url).then(async (response) => {
		//parse the recieved html page into a format
		//we can use the query selector on
		var text = await response.text();
		//const parser = new DOMParser();
		//return parser.parseFromString(text, "text/html");
		//console.log(JSON.parse(text));
		return JSON.parse(text);
	});

	//store the class name of the search result element
	//this is where we pull all the necessary info from
	searchResults = response;

	console.log("Page " + pageNumber + " Loaded!");
	//reset current sound to 0
	index = 0;
	//clear out data
	allData = [];
	//empty out current playlist
	playlist.innerHTML = "";
	//combine the effects data into a single array
	effectsCombiner();
	//fill the playlist with the currently loaded sounds
	fillPlaylist();
	//add the first sound to the player
	displayEffect();
	//scroll back to the top of the playlist
	var active = document.querySelector(".active");
	gsap.to(".playlist-body", {
				duration: 0.8,
				scrollTop: active.offsetTop - 250
			});
}

function nextSound() {
	if (allData.length > 0 && index < allData.length - 1) {
		index = index + 1;
		if (soundMode == "Effects") {
			displayEffect();
		} else if (soundMode == "Samples") {
			displaySample();
		}

		//scrolls the playlist down when the active element is outside of view
		var active = document.querySelector(".active").nextSibling;
		var activeBound = active.getBoundingClientRect();
		var playlistBound = playlist.parentElement.getBoundingClientRect();
		if (
			activeBound.bottom > playlistBound.bottom ||
			activeBound.top < playlistBound.top
		) {
			gsap.to(".playlist-body", {
				duration: 0.8,
				scrollTop: active.offsetTop - 250
			});
		}
		if (index > 0) {
			playlist.children[index - 1].classList.remove("active");
		}
	} else {
		pageNumber = pageNumber + 1;
		index = 0;
		if (soundMode == "Effects") {
			getEffects();
		} else if (soundMode == "Samples") {
			getSamples();
		}
	}
}

function lastSound() {
	if (allData.length > 0 && index > 0) {
		index = index - 1;
		if (soundMode == "Effects") {
			displayEffect();
		} else if (soundMode == "Samples") {
			displaySample();
		}
		//scrolls the playlist up when the active element is outside of view
		var active = document.querySelector(".active");
		var activeBound = active.getBoundingClientRect();
		var playlistBound = playlist.parentElement.getBoundingClientRect();
		if (activeBound.top < playlistBound.top) {
			gsap.to(".playlist-body", {
				duration: 1.5,
				scrollTop: active.offsetTop - active.clientHeight - 440
			});
		}
		playlist.children[index + 1].classList.remove("active");
	}
}

//switches the active element and plays the new active sound
function soundSwitch(number) {
	var active = document.querySelector(".active");
	if (active != null) {
		active.classList.remove("active");
	}
	index = number;
	if (soundMode == "Effects") {
		displayEffect();
	} else if (soundMode == "Samples") {
		displaySample();
	}
}

function displaySample(links, titles, artists) {
	var soundArtist = allData[index].artistname;
	var soundUrl = allData[index].link;
	var soundName = allData[index].title;
	//assign the sound's url to our audio element
	audio.src = soundUrl;
	//assign the sound's url to the download button
	document.querySelector(".download").href = soundUrl;
	document.querySelector(".sound-title").innerHTML = soundName;
	document.querySelector(".sound-artist").innerHTML = soundArtist;
	//add the active class to the current sound
	playlist.children[index].classList.add("active");
	//wait for the audio variable to retrieve the file
	setTimeout(() => {
		document.querySelector(".duration").innerHTML = formatTime(audio.duration);
		togglePlay();
	}, [500]);
}

function displayEffect() {
	//pulls the data for the current sound
	//from the search results webpage
	//console.log(allData);
	var soundArtist = allData[index].artistname;
	var soundName = allData[index].title;
	//assign the sound's url to our audio element
	audio.src = allData[index].link;
	//assign the sound's url to the download button
	document.querySelector(".download").href = allData[index].link;
	//Format the sound name for the player window so
	//that we only pull the first four words if it contains more than 5
	soundName = soundName.split(" ");
	if (soundName.length > 5) {
		//pull out the first 4 words and join them
		soundName = soundName.slice(0, 4).join(" ") + "...";
	} else {
		//rejoin the orignal name if it's less than five words
		soundName = soundName.join(" ");
	}
	document.querySelector(".sound-title").innerHTML = soundName;
	document.querySelector(".sound-artist").innerHTML = soundArtist;
	//add the active class to the current sound
	playlist.children[index].classList.add("active");
	//wait for the audio variable to retrieve the file
	setTimeout(() => {
		document.querySelector(".duration").innerHTML = formatTime(audio.duration);
		togglePlay();
	}, [1000]);
}

function formatTime(seconds) {
	minutes = Math.floor(seconds / 60);
	minutes = minutes >= 10 ? minutes : "0" + minutes;
	seconds = Math.floor(seconds % 60);
	seconds = seconds >= 10 ? seconds : "0" + seconds;
	return minutes + ":" + seconds;
}

function animatePlayHead(value) {
	var playHead = document.querySelector(".circle");
	movePlayHead = value;
	if (movePlayHead) {
		animate = setInterval(() => {
			var pathWidth = playHead.parentElement.parentElement.clientWidth;
			var timePercentage = (audio.currentTime / audio.duration) * 100;
			document.querySelector(".current-time").innerHTML = formatTime(
				audio.currentTime
			);
			if (!Draggable.get(".circle").isPressed) {
				gsap.set(".circle", {
					left: playHead.clientLeft + pathWidth * (timePercentage / 100) - 15
				});
				document.querySelector(".played").style.width = timePercentage - 0.5 + "%";
			}
			if (audio.currentTime >= audio.duration && !audio.paused && !audio.loop) {
				togglePlay();
			}
		}, [0.2]);
	} else {
		clearInterval(animate);
	}
}


//Tags that make this show up on searches
//Sound Player
//Sounds
//Music Player
//Music
//Player
//Sample Browser
//Browser
//GreenSock
//Sound Effects
//Neumorphic
//Sounds
//Playlist
//Download