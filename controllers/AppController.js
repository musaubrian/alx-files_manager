import redisClient from '../utils/redis';
import dbClient from '../utils/db';

module.exports = class AppController {
  static getStatus (request, response) {
    const redisStatus = redisClient.isAlive();
    const mongoStatus = dbClient.isAlive();
    response.status(200).json({ redis: redisStatus, db: mongoStatus });
  }

  static async getStats (request, response) {
    const numOfUsers = await dbClient.nbUsers();
    const numOfFiles = await dbClient.nbFiles();

    response.status(200).json({ users: numOfUsers, files: numOfFiles });
  }
};
