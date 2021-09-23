const newDeckBtn = document.getElementById("new-deck-btn")
const drawBtn = document.getElementById("draw-cards")
const playerCard = document.getElementById("p-card")
const computerCard = document.getElementById("c-card")
const winnerTitle = document.querySelector(".winner-title")
const title = document.querySelector(".title")

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
            clearBoard()
            const remaining = data.remaining
            cardsArr = data.cards
            renderCards(cardsArr, remaining)
            const scores = getValues(cardsArr[0], cardsArr[1])
            const winnerStr = getWinner(scores)
            updateScoreBoards(winnerStr)
            dubWinner(winnerStr)
            
        })
        
        
}

function updateDisplay(data) {
    newDeckBtn.style.display = "none"
    drawBtn.style.display = "block"
    title.textContent = "Cards remaining :"
    const span = document.createElement("span")
    span.id = "cards-left"
    span.textContent = `${data.remaining}`
    title.appendChild(span)

}

function renderCards(cardsArr, remaining) {
    const span = document.getElementById("cards-left")
    cardElements = creatImgElement(cardsArr)
    playerCard.appendChild(cardElements[0])
    computerCard.appendChild(cardElements[1])
    span.textContent = remaining
    
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

function clearBoard() {
    const oldCards = document.querySelectorAll(".card-img")
    if(oldCards.length > 0) {
        oldCards[0].remove()
        oldCards[1].remove()
    }
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





