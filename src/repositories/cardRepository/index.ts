
import { cardOperations } from './operations';
import { cardQueries } from './queries';

export * from './types';
export * from './mappers';

export const CardRepository = {
  ...cardOperations,
  ...cardQueries
};
