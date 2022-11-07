const profileInfo = document.querySelector(".overview");
const username = "jjackson112";
const repoList = document.querySelector(".repo-list");
const appearRepo = document.querySelector(".repos");
const appearRepoData = document.querySelector(".repo-data");

const backRepoButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getData = async function () {
    const userInfo = await fetch(`https://api.github.com/users/${username}`);
    const data = await userInfo.json();
    displayData(data);
};

getData();

const displayData = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div>
    `;

    profileInfo.append(div);
    getRepos(username);
};

const getRepos = async function (username) {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    showRepos(repoData);
};

const showRepos = function (repos) {
    filterInput.classList.remove("hide");
    for (const repo of repos) {
        const repoItem = document.createElement("li");
        repoItem.classList.add("repo");
        repoItem.innerHTML = `<h3>${repo.name}</h3>`;
        repoList.append(repoItem);
    }
};

repoList.addEventListener("click", function(e) {
    if (e.target.matches("h3")) {
        const repoName = e.target.innerText;
        specificRepoInfo(repoName);
    }
});

const specificRepoInfo = async function (repoName) {
    const fetchInfo = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();

    // Grab languages
    const fetchLanguages = await fetch(repoInfo.languages_url);
    const languageData = await fetchLanguages.json();

    // Make a list of languages
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }

    displaySpecificRepoInfo(repoInfo, languages);
};

const displaySpecificRepoInfo = function (repoInfo, languages) {
    backRepoButton.classList.remove("hide");
    appearRepoData.innerHTML = "";
    appearRepoData.classList.remove("hide");
    appearRepo.classList.add("hide");

    const div = document.createElement("div");

    div.innerHTML = `
    <h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    appearRepoData.append(div);
};

backRepoButton.addEventListener("click", function () {
    appearRepo.classList.remove("hide");
    appearRepoData.classList.add("hide");
    backRepoButton.classList.add("hide");
});

// Dynamic Search

filterInput.addEventListener("input", function(e) {
    const search = e.target.value;
    const repos = document.querySelectorAll(".repo");
    const searchInput = search.toLowerCase();

    for (const repo of repos) {
        const repoText = repo.innerText.toLowerCase();
        if (repoText.includes(searchInput)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});