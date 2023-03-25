import * as Client from './Client';
import * as User from './User';
import * as Registration from './Registration';
import * as Login from './Login';
import * as Project from './Project';
import * as Tag from './Tag';
import * as WorkSpace from './WorkSpace';
import * as Task from './Task';
import * as Alert from './Alert';
import * as Workspace_member_role from './Workspace_member_role';
import * as TimeTracker from './TimeTracker';
import * as VerifyEmail from './VerifyEmail';
import * as ForgotPassword from './ForgotPassword';
import * as UserGroup from './UserGroup';
import * as UserGroupMember from './UserGroupMember';
import * as Dashboard from './Dashboard';
import * as SummaryReport from './SummaryReport';
import * as DetailsReport from './DetailsReport';
import * as VerifyUser from './VerifyUser';

const types: any = [];
const queries: any = [];
const mutations: any = [];

const schemas = [
  Client,
  User,
  Registration,
  Login,
  Project,
  Tag,
  WorkSpace,
  Task,
  TimeTracker,
  Workspace_member_role,
  Alert,
  VerifyEmail,
  ForgotPassword,
  UserGroup,
  UserGroupMember,
  Dashboard,
  SummaryReport,
  DetailsReport,
  VerifyUser,
];

schemas.forEach(s => {
  types.push(s.types);
  queries.push(s.queries);
  mutations.push(s.mutations);
});

export default `
${types.join('\n')}

type Query {
  ${queries.join('\n')}
}

type Mutation {
  ${mutations.join('\n')}
}

schema {
  query: Query
  mutation: Mutation
}
`;
