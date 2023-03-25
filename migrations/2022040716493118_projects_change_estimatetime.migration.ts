const up = (query, DataTypes) => {
  return query.changeColumn('projects', 'estimate_time', {
    type: DataTypes.STRING,
    allowNull: true,
  });
};

const down = async () => {
  return;
};
export { up, down };
