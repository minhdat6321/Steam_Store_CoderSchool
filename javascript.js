const API_KEY = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com";
let gameWrapperDescription = "";
const ulCategories = document.querySelector(".categoryGroup");
let value = "";
const inputSearch = document.querySelector("#inputSearchBox");
const searchButton = document.querySelector("#searchButton");

// CREATE li categories
const getCategories = async () => {
  try {
    const url = `${API_KEY}/genres`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (error) {
    console.log("errorCategories", error);
  }
};
const renderCategories = async () => {
  try {
    const data = await getCategories();
    data.data.forEach((cate) => {
      const x = document.createElement("li");
      x.innerHTML = `${cate.name}`;
      ulCategories.appendChild(x);
    });
  } catch (error) {
    console.log("errorCategories", error);
  }
};
renderCategories();

// CREATE ALL Games (img + name + price) Homepage
const getGames = async (value) => {
  try {
    const url = `${API_KEY}/games?q=${inputSearch.value}&limit=390`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      let newData = [];
      if (value !== "" && value !== "searchTerm") {
        data.data.forEach((game) => {
          for (let i = 0; i < game.genres.length; i++) {
            if (value === game.genres[i]) {
              newData.push(game);
            }
          }
        });
        return newData;
      }
      return data;
    }
  } catch (error) {
    console.log("err" + error);
  }
};
// Create function to render Game
const singleGame = (gameWrapper) => {
  const newDivGameWrapper = document.createElement("div");
  newDivGameWrapper.className = "game_wrapper";
  newDivGameWrapper.innerHTML = `      <div>
                  <div class="cover">
                    <img
                      src="${gameWrapper.header_image}"
                      data-id="${gameWrapper.appid}"
                    />
                    <div class="game_info">
                      <h1>${gameWrapper.name}</h1>
                      <p>${gameWrapper.price}$</p>
                    </div>
                  </div>
                </div>`;

  // BEST PART
  const formattedDate = new Date(gameWrapper.release_date).toLocaleDateString(
    "en-US",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
  newDivGameWrapper.addEventListener("click", () => {
    window.history.back();
    window.history.forward();

    const newSection = document.getElementById("section"); // Store the entire game object for details
    // Get API SIngle Game
    const getSingleGame = async () => {
      try {
        const url = `${API_KEY}/single-game/${gameWrapper.appid}`;
        const response = await fetch(url);
        if (response) {
          const dulieu = await response.json();
          return dulieu;
        }
      } catch (error) {
        console.log("err" + error);
      }
    };
    // getSingleGame().then((gameDescription) => {
    //   gameWrapperDescription = gameDescription.description;
    // });
    getSingleGame().then((result) => {
      gameWrapperDescription = result.data.description;

      newSection.innerHTML = `<div class="container">
            <div class="showing_game show_detail">
              <div class="title_contain">
                <div class="title">
                  <a href="index.html">Back</a>
                  ${gameWrapper.name}
                </div>
                <div class="price">${gameWrapper.price}</div>
              </div>
              <div class="img_detail">
                <img
                  src="${gameWrapper.header_image}"
                  alt="${gameWrapper.name}"
                />
                <div class="game_details">
                  <div class="game_description">
                  ${gameWrapperDescription}
      
                  </div>
                  <div class="game_informations">
                    <p>POSITIVE RATINGS: ${gameWrapper.positive_ratings}</p>
                    <p>NEGATIVE RATINGS: ${gameWrapper.negative_ratings}</p>
      
                    <p>RELEASE DATE: ${formattedDate}</p>
                    <p>
                      DEVELOPER:
                      <a
                        href="https://store.steampowered.com/developer/${gameWrapper.developer}"
                        >${gameWrapper.developer}</a
                      >
                    </p>
               
                  </div>
                </div>
              </div>
              <div class="tags_contain">
                Popular user-defined tags for this product:
                <div class="tags">
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Open%20World/?snr=1_5_9__409"
                      >Open World</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Story%20Rich/?snr=1_5_9__409"
                      >Story Rich</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Western/?snr=1_5_9__409"
                      >FPS</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Adventure/?snr=1_5_9__409"
                      >Adventure</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Multiplayer/?snr=1_5_9__409"
                      >Multiplayer</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Action/?snr=1_5_9__409"
                      >Action</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Realistic/?snr=1_5_9__409"
                      >PvP</a
                    >
                  </div>
                  <div class="tag">
                    <a
                      href="https://store.steampowered.com/tags/en/Singleplayer/?snr=1_5_9__409"
                      >Singleplayer</a
                    >
                  </div>
                </div>
              </div>
            </div>
            </div>
          `;
    });
  });
  return newDivGameWrapper;
};

// RENDER game default Homepage
const renderGetGames = async () => {
  try {
    const data = await getGames(value);
    const gamesList = document.querySelector(".container");
    data.data.forEach((gameWrapper) => {
      const gameCard = singleGame(gameWrapper);
      gamesList.appendChild(gameCard);
    });
  } catch (error) {
    console.log("errRENDER" + error);
  }
};
renderGetGames();

// Make click and create a new HTML including the details

//  Category clicked
ulCategories.addEventListener("click", async (e) => {
  inputSearch.value = "";
  value = e.target.innerText;
  const filteredGames = await getGames(value); // Fetch games based on category
  const gamesList = document.querySelector(".container");
  gamesList.textContent = ``;
  filteredGames.forEach((gameWrapper) => {
    const gameCard = singleGame(gameWrapper);
    gamesList.appendChild(gameCard);
  });
});

// function search
inputSearch.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    value = "searchTerm";
    const filteredGames = await getGames(value); // Fetch games based on search term
    const gamesList = document.querySelector(".container");
    gamesList.textContent = ""; // Clear previous content
    filteredGames.data.forEach((gameWrapper) => {
      const gameCard = singleGame(gameWrapper);
      gamesList.appendChild(gameCard);
    });
  }
});

// button search
searchButton.addEventListener("click", async () => {
  value = "searchTerm";
  const filteredGames = await getGames(value); // Fetch games based on search term
  const gamesList = document.querySelector(".container");
  gamesList.textContent = ""; // Clear previous content
  filteredGames.data.forEach((gameWrapper) => {
    const gameCard = singleGame(gameWrapper);
    gamesList.appendChild(gameCard);
  });
});
