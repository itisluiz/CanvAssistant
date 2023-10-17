import { DataTypes } from 'sequelize';

export const modelName = 'Realm';
export function define(sequelize)
{
	return sequelize.define(modelName, {
		realmId: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		url: {
			type: DataTypes.STRING(512),
			allowNull: false,
			unique: true
		}
	});
};

export function associate(models)
{
	models.Realm.hasMany(models.User, {foreignKey: 'realmId'});
}
