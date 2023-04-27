/**
 * Game History model
 */


class GameHistory {
    constructor(data = {}) {
        this.id = null;
        this.username = null;
        this.winOrLose = null;
        this.earnedPoint = null;
        this.gameName = null;
        this.time = null;
        Object.assign(this, data);
    }
}
export default GameHistory;