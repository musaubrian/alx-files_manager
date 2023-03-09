import MongoClient from 'mongodb/lib/mongo_client'; 

class DBClient {
  constructor() {
    this.host = process.env.DB_HOST || 'localhost';
    this.port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';
    this.mongoUrl = `mongodb://${this.host}:${this.port}`;

    this.client = new MongoClient(this.mongoUrl, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.db = this.client.db(this.database);
    });
  }

  // Checks if the connection is successfull
  isAlive() {
    if (this.client.isConnected()) return true;
    return false;
  }

  // Returns the number of documents in the collection users
  async nbUsers() {
    const numOfUsers = await this.db.collection('users').countDocuments();
    return numOfUsers;
  }

  // Returns the number of documents in the collection files
  async nbFiles() {
    const numOfFiles = await this.db.collection('files').countDocuments();
    return numOfFiles;
  }
}

const dbClient = new DBClient();
export default dbClient;
