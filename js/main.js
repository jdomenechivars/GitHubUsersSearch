eventListeners();

function eventListeners() {

	var searchButton = document.getElementById("searchButton");

	searchButton.addEventListener("click", obtainUsername);

	var searchInput = document.getElementById("inputUserName");

	searchInput.addEventListener('keyup', function (e) {
		let key = e.which || e.keyCode;
		if (key === 13) {
			obtainUsername();
		}
	});

}

function obtainUsername() {

	var username = document.getElementById("inputUserName").value;

	if (username != "") {

		searchUser(username);

	} else {

		alert("You need type a Username");
	};

	// For empty the imput after search:
	document.getElementById("inputUserName").value = "";

}

function searchUser(username) {

	var url = "https://api.github.com/users/";
	var newUrl = url + username;

	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", newUrl, true);

	xhttp.onreadystatechange = function () {

		if (xhttp.readyState == 4 && xhttp.status == 200) {

			var data = JSON.parse(xhttp.responseText);

			if (username.search("/repos") == -1) {

				createUserInfo(data);

			} else {

				createUserRepos(data);

			}

		} else if (xhttp.readyState == 4 && xhttp.status == 404) {

			notFound();

		}
	};

	xhttp.send();
}

function notFound() {

	var error = document.getElementById("error");
	error.removeAttribute("hidden");

	var results = document.getElementById("results");
	results.innerHTML = "";

}

function createUserInfo(data) {

	//If some error username is searched before, that will remove the error box if the new search is well done:
	var error = document.getElementById("error");
	error.setAttribute("hidden", "hidden");

	//Show and empty the results Div:
	var results = document.getElementById("results");
	results.innerHTML = "";
	results.removeAttribute("hidden");

	var username = data.login;
	var userUrl = data.html_url;
	var name = data.name;
	var bio = data.bio;
	var imageUrl = data.avatar_url;

	var userCard = document.createElement("div");
	userCard.setAttribute("class", "userCard");

	// Set the image:
	var imageDiv = document.createElement("div");
	imageDiv.setAttribute("class", "userPic");

	var image = document.createElement("img");
	image.setAttribute("class", "avatar");
	image.setAttribute("alt", "User Picture");
	image.setAttribute("title", username);
	image.setAttribute("src", imageUrl);

	imageDiv.appendChild(image);
	userCard.appendChild(imageDiv);

	// Set the user info:
	var userInfo = document.createElement("div");
	userInfo.setAttribute("class", "userInfo");

	var usernameA = document.createElement("a");
	usernameA.setAttribute("href", userUrl);
	usernameA.setAttribute("target", "_blank");
	usernameA.setAttribute("class", "usernameA");
	usernameA.innerHTML = "@" + username;

	var nameP = document.createElement("h1");
	nameP.setAttribute("class", "nameP");
	nameP.innerHTML = name;

	var bioP = document.createElement("p");
	bioP.setAttribute("class", "bioP");
	bioP.innerHTML = bio;

	userInfo.appendChild(usernameA);
	userInfo.appendChild(nameP);
	userInfo.appendChild(bioP);

	userCard.appendChild(userInfo);
	results.appendChild(userCard);

	var repos = username + "/repos";
	searchUser(repos);

}

function createUserRepos(data) {

	var results = document.getElementById("results");

	var repositories = document.createElement("div");
	repositories.setAttribute("class", "repositories");

	// Create the Repositories Title:
	var reposTitle = document.createElement("div");
	reposTitle.setAttribute("class", "titleDiv");

	var title = document.createElement("p");
	title.setAttribute("title", "title");

	if (data.length == 0) {

		title.innerHTML = "This user doesn’t have any public repositories yet.";

	} else {

		title.innerHTML = "Repositories:";

	}

	reposTitle.appendChild(title);
	repositories.appendChild(reposTitle);

	// Create each Repo info:
	var repoIndex = document.createElement("div");
	repoIndex.setAttribute("class", "repoIndex");

	for (var i = 0; i < data.length; i++) {

		var eachRepo = document.createElement("div");
		eachRepo.setAttribute("class", "eachRepo");

		// Set the repositorie title
		var repoName = document.createElement("div");
		repoName.setAttribute("class", "repoName");

		var repoUrl = document.createElement("a");
		repoUrl.setAttribute("class", "repoUrl");
		repoUrl.setAttribute("href", data[i].html_url);
		repoUrl.setAttribute("target", "_blank");
		repoUrl.innerHTML = data[i].name;
		repoName.appendChild(repoUrl);

		// icons Div
		var iconsDiv = document.createElement("div");
		iconsDiv.setAttribute("class", "iconsDiv");

		// Set the respositorie stargazer number
		var repoStar = document.createElement("div");
		repoStar.setAttribute("class", "star");

		var starImage = document.createElement("img");
		starImage.setAttribute("class", "repoIcon");
		starImage.setAttribute("title", "Star");
		starImage.setAttribute("src", "styles/icons/star.png");
		repoStar.appendChild(starImage);

		var starP = document.createElement("p");
		starP.setAttribute("class", "repoNumber");
		starP.innerHTML = data[i].stargazers_count;
		repoStar.appendChild(starP);

		iconsDiv.appendChild(repoStar);

		//Set the repositorie fork number
		var repoFork = document.createElement("div");
		repoFork.setAttribute("class", "fork");

		var forkImage = document.createElement("img");
		forkImage.setAttribute("class", "repoIcon");
		forkImage.setAttribute("title", "Fork");
		forkImage.setAttribute("src", "styles/icons/fork.png");
		repoFork.appendChild(forkImage);

		var forkP = document.createElement("p");
		forkP.setAttribute("class", "repoNumber");
		forkP.innerHTML = data[i].forks_count;
		repoFork.appendChild(forkP);

		iconsDiv.appendChild(repoFork);

		// Append info to each repo:
		eachRepo.appendChild(repoName);
		eachRepo.appendChild(iconsDiv);

		//Append the created repo to the index repositories:
		repoIndex.appendChild(eachRepo);

	}

	repositories.appendChild(repoIndex);
	results.appendChild(repositories);
}
