import { DataTypes } from 'sequelize';

export const modelName = 'User';
export function define(sequelize)
{
	return sequelize.define(modelName, {
		discordUID: {
			type: DataTypes.CHAR(18),
			allowNull: false,
			primaryKey: true
		},
		canvasRealm: {
			type: DataTypes.STRING,
			defaultValue: null,
		},
		canvasToken: {
			type: DataTypes.CHAR(70),
			defaultValue: null,
		}
	});
};
