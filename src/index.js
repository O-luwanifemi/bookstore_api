import express from 'express';
import cors from 'cors';
import client from './database/index.js';
import router from './routes/index.js';

client.connect();

const app = express();
const port = process.env.PORT || 2222;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use('/books', router);

app.listen(port, console.log(`Server is running at http://localhost:${port}`));