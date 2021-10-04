class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.view.bindStartGame(this.onDeckBtnClick)
        this.view.bindDrawCards(this.HandleDrawClick, this.continueWar)
        this.view.bindRestartGame(this.restartGame)

    }

    onDeckBtnClick = async () => {
        const startGame = await this.model.getNewDeck()
        return await startGame
        
    }

    HandleDrawClick = async () => {
        const viewData = await this.model.drawCards()
        return viewData
    }
    restartGame = async () => {
        const remaining = this.model.restartGame()
        return remaining
    }

    continueWar = async () => {
        const remaining = this.model.shuffelDeck()
        return remaining
    }
}


const app = new Controller(new Model(), new View())
