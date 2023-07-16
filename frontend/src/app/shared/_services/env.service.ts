import { Injectable } from '@angular/core';
import { Environment } from 'src/app/shared/_models/environment.enum';
import { envConfig } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  public getEnv(): Environment {
    return envConfig.env;
  }

  public isDev(): boolean {
    return envConfig.env === Environment.development;
  }

  public isProd(): boolean {
    return envConfig.env === Environment.production;
  }
}
