import { MigrationPreviewService, type MigrationPreviewResult } from './migration/migrationPreview';
import { MigrationExecutionService, type MigrationResult } from './migration/migrationExecution';
import { CardValidationService, type CardValidationResult } from './migration/cardValidation';
import { CardPreparationService } from './migration/cardPreparation';
import type { CardData } from '@/types/card';

// Re-export types for backward compatibility
export type { MigrationResult, CardValidationResult };

export class CardMigrationService {
  // Delegate to validation service
  static validateCard(card: CardData): CardValidationResult {
    return CardValidationService.validateCard(card);
  }

  // Delegate to preparation service
  static prepareCardForDatabase(card: CardData, userId: string): any {
    return CardPreparationService.prepareCardForDatabase(card, userId);
  }

  // Delegate to preview service
  static async previewMigration(userId: string): Promise<MigrationPreviewResult> {
    return MigrationPreviewService.previewMigration(userId);
  }

  // Delegate to execution service
  static async executeMigration(userId: string): Promise<MigrationResult> {
    return MigrationExecutionService.executeMigration(userId);
  }
}
