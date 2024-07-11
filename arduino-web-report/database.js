const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

const SensorData = sequelize.define('SensorData', {
    distanceToPerson: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    distanceToTrash: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

(async () => {
    await sequelize.sync();
})();

module.exports = { SensorData };
