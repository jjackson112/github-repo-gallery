const profileInfo = document.querySelector(".overview");
const username = "jjackson112";
const repoList = document.querySelector(".repo-list");
const appearRepo = document.querySelector(".repos");
const appearRepoData = document.querySelector("repo-data");

const backRepoButton = document.querySelector(".view-repos");
const filterInput = document.querySelector(".filter-repos");

const getData = async function () {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    displayData(data);
};

getData();

const displayData = function (data) {
    const div = document.createElement("div");
    div.classList.add("user-info");
    div.innerHTML = `
    <figure>
      <img alt="user avatar" src=${data.username} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.repos}</p>
    </div>`

    profileInfo.append(div);
    getRepos();
};

const getRepos = async function () {
    const fetchRepos = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
    const repoData = await fetchRepos.json();
    showRepo(repoData);
};

const showRepo = function (repos) {

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
    const fetchInfo = await fetch(`https://api.github.com/users/repo/${username}/${repoName}`);
    const repoInfo = await fetchInfo.json();
    console.log(repoInfo);

    // Grab languages
    const fetchLanguages = await fetch(repoInfo.language_url);
    const languageData = await fetchLanguages.json();

    // Make a list of languages
    const languages = [];
    for (const language in languageData) {
        languages.push(language);
    }

    displaySpecificRepoInfo(repoInfo, languages);
};

const displaySpecificRepoInfo = function (repoInfo, languages) {
    repoData.innerHTML = "";
    repoData.classList.remove("hide");
    allReposContainer.classList.add("hide");

    const div = document.createElement("div");

    div.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.html_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>
    `;
    repoData.append(div);
};

backRepoButton.addEventListener("click", function () {
    allReposContainer.classList.remove("hide");
    repoData.classList.add("hide");
    backRepoButton.classList.add("hide");
});

// Search

filterInput.addEventListener("click", function(e) {
    const search = e.target.value;
    const repos = document.querySelectorAll("repo");
    const searchInput = search.toLowercase();

    for (const repo of repos) {
        const repoText = repo.innerText.toLowercase();
        if (repoText.includes(searchInput)) {
            repo.classList.remove("hide");
        } else {
            repo.classList.add("hide");
        }
    }
});