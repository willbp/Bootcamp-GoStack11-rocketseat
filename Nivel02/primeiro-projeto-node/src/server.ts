import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

// app.get('/', (request, response) => response.json({ message: 'Teste' }));

app.listen(3333, () => {
    // eslint-disable-next-line no-console
    console.log('Server Started on port 3333!');
});
