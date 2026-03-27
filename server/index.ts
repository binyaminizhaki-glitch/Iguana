import 'dotenv/config.js';
import { createApp } from './app.js';

const port = Number(process.env.API_PORT ?? 4000);
const app = createApp();

app.listen(port, '0.0.0.0', () => {
  console.log(`IASA backend running on http://0.0.0.0:${port}`);
});
