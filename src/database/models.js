import { importDirectory } from '../util/importing.js';
import { logInfo } from '../util/logging.js';

export async function loadModels(sequelize)
{
	const modelModules = await importDirectory('./src/database/models', '.model.js');
	logInfo('sequelize', `Loaded ${modelModules.length} model(s)`);
	
	return modelModules.reduce((acc, modelModule) => {
		acc[modelModule.modelName] = modelModule.define(sequelize);
		return acc;
	}, {});
}

export async function associateModels(models)
{
	const modelModules = await importDirectory('./src/database/models', '.model.js');
	const associableModelModules = modelModules.filter((modelModule) => modelModule.associate);
	logInfo('sequelize', `Associated ${associableModelModules.length} model(s)`);

	for (const modelModule of associableModelModules)
		modelModule.associate(models);
}
