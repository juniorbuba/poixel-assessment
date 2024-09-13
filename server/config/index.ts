import { Environment, IEnvironment } from './environment';

const env: IEnvironment = new Environment();

export const config = {
  apps: {
    website: process.env.WEBSITE_URL as string,
    webapp: process.env.WEBAPP_URL as string,
    admin: process.env.ADMIN_URL as string,
    server: process.env.SERVER_URL as string,
  },
  env,
  port: process.env.PORT !== '' ? (process.env.PORT as string) : 4444,
  database: { mongo_url: process.env.MONGODB_URL as string  },
  session: { secret: process.env.SESSION_SECRET as string },
  web_application: {
    url: process.env.WEB_APP_URL as string,
    url_admin: process.env.WEB_APP_URL_ADMIN as string,
  }
};
