import { Sequelize } from 'sequelize';
import { associateModels, loadModels } from './models.js';
import { logDebug, logInfo } from '../util/logging.js';

let sequelize = null
let models = null;

export async function closeSequelize()
{
	if (sequelize)
		await sequelize.close();

	sequelize = null;
}

export async function getSequelize(forceNew = false)
{
	if (!sequelize || forceNew)
	{
		if (sequelize)
			await closeSequelize();

		sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			dialect: 'mariadb',
			logging: (what) => logDebug('sequelize', what)
		});

		await sequelize.authenticate();
		logInfo('sequelize', `Authenticated to database "${sequelize.getDatabaseName()}"`);
		models = await loadModels(sequelize);
		await associateModels(models);
		await sequelize.sync();
	}
	
	return { sequelize, models };
}
