const up = (query, DataTypes) => {
  return query.createTable('workspace', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    owner_id: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    workspace_name: {
      type: DataTypes.STRING,
      allowNull: false,
    }, //done
    company_logo: {
      type: DataTypes.TEXT,
      allowNull: true,
    }, //done
    timetracker_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }, //done
    billing_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Billable',
      values: ['Billable', 'Non-billable'],
    }, //done
    visibility_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Public',
      values: ['Public', 'Private'],
    }, //done
    bill_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    }, //done
    bill_rate_view_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Admins',
      values: ['Admins', 'Everyone'],
    }, //done
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
    }, //done

    group_project_label: {
      type: DataTypes.STRING,
      allowNull: false,
    }, //done

    create_project_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Admins',
      values: ['Admins', 'Everyone'],
    }, //done
    create_client_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Admins',
      values: ['Admins', 'Everyone'],
    },
    create_task_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Admins',
      values: ['Admins', 'Everyone'],
    }, //done

    task_filter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }, //Done
    create_tag_status: {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'Admins',
      values: ['Admins', 'Everyone'],
    }, //done
    time_format: {
      type: DataTypes.STRING,
      allowNull: false,
    }, //done
    favorite_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }, //done
    active_status: {
      type: DataTypes.BOOLEAN,
    },
    created_by: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    updated_by: {
      type: DataTypes.INTEGER,
      references: { model: 'users', key: 'id' },
    },
    created_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
    updated_at: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  });
};

const down = query => {
  return query.dropTable('workspace');
};

export { up, down };
