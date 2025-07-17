const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    playerSides: {
        player1: "player-cards",
        player1BOX:document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX:document.querySelector("#computer-cards"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    actions: {
        button: document.getElementById("next-duel"),
    },
};

const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Blue-Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        LoseOf: [2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        LoseOf: [0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        LoseOf: [1]
    }
]

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1) {
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    return cardImage;
}

async function setCardsField(IdCard) {
    await removeAllCardsimages();

    let computerCardId = await getRandomCardId();

    await ShowHiddenCardFieldImages(true);

    await hiddenCardDetails();

    await drawCardsInField(IdCard, computerCardId);

    let duelResults = await checkDuelResult(IdCard, computerCardId);

    await updateScore();
    await drawnButton(duelResults);
}

async function drawCardsInField(cardId, computerCardId) {
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function ShowHiddenCardFieldImages(value) {
    if (value === true) {
        state.fieldCards.player.style.display = "block";
        state.fieldCards.computer.style.display = "block";
    }
    if (value === false) {
        state.fieldCards.player.style.display = "none";
        state.fieldCards.computer.style.display = "none";
    }
}

async function hiddenCardDetails () {
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
}

async function drawnButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function checkDuelResult(playerCardId, computerCardId) {
    let duelResults = "Empate!"
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Ganhou!";
        await playAudio("win");
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Perdeu!";
        await playAudio("lose");
        state.score.computerScore++;
    }
    return duelResults;
}

async function removeAllCardsimages() {
    let {computerBOX, player1BOX} = state.playerSides;
    let imgElements = computerBOX.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    });

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => {
        img.remove();
    });
}

async function drawSelectCard(Index) {
    state.cardSprites.avatar.src = cardData[Index].img;
    state.cardSprites.name.innerText = cardData[Index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[Index].type;
}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio (status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        await audio.play();
    } catch {}
}

function init() {
    
    ShowHiddenCardFieldImages(false);

    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5;
    bgm.play();
}

init();