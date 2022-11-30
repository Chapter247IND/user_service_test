"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [0, 100],
        },
      },
      birthDate: {
        type: DataTypes.DATEONLY,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          len: [0, 200],
        },
      },
      username: {
        type: DataTypes.STRING,
        validate: {
          isAlphanumeric: true,
          len: [24, 24],
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["active", "suspended", "archived"],
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: false,
    }
  );
  return User;
};
