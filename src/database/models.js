import { importDirectory } from "../util/importing.js";

export async function loadModels(sequelize)
{
	const modelModules = await importDirectory('./src/database/models');
	return modelModules.reduce((acc, modelModule) => {
		acc[modelModule.modelName] = modelModule.define(sequelize);
		return acc;
	}, {});
}
