const up = (query, DataTypes) => {
  return Promise.all([
    query.changeColumn('tasks', 'estimate_time', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultvalue: '0',
    }),
    query.changeColumn('tasks', 'active_status', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultvalue: true,
    }),
  ]);
};
const down = async () => {
  return;
};

export { up, down };
