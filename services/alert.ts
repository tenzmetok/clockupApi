import { Container, Service, Inject } from 'typedi';
import Alert from '../models/alert';
import { IAlert, IAlertInput } from '../types/Alert';
import ProjectService from './project';
import TaskService from './task';
import UserService from './user';
import alertTemplate from '../assets/alertTemplate';
import config from '../config';
import { sendEmail } from '../services/aws';
import ClientService from './client';

@Service()
export default class AlertService {
  constructor(@Inject('AlertModel') private alertModel: typeof Alert, @Inject('logger') private logger) {}

  public async addAlert(body): Promise<boolean> {
    try {
      const { alert_name, name, details, workspace_id } = body;
      const alert = await this.alertModel.findOrCreate({
        where: {
          alert_name,
          name,
          details,
          workspace_id,
        },
        defaults: body,
      });
      return alert[1];
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAllAlerts(opArgs, where = {}): Promise<{ getAllAlerts: IAlert[]; count: number }> {
    try {
      const { rows: getAllAlerts, count } = await this.alertModel.findAndCountAll({
        ...opArgs,
        ...where,
      });
      return { getAllAlerts, count };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getAlert(where = {}): Promise<{ alert: IAlert }> {
    try {
      const alert = await this.alertModel.findOne({ where, raw: true });
      return { alert };
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateAlert(body: IAlertInput): Promise<number> {
    try {
      const { id, alert_name, name, details, workspace_id } = body;
      const opArgs = {
        id,
        workspace_id,
        alert_name,
        name,
        details,
      };

      const isExist = await this.alertModel.findOne({
        where: {
          workspace_id,
          alert_name,
          name,
          details,
        },
      });
      if (isExist) {
        return 0;
      }

      const [isUpdated] = await this.alertModel.update(opArgs, {
        where: { id, workspace_id },
      });
      return isUpdated;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async removeAlert(id: any): Promise<number> {
    try {
      const isRemoved = await this.alertModel.destroy({ where: id });
      return isRemoved;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  public async sendAlertMail(values, where = {}): Promise<number> {
    try {
      const projectServiceInstance = Container.get(ProjectService);
      const { projects } = await projectServiceInstance.getFilteredProjects({
        offset: 0,
        where: { workspace_id: values.workspace_id },
        order: [['name', 'ASC']],
      });

      projects &&
        projects.length &&
        projects.map(async item => {
          const clientServiceInstance = Container.get(ClientService);
          const client_name = await clientServiceInstance.getClientNameByClientID(item.client_id);
          if (item.estimation_type === 'Task-based') {
            const taskServiceInstance = Container.get(TaskService);
            const { task } = await taskServiceInstance.getFilteredTasks({
              offset: 0,
              where: { project_id: item.id },
              order: [['task_name', 'ASC']],
            });
            task &&
              task.length &&
              task.map(async data => {
                const alertTime = (12 / parseInt(data.estimate_time)) * 100;
                if (
                  (alertTime >= parseInt(values.details) && alertTime <= parseInt(values.details) + 25) ||
                  alertTime > 100
                ) {
                  const UserServiceInstance = Container.get(UserService);
                  const { user } = await UserServiceInstance.getUser({ id: values.workspace_id });
                  const template = await alertTemplate(data.task_name, values.details, user, client_name);
                  const params = {
                    from: config.senderEmail,
                    to: [user.email.trim()],
                    Subject: {
                      Charset: 'UTF-8',
                      Data: template.subject,
                    },
                    Body: {
                      Html: {
                        Charset: 'UTF-8',
                        Data: template.html,
                      },
                      Text: {
                        Charset: 'UTF-8',
                        Data: template.text,
                      },
                    },
                  };
                  await sendEmail(params);
                }
              });
            return;
          } else {
            const alertTime = (22 / parseInt(item.estimate_time)) * 100;
            if (
              (alertTime >= parseInt(values.details) && alertTime <= parseInt(values.details) + 25) ||
              alertTime > 100
            ) {
              const UserServiceInstance = Container.get(UserService);
              const { user } = await UserServiceInstance.getUser({ id: values.workspace_id });
              const template = await alertTemplate(item.name, values.details, user, client_name);
              const params = {
                from: config.senderEmail,
                to: [user.email.trim()],
                Subject: {
                  Charset: 'UTF-8',
                  Data: template.subject,
                },
                Body: {
                  Html: {
                    Charset: 'UTF-8',
                    Data: template.html,
                  },
                  Text: {
                    Charset: 'UTF-8',
                    Data: template.text,
                  },
                },
              };
              await sendEmail(params);
            }
          }
        });

      return;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
