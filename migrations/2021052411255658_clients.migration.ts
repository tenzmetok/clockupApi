const up = (query, DataTypes) => {
  return query.createTable('clients', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      references: { model: 'workspace', key: 'id' },
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    archive_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
};

const down = query => {
  return query.dropTable('clients');
};

export { up, down };
