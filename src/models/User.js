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
    this.globalRanking = null;
    this.communityRanking = null;
    Object.assign(this, data);
  }
}
export default User;
