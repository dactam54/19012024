module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Bills',
            'isChecked',
            Sequelize.BOOLEAN
        );

    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Bills',
            'isChecked'
        );
    }
}