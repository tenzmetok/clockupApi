const up = (query, DataTypes) => {
  return query.addColumn('users', 'is_confirm', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

const down = async () => {
  return;
};

export { up, down };
