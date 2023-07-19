import { ReviewStatus } from 'src/data-layer/review/review-status.enum';

export const reviewStatusMapping = {
  [ReviewStatus.PENDING as string]: `En attente`,
  [ReviewStatus.REJECTED as string]: 'Rejeté',
  [ReviewStatus.VALIDATED as string]: 'Validé',
};
