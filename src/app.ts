import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';
import fs from 'node:fs';
import router from '@src/routes/router';

const app = express();

const file = fs.readFileSync('./swagger.yml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(3000, async () => {
  console.info('Server is running at http://localhost:3000');
  console.info('Docs are available at http://localhost:3000/api-docs');
});
