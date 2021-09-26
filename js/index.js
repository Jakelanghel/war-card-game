const newDeckBtn = document.getElementById("new-deck-btn")
const drawBtn = document.getElementById("draw-cards")
const playerCard = document.getElementById("p-card")
const computerCard = document.getElementById("c-card")
const winnerTitle = document.querySelector(".winner-title")
const title = document.querySelector(".title")
const cardsRemaining = document.getElementById("cards-left")


let deckId = null
let cardsArr = null
let pScore = 0
let cScore = 0


newDeckBtn.addEventListener("click", handleClick)
drawBtn.addEventListener("click", getCards)



function handleClick() {
    fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then(res => res.json())
        .then(data => {
            deckId = data.deck_id
            updateDisplay(data)
        })
}

function getCards() {
    fetch(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            const remaining = data.remaining
            cardsArr = data.cards
            renderCards(data, remaining)
            const scores = getValues(cardsArr[0], cardsArr[1])
            const winnerStr = getWinner(scores)
            updateScoreBoards(winnerStr)
            dubWinner(winnerStr)
            
        })
        
        
}

function updateDisplay(data) {
    newDeckBtn.style.display = "none"
    drawBtn.style.display = "block"
    cardsRemaining.textContent = data.remaining
   

    

}

function renderCards(data, remaining) {
    const cardContainers = document.querySelectorAll(".card")

    setImages(data)
    cardContainers.forEach(card => {
        card.style.display = "block"
    })
    cardsRemaining.textContent = remaining

}

function setImages(data) {
    const cardsarr = data.cards
    const cardImages = document.querySelectorAll(".card-img")
    for(let i = 0; i < cardImages.length; i++) {
        cardImages[i].src = `${cardsarr[i].image}`
    }
}

function creatImgElement(cardsArr) {
    const cardElements = []
    cardsArr.forEach(card => {
        const img = document.createElement("img")
        img.src = card.image
        img.classList.add("card-img")
        cardElements.push(img)
    })
    return cardElements
    
}

function getValues(card1, card2) {
    // Create obj to store card values
    const values = {"player": card1.value, "computer": card2.value}
    // Creat obj to store face card values
    const faceCards = {"JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 15}
    // Check each card for face card
    for(const key in values) {
        if(faceCards.hasOwnProperty(values[key])) {
            // If face card get face card value from face cards obj
            values[key] = faceCards[values[key]]
        }else {
            // If not face card convert value to int
            values[key] = parseInt(values[key])
        }
    }
    return values
}

function getWinner(scores) {
    if(scores["player"] > scores["computer"]) {
        return "YOU WON!!!"
    }else if(scores["computer"] > scores["player"]) {
        return "YOU LOST"
    }else {
        return "It's a WAR!!"
    }
}

function dubWinner(winnerStr) {
    drawBtn.style.display = "none"
    winnerTitle.textContent = winnerStr
    winnerTitle.style.display = "block"
    setTimeout(reset, 2000)
}

function reset() {
    drawBtn.style.display = "block"
    winnerTitle.style.display = "none"
    winnerTitle.textContent = ""
}

function updateScoreBoards(winnerStr) {
    if(winnerStr === "YOU WON!!!") {
        pScore ++
        document.getElementById("p-score").textContent = pScore
    }else if (winnerStr === "YOU LOST") {
        cScore ++
        document.getElementById("c-score").textContent = cScore

    }else {
        return
    }
}





