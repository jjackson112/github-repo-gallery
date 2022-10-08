const profileInfo = document.querySelector(".overview");
const username = "jjackson112";

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
};