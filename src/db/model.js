import { DataTypes } from 'sequelize';

function prepareModels(sequelize)
{
	const User = sequelize.define('User', {
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

	return { User };
};

export { prepareModels };
