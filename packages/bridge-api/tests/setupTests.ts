const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve('./.env.test') });

jest.setTimeout(15000);
