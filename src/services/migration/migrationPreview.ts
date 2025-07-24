
import { CardStorageService } from '../cardStorage';
import { CardValidationService } from './cardValidation';

export interface MigrationPreviewResult {
  report: any;
  validCards: number;
  invalidCards: number;
  validationIssues: Array<{
    cardId: string;
    cardTitle: string;
    errors: string[];
    warnings: string[];
  }>;
}

export class MigrationPreviewService {
  static async previewMigration(userId: string): Promise<MigrationPreviewResult> {
    console.log('🔍 Starting migration preview...');
    
    // First consolidate storage
    CardStorageService.consolidateStorage();
    
    const report = CardStorageService.getStorageReport();
    const allCards = CardStorageService.getAllCards();
    
    console.log(`📊 Found ${allCards.length} cards to analyze`);
    
    let validCards = 0;
    let invalidCards = 0;
    const validationIssues: Array<{
      cardId: string;
      cardTitle: string;
      errors: string[];
      warnings: string[];
    }> = [];

    for (const card of allCards) {
      const validation = CardValidationService.validateCard(card);
      
      if (validation.isValid) {
        validCards++;
      } else {
        invalidCards++;
      }

      if (validation.errors.length > 0 || validation.warnings.length > 0) {
        validationIssues.push({
          cardId: card.id || 'unknown',
          cardTitle: card.title || 'Untitled',
          errors: validation.errors,
          warnings: validation.warnings
        });
      }
    }

    console.log(`📈 Preview complete: ${validCards} valid, ${invalidCards} invalid`);

    return {
      report,
      validCards,
      invalidCards,
      validationIssues
    };
  }
}
