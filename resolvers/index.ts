import { merge } from 'lodash';
import { resolvers as clientResolvers } from './Client';
import { resolvers as registrationResolver } from './Registration';
import { resolvers as loginResolver } from './Login';
import { resolvers as userResolver } from './User';
import { resolvers as projectResolvers } from './Project';
import { resolvers as tagResolvers } from './Tag';
import { resolvers as workSpaceResolvers } from './WorkSpace';
import { resolvers as taskResolver } from './Task';
import { resolvers as alertResolver } from './Alert';
import { resolvers as WorkspaceMemberRoleResolver } from './Workspace_member_role';
import { resolvers as timeTrackerResolver } from './TimeTracker';
import { resolvers as verifyEmailResolver } from './VerifyEmail';
import { resolvers as ForgotPasswordResolver } from './ForgotPassword';
import { resolvers as userGroupResolver } from './UserGroup';
import { resolvers as userGroupMemberResolver } from './UserGroupMember';
import { resolvers as dashboardResolver } from './Dashboard';
import { resolvers as summaryReportResolver } from './SummaryReport';
import { resolvers as detailsreportResolver } from './DetailsReport';
import { resolvers as verifyUserResolver } from './VerifyUser';

const newResolvers = merge(
  clientResolvers,
  registrationResolver,
  loginResolver,
  userResolver,
  projectResolvers,
  tagResolvers,
  workSpaceResolvers,
  taskResolver,
  alertResolver,
  WorkspaceMemberRoleResolver,
  timeTrackerResolver,
  verifyEmailResolver,
  ForgotPasswordResolver,
  userGroupResolver,
  userGroupMemberResolver,
  dashboardResolver,
  summaryReportResolver,
  detailsreportResolver,
  verifyUserResolver
);

export default newResolvers;
