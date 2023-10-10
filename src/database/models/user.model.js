import { DataTypes } from 'sequelize';

export const modelName = 'User';
export function define(sequelize)
{
	return sequelize.define(modelName, {
		discordId: {
			type: DataTypes.CHAR(18),
			primaryKey: true
		},
		canvasUserId: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false
		}
	});
};

export function associate(models)
{
	models.User.belongsTo(models.Realm);
}
