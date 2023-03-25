const up = (query, DataTypes) => {
  return query.addColumn('projects', 'owner_id', {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' },
  });
};

const down = async () => {
  return;
};

export { up, down };
