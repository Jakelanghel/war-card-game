class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.view.bindStartGame(this.onDeckBtnClick)
        this.view.bindDrawCards(this.HandleDrawClick)

    }

    onDeckBtnClick = async () => {
        const startGame = await this.model.getNewDeck()
        return await startGame
        
    }

    HandleDrawClick = async () => {
        const viewData = await this.model.drawCards()
        return viewData
    }
}

const app = new Controller(new Model(), new View())

