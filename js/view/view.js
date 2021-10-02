class View {
    constructor() {
           this.deckBtn = document.getElementById("new-deck")
           this.drawBtn = document.getElementById("draw-cards")
           this.remainingSpan = document.getElementById("cards-left")
           this.remainingContainer = document.querySelector(".remaining")
           this.cardImgs = document.querySelectorAll(".card-img")
           this.cardContainers = document.querySelectorAll(".card")
           this.winnerTitle = document.querySelector(".winner-title")
           this.playerScore = document.getElementById("p-score")
           this.computerScore = document.getElementById("c-score")
           this.restartBtn = document.getElementById("restart")
           this.leftPos = 0

           this.war = false
           this.firstWarCard = false
           this.warMsg = "IT'S A WAR ! ! ! "
    }

    // =======================
    //  BINDING METHODS ======
    // =======================

    bindStartGame(handler) {
        this.deckBtn.addEventListener("click", async () => {
            const data = await handler()
            if(data) {
                this._startGame(data)
            }else {
                this._renderErrorMsg()
            }
        })
    }

    bindDrawCards(handler1) {
        this.drawBtn.addEventListener("click", async () => {
            const data = await handler1()
            this._hideDawBtn()
            this._showMsg(data)
            this._updateCardCount(data)
            // Check data.msg to see if a war has started
            this._checkWarStarted(data)
            if(!this.war) {
                // If war is false render cards
                this._renderCards(data)
                this._updateScore(data)
                this._checkGameOver(data)
            }else {
                this._handleWar(data)
                this._updateScore(data)
                this._reset()
            }
            
        })
    }

    // =======================
    //  GAME METHODS =========
    // =======================

    _startGame(data) {
        this.deckBtn.style.display = "none"
        this.drawBtn.style.display ="block"
        this.remainingSpan.textContent = data.remaining
        this.remainingContainer.style.opacity = 1
    }

    _checkGameOver(data) {
        let gameOver = null
        if(data.cardsRemaining > 0) {
            gameOver = false
        }else {
            gameOver = true
        }

        if(gameOver) {
            this._renderGameOver(data)
        }else {
            this._reset()
        }
    }

    _renderGameOver(data) {
        this.cardContainers.forEach(card => {
            card.style.display = "none"
        })

        if(data.playerScore > data.computerScore) {
            this.winnerTitle.textContent = "YOU WON!!"
            this.winnerTitle.classList.add("game-over")
            this.restartBtn.style.display = "block"
        }else {
            this.winnerTitle.textContent = "YOU LOST!!"
            this.winnerTitle.classList.add("game-over")
            this.restartBtn.style.display = "block"
        }
    }

    _renderCards(data) {
        this.cardImgs[0].src = data.computerImg
        this.cardImgs[1].src = data.playerImg
        this.cardContainers.forEach(container => {
            container.style.display = "block"
        })
    }


    // =======================
    //  WAR METHODS ==========
    // =======================

    _handleWar(data) {
        if(!this.firstWarCard) {
            this._renderCards(data)
            this.firstWarCard = true
        }else {
            const warCards = this._createWarCards(data)
            this._renderWarCards(warCards, data)
            this._checkWarEnd(data)
        }
    }

    _checkWarStarted(data) {
        if(data.msg === this.warMsg) {
            this.war = true
        }
    }

    _checkWarEnd(data) {
        if(this.msg !== this.warMsg) {
            this.war = false
            this.firstWarCard = false
            this.leftPos = 0
            this._removeWarCards(data)
        }
    }
    // =======================
    //  WAR CARD METHODS =====

    _createWarCards(data) {
        const warCards = []
        this.leftPos = parseInt(this.leftPos)
        this.leftPos -= 20
        this.leftPos = this.leftPos + "px"
        this.cardContainers[0].classList.remove("c-indicator")
        this.cardContainers[1].classList.remove("p-indicator")

        const pDiv = document.createElement("div")
        const pImg = document.createElement("img")
        pDiv.style.display = "block"
        pDiv.classList.add("war-card")
        pDiv.classList.add("p-indicator")
        pDiv.style.left = this.leftPos
        pImg.classList.add("card-img")
        pImg.src = data.playerImg
        pDiv.appendChild(pImg)

        const cDiv = document.createElement("div")
        const cImg = document.createElement("img")
        cDiv.style.display = "block"
        cDiv.classList.add("war-card")
        cDiv.classList.add("c-indicator")
        cDiv.style.left = this.leftPos
        cImg.classList.add("card-img")
        cImg.src = data.computerImg
        cDiv.appendChild(cImg)

        warCards.push(pDiv)
        warCards.push(cDiv)

        return warCards
        
    }

    _renderWarCards(warCards, data) {
        const lastCCard = this.cardContainers[0].lastElementChild
        lastCCard.classList.remove("c-indicator")
        const lastPCard = this.cardContainers[1].lastElementChild
        lastPCard.classList.remove("p-indicator")
        this.cardContainers[1].appendChild(warCards[0])
        this.cardContainers[0].appendChild(warCards[1])
    }

    _removeWarCards(data) {
        setTimeout(() => {
            
            const warrCards = document.querySelectorAll(".war-card")
            warrCards.forEach(card => {
               card.remove()
           })
            this.cardImgs[0].src = data.computerImg
            this.cardImgs[1].src = data.playerImg
            this.cardContainers[0].classList.add("c-indicator")
            this.cardContainers[1].classList.add("p-indicator")
            this._reset()
        }, 4000)
    }


    // =======================
    //  UTILITY METHODS ======
    // ======================= 

    _renderErrorMsg() {
        this.winnerTitle.innerText = "Something went wrong.. \n Please refresh browser"
        this.drawBtn.style.display = "none"
        this.deckBtn.style.display = "none"
        this.winnerTitle.style.display = "block"
    }


    _reset(data) {
        setTimeout(() => {
            this._hideMsg()
            this._showDrawBtn()
        },50)
    }

    _updateScore(data) {
        this.playerScore.textContent = data.playerScore
        this.computerScore.textContent = data.computerScore
        
    }

    _hideDawBtn() {
        this.drawBtn.style.display = "none"
    }

    _showDrawBtn() {
        this.drawBtn.style.display = "block"
    }

    _showMsg(data) {
        this.winnerTitle.textContent = data.msg
        this.winnerTitle.style.display = "block"
    }

    _hideMsg() {
        this.winnerTitle.style.display = "none"
    }

    _updateCardCount(data) {
        this.remainingSpan.textContent =  data.cardsRemaining
    }

    
}