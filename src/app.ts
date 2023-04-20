import express from 'express';
import helmet from 'helmet';
import router from '@src/routes/router';

const app = express();

app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(3000, async () => {
  console.log('Server is running on http://localhost:3000');
});
