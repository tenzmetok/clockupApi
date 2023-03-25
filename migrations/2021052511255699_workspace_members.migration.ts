const up = (query, DataTypes) => {
  return query.createTable('workspace_members', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
    },
    workspace_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'workspace', key: 'id' },
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: { model: 'users', key: 'id' },
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

const down = async query => {
  return;
};

export { up, down };
