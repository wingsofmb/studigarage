import { ServiceTheme } from 'src/data-layer/repair-service/service-theme.enum';

export interface RepairService {
  id: number;
  createdAt: string;
  updatedAt: string;
  theme: ServiceTheme;
  name: string;
  price: string;
}
