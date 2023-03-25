const up = (query, DataTypes) => {
  return query.changeColumn('clients', 'archive_status', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
};

const down = async () => {
  return;
};

export { up, down };
