import { MongoClient } from 'mongodb';
const stringConnection: string = process.env.STRING_CONNECTION_DOCUMENT_DB || '';
const client = new MongoClient(stringConnection, {
    tlsCAFile: `rds-combined-ca-bundle.pem`, //Specify the DocDB; cert
});

const clientDatabase = client.db('test');
export { clientDatabase };
