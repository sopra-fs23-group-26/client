/**
 * Game Undercover model
 */


class GameUndercover {
    constructor(data = {}) {
        this.id = null;
        this.users = null;
        this.currentPlayerId = null;
        this.gameStatus = null;
        this.currentPlayerUsername = null;
        Object.assign(this, data);
    }
}
export default GameUndercover;