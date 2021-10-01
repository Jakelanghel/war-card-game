class View {
    constructor() {
           this.deckBtn = document.getElementById("new-deck-btn")
           this.drawBtn = document.getElementById("draw-cards")
           this.remainingSpan = document.getElementById("cards-left")
           this.remainingContainer = document.querySelector(".remaining")
           this.cardImgs = document.querySelectorAll(".card-img")
           this.cardContainers = document.querySelectorAll(".card")
           this.winnerTitle = document.querySelector(".winner-title")
           this.playerScore = document.getElementById("p-score")
           this.computerScore = document.getElementById("c-score")
           this.firstWarCard = false
           this.leftPos = 0
           
    }

    bindStartGame(handler) {
        this.deckBtn.addEventListener("click", () => {
            this.deckBtn.style.display = "none"
            this.drawBtn.style.display ="block"
            this.remainingSpan.textContent = 52
            this.remainingContainer.style.opacity = 1
            handler()
        })
    }

    bindDrawCards(handler1, handler2) {
        this.drawBtn.addEventListener("click", async () => {
            const data = await handler1()
            if(data.gameover) {
                if(data.war) {
                    console.log("war but no cards left")
                }else {
                    console.log("game over")
                }
            }else {
                setTimeout(() => {
                    if(data === undefined) {
                        console.log("ERROR")
                    }else if(data.war) {
                        if(!this.firstWarCard) {
                            this._handleFirstWarCard(data)
                        }else {
                           this._handleMultibleWarCards(data, handler2)
                        }
                    }else {
                        console.log("Y")
                        this._updateDisplay(data)
                    }
                }, 500);
            }
        })
    }


    // =======================
    //  UTILITY METHODS ======
    // ======================= 

    _renderCards(data) {
        this.cardImgs[0].src = data.computerImg
        this.cardImgs[1].src = data.playerImg
        this.remainingSpan.textContent =  data.cardsRemaining
        this.cardContainers.forEach(container => {
            container.style.display = "block"
        })
    }

    _updateDisplay(data) {
        this._renderCards(data)
        this._renderScore(data)
        this._renderMsg(data)
        setTimeout(() => {
            this._reset()
        }, 2000)
    }

    _renderScore(data) {
        this.playerScore.textContent = data.playerScore
        this.computerScore.textContent = data.computerScore
        
    }

    _renderMsg(data) {
        this.drawBtn.style.display = "none"
        this.winnerTitle.textContent = data.msg
        this.winnerTitle.style.display = "block"
    }

    _reset() {
        this.winnerTitle.style.display = "none"
        this.drawBtn.style.display = "block"
        this.winnerTitle.textContent = ""
    }

    // ======================
    // WAR METHODS ==========
    // ======================

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

    _handleFirstWarCard(data) {
        this._renderCards(data)
        this._renderMsg(data)
        this.firstWarCard = true
        setTimeout(() => {
            this._reset()
        }, 2000)
    }

    _handleMultibleWarCards(data,handler2) {
        const warArr = this._createWarCards(data)
        this._renderWarCards(warArr, data)
        this.firstWarCard = handler2(data)
        if(!this.firstWarCard) {
            this._endWar(data)
            this._removeWarCards(data)
        } else {
            this._continueWar(data)
        }
    }

    _renderWarCards(warCards, data) {
        const lastCCard = this.cardContainers[0].lastElementChild
        lastCCard.classList.remove("c-indicator")
        const lastPCard = this.cardContainers[1].lastElementChild
        lastPCard.classList.remove("p-indicator")
        this.cardContainers[1].appendChild(warCards[0])
        this.cardContainers[0].appendChild(warCards[1])
        this.remainingSpan.textContent =  data.cardsRemaining

    }

    _removeWarCards(data) {
        console.log("NOW")
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


    _endWar(data) {
        this._renderScore(data)
        this._renderMsg(data)
    }

    _continueWar(data) {
        this._renderMsg(data)
        setTimeout(() => {
            this._reset()
        }, 2000)
    }
}

