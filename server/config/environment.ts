export interface IEnvironment {
  name: string;
  is_development: boolean;
  is_staging: boolean;
  is_test: boolean;
  is_production: boolean;
}

export class Environment implements IEnvironment {
  name: string = process.env.NODE_ENV_NAME as string;

  is_development: boolean = process.env.NODE_ENV_NAME === 'development';

  is_staging: boolean = process.env.NODE_ENV_NAME === 'staging';

  is_test: boolean = process.env.NODE_ENV_NAME === 'test';

  is_production: boolean = ['production', 'prod'].includes(process.env.NODE_ENV_NAME as string);
}
