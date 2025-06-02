const { getDB } = require("../config/db");

class User {
  static async findByUsername(username) {
    const db = getDB();
    return db.collection("users").findOne({ username });
  }

  static async findUserWithShops(shops) {
    const db = getDB();
    return db.collection("users").findOne({ shops: { $in: shops } });
  }

  static async createUser(username, password, shops) {
    const db = getDB();
    return db.collection("users").insertOne({ username, password, shops });
  }
}

module.exports = User;