/**
 * Room model
 */
class Room {
    constructor(data = {}) {
        this.id = null;
        this.name = null;
        this.gameName = null;
        this.status = null;
        this.players = null;
        this.ownerId = null;
        Object.assign(this, data);
    }
}
export default Room;