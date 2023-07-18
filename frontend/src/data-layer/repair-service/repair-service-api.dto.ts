import { ServiceTheme } from 'src/data-layer/repair-service/service-theme.enum';

export interface CreateRepairServicePayload {
  theme: ServiceTheme;
  name: string;
  price: number;
}
