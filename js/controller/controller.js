class Controller {
    constructor(model, view) {
        this.model = model
        this.view = view
        this.view.bindStartGame(this.onDeckBtnClick)
        this.view.bindDrawCards(this.HandleDrawClick, this.handleWar)
    }

    onDeckBtnClick = () => {
        this.model.getNewDeck()
        
    }

    HandleDrawClick = async () => {
        const viewData = await this.model.drawCards()
        return viewData
    }

    handleWar = () => {
        this.model.endWar()
    }

}

const app = new Controller(new Model(), new View())

