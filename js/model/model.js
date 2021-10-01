class Model {

    constructor() {
        this.deckData = null
        this.cardsData = []
        this.faceCards = { "JACK": 11, "QUEEN": 12, "KING": 13, "ACE": 15 }
        this.viewData = { playerScore: 0, computerScore: 0, war: false, msg: "", gameover: false, 
                           playerImg: null, computerImg: null, cardsRemaining: null }
        this.cardCounter = 0

    }

    async getNewDeck() {
        try {
            const response = await fetch("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
            const data = await response.json()
            this.deckData = data
        }
        catch(e) {
            console.log(e)
        }
    }

    async drawCards() {
        try {
            const response = await fetch(`https://www.deckofcardsapi.com/api/deck/${this.deckData.deck_id}/draw/?count=2`)
            const data = await response.json()
            const cards = data.cards
            if(data.remaining === 0) {
                this.viewData.gameover = true
                this.viewData.cardsRemaining = data.remaining
                return this.viewData
            }else {
                const cardValues = [cards[0].value, cards[1].value]
                this.cardsData = cardValues
                this.convertValues()
                this.viewData.computerImg = data.cards[0].image
                this.viewData.playerImg = data.cards[1].image
                this.viewData.cardsRemaining = data.remaining
                return this.viewData
            }
           

        }
        catch(e) {
            console.log("ERROR")
            return undefined
        }
    }

    convertValues() {
        for(let i = 0; i< this.cardsData.length; i++) {
            if(this.faceCards.hasOwnProperty(this.cardsData[i])) {
                this.cardsData[i] = this.faceCards[this.cardsData[i]]
            }else {
                this.cardsData[i] = parseInt(this.cardsData[i])
            }
        }
        this.getWinner()
    }

    getWinner() {
        if(!this.viewData.war) {
            this._checkCards()
        }else {
            this._checkWarCards()
        }
    }

    _checkCards() {
        if(this.cardsData[0] > this.cardsData[1]) {
            this.viewData.computerScore += 2 
            this.viewData.msg = "You lost this round.."
        }else if(this.cardsData[0] < this.cardsData[1]) {
            this.viewData.playerScore += 2
            this.viewData.msg = "You WON this round!!"
        }else {
            this.viewData.msg = "IT'S A WAR ! ! ! "
            this.viewData.war = true
            this.cardCounter += 2
        }
    }

    _checkWarCards() {
        if(this.cardsData[0] > this.cardsData[1]) {
            this.cardCounter += 2
            this.viewData.computerScore += this.cardCounter
            this.cardCounter = 0
            this.viewData.msg = "You lost this round.."
        }else if(this.cardsData[0] < this.cardsData[1]) {
            this.cardCounter += 2
            this.viewData.playerScore += this.cardCounter
            this.cardCounter = 0
            this.viewData.msg = "You WON this round!!"
        }else {
            this.viewData.msg = "IT'S A WAR ! ! ! "
            this.viewData.war = true
            this.cardCounter += 2
        }
    }

    endWar() {
        if(this.viewData.msg !== "IT'S A WAR ! ! ! ") {
            this.viewData.war = false
            this.cardCounter = 0
            return false
        }else {
            return true
        }
    }
}





