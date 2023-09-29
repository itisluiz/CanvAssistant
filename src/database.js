import { Sequelize } from 'sequelize';
import { prepareModels } from './models.js'

let sequelize = null, models = null;

async function closeSequelize()
{
	if (sequelize)
		await sequelize.close();

	sequelize = null;
}

async function getSequelize(forceNew = false)
{
	if (!sequelize || forceNew)
	{
		if (sequelize)
			await closeSequelize();

		sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			dialect: 'mariadb',
			logging: process.env.DB_SEQUELIZELOG === '1' ? (msg) => console.log('SEQUELIZE:', msg) : false
		});

		await sequelize.authenticate();
		models = prepareModels(sequelize);
		await sequelize.sync();
	}
	
	return { sequelize, models };
}

export { getSequelize, closeSequelize };
