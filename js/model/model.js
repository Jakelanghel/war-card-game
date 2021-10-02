class Model {

    constructor() {
        this.deckData = null
        this.faceCards = { "JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 15 }
        this.cardCounter = 0
        this.playerScore = 0
        this.computerScore = 0
        this.gameMsg = null
        this.war = false
        this.cardsRemaining = 0

    }


    async getNewDeck() {
        try {
            const response = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            const data = await response.json()
            this.deckData = data
            return await data
        }
        catch(e) {
            return false
        }
    }

    async drawCards() {
        try {
            const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckData.deck_id}/draw/?count=2`)
            const data = await response.json()
            this._getCardValues(data)
            const viewData = this._setViewData(data)
            return viewData 

        }
        catch(e) {
            console.log("ERROR123")
            return false
        }
    }

    _setViewData(data) {
        let viewData = {}

        viewData.cardsRemaining = data.remaining 
        viewData.computerImg = data.cards[0].image
        viewData.playerImg = data.cards[1].image
        viewData.cardsRemaining = data.remaining
        viewData.playerScore = this.playerScore
        viewData.computerScore = this.computerScore
        viewData.msg = this.gameMsg
        return viewData
    }

    _getCardValues(data) {
        const cardsData = []
        this.cardsRemaining = data.remaining
        cardsData.push(data.cards[0].value)
        cardsData.push(data.cards[1].value)
        const cardValues = []
        cardsData.forEach(card => {
            if(this.faceCards.hasOwnProperty(card)) {
                cardValues.push(this.faceCards[card])
            }else {
                cardValues.push(parseInt(card))
            }
        })
        if(!this.war) {
            this._checkCards(cardValues)
        }else {
            this._checkWarCards(cardValues)
        }
    }

    _checkCards(cardValues) {
        if(cardValues[0] > cardValues[1]) {
            this.computerScore += 2 
            this.gameMsg = "You lost this round.."
        }else if(cardValues[0] < cardValues[1]) {
            this.playerScore += 2
            this.gameMsg = "You WON this round!!"
        }else {
            this.cardCounter += 2
            this.gameMsg = "IT'S A WAR ! ! ! "
            this.war = true
        }
    }

    _checkWarCards(cardValues) {
        if(cardValues[0] > cardValues[1]) {
            this.cardCounter += 2
            this.computerScore += this.cardCounter
            this.cardCounter = 0
            this.war = false
            this.msg = "You lost this round.."
        }else if(cardValues[0] < cardValues[1]) {
            this.cardCounter += 2
            this.playerScore += this.cardCounter
            this.cardCounter = 0
            this.war = false
            this.msg = "You WON this round!!"
        }else {
            this.msg = "IT'S A WAR ! ! ! "
            this.war = true
            this.cardCounter += 2
        }
    }

  
}