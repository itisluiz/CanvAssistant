import { DataTypes } from 'sequelize';

export const modelName = 'User';
export function define(sequelize)
{
	return sequelize.define(modelName, {
		discordId: {
			type: DataTypes.CHAR(20),
			primaryKey: true
		},
		canvasToken: {
			type: DataTypes.CHAR(70),
			defaultValue: null
		}
	});
};

export function associate(models)
{
	models.User.belongsTo(models.Realm, {foreignKey: 'realmId'});
}
