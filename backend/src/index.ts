import app from './app';
import client from './database';

app.listen(4000, async () => {
    await client.connect();
    console.log('Listening on port 4000')
});