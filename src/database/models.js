import { importDirectory } from "../util/importing.js";
import { logInfo } from "../util/logging.js";

export async function loadModels(sequelize)
{
	const modelModules = await importDirectory('./src/database/models');
	logInfo('sequelize', `Loaded ${modelModules.length} model(s)`);
	
	return modelModules.reduce((acc, modelModule) => {
		acc[modelModule.modelName] = modelModule.define(sequelize);
		return acc;
	}, {});
}
