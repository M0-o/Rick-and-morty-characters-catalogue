document.addEventListener("DOMContentLoaded", async () => {
  let container = document.querySelector(".container");
  let pages = document.querySelector("#pages");
  let render = 0;
  let currentPage = 1;
  let characters = [];
  let current;
  let searchbar = document.querySelector("#char");
  let searchIcon = document.querySelector(".icon");
  let inputContainer = document.querySelector(".input-container");

  do {
    current = await fetch(
      current?.info?.next || "https://rickandmortyapi.com/api/character"
    );
    current = await current.json();
    characters.push(...current.results);
  } while (current.info.next);

  const imgCreator = (imageUrl) => {
    let img = document.createElement("img");
    img.src = imageUrl;
    img.loading = "lazy";
    return img;
  };

  const cardCreator = (dataObj) => {
    let card = document.createElement("article");
    card.id = dataObj.id;
    let dataSection, nameAndState, lastKnownLocation;
    let nameSpan, statusSpan, lastSeenSpan;

    dataSection = document.createElement("div");
    nameAndState = document.createElement("div");
    lastKnownLocation = document.createElement("div");
    FirstSeenEpisode = document.createElement("div");

    nameSpan = document.createElement("span");
    statusSpan = document.createElement("span");
    lastSeenSpan = document.createElement("span");

    nameSpan.innerText = dataObj.name;
    nameSpan.classList = "name";
    statusSpan.innerText = dataObj.status;
    statusSpan.classList += dataObj.status;
    lastSeenSpan.innerText = dataObj.location.name;
    let img = imgCreator(dataObj.image);

    for (element of [nameSpan, statusSpan])
      nameAndState.insertAdjacentElement("beforeend", element);

    lastKnownLocation.insertAdjacentElement("beforeend", lastSeenSpan);

    for (element of [nameAndState, lastKnownLocation])
      dataSection.insertAdjacentElement("beforeend", element);

    for (element of [img, dataSection])
      card.insertAdjacentElement("beforeend", element);

    card.addEventListener("click", (event) => {
      window.location.href = `http://localhost:5000/character?id=${
        event.target.parentElement.id ||
        event.target.parentElement.parentElement.id ||
        event.target.parentElement.parentElement.parentElement.id
      }`;
    });
    return card;
  };

  const getData = async (page = 1, clear = false) => {
    if (clear) {
      container.innerHTML = "";
    } else {
      container.lastChild?.remove();
    }

    let charactersPromise = await fetch(
      `https://rickandmortyapi.com/api/character/?page=${page}`
    );
    let charactersData = await charactersPromise.json();

    let charactersCards = charactersData.results.map((el) => cardCreator(el));

    if (render == 0)
      for (i = 1; i <= charactersData.info.pages; i++) {
        let button = document.createElement("button");
        button.innerText = i;
        button.id = i;
        button.addEventListener("click", (ev) => {
          getData(ev.target.id, true);
          currentPage = ev.target.id;
        });

        pages.insertAdjacentElement("beforeend", button);
        render++;
      }
    charactersCards.map((el) => {
      container.insertAdjacentElement("beforeend", el);
    });
    let load = document.createElement("article");
    load.innerText = "Load more ";
    load.classList = "load";

    load.addEventListener("click", () => {
      getData(++currentPage, false);
    });

    container.insertAdjacentElement("beforeend", load);
  };

  getData();

  const lookup = (character) => {
    let reg = new RegExp(character, "i");

    let matches = characters.filter((el) => reg.test(el.name));

    return matches;
  };

  searchIcon.addEventListener("click", () => {
    inputContainer.classList.toggle("visible");
  });

  searchbar.addEventListener("change", (ev) => {
    container.innerHTML = "";

    lookup(ev.target.value).map((el) => {
      container.insertAdjacentElement("beforeend", cardCreator(el));
    });

    inputContainer.classList.toggle("visible");
  });

  inputContainer.addEventListener("click", (ev) => {
    if (ev.target != searchbar) inputContainer.classList.toggle("visible");
  });
});
