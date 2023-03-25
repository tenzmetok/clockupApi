const up = (query, DataTypes) => {
  return query.addColumn('projects', 'highlighted', {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    default: false,
  });
};

const down = async () => {
  return;
};

export { up, down };
