/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.password = null;
    this.token = null;
    this.status = null;
    this.score = null;
    this.image=null;
    this.globalRanking = null;
    this.communityRanking = null;
    this.word = null;
    this.description = null;
    Object.assign(this, data);
  }
}
export default User;