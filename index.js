import 'dotenv/config'
import { logInfo } from './src/util/logging.js'
import { getDiscordClient } from './src/discord/connection.js';
import { getSequelize } from './src/database/connection.js';

// await getSequelize();
// await getDiscordClient();
logInfo('index.js', 'Hello world');
