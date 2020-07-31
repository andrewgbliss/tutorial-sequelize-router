export default {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'customers',
      [
        {
          first_name: 'John',
          last_name: 'Denver',
          custom: JSON.stringify({
            status: 1,
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          first_name: 'Mike',
          last_name: 'Denver',
          custom: JSON.stringify({
            status: 2,
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('customers', null, {});
  },
};
