
import { CardRepository } from '@/repositories/cardRepository';
import { CardStorageService } from '../cardStorage';
import { CardValidationService } from './cardValidation';
import { CardPreparationService } from './cardPreparation';

export interface MigrationResult {
  success: boolean;
  totalCards: number;
  migratedCount: number;
  failedCount: number;
  errors: Array<{
    cardId: string;
    cardTitle: string;
    error: string;
    validationDetails?: any;
  }>;
  warnings: string[];
  detailedReport: any;
}

export class MigrationExecutionService {
  static async executeMigration(userId: string): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      totalCards: 0,
      migratedCount: 0,
      failedCount: 0,
      errors: [],
      warnings: [],
      detailedReport: {}
    };

    try {
      console.log('🚀 Starting enhanced card migration...');
      
      // First consolidate storage
      const consolidation = CardStorageService.consolidateStorage();
      if (consolidation.errors.length > 0) {
        result.warnings.push(...consolidation.errors);
      }

      const allCards = CardStorageService.getAllCards();
      result.totalCards = allCards.length;

      console.log(`📦 Processing ${allCards.length} cards for migration`);

      if (allCards.length === 0) {
        result.success = true;
        result.warnings.push('No cards found to migrate');
        return result;
      }

      // Process each card with detailed logging
      for (let i = 0; i < allCards.length; i++) {
        const card = allCards[i];
        console.log(`\n🔄 Processing card ${i + 1}/${allCards.length}: ${card.title || 'Untitled'}`);
        
        try {
          // Enhanced validation
          const validation = CardValidationService.validateCard(card);
          if (!validation.isValid) {
            const errorDetail = {
              cardId: card.id || 'unknown',
              cardTitle: card.title || 'Untitled',
              error: `Validation failed: ${validation.errors.join(', ')}`,
              validationDetails: validation
            };
            result.errors.push(errorDetail);
            result.failedCount++;
            console.error(`❌ Validation failed for "${card.title}":`, validation.errors);
            continue;
          }

          if (validation.warnings.length > 0) {
            result.warnings.push(`${card.title}: ${validation.warnings.join(', ')}`);
            console.warn(`⚠️ Warnings for "${card.title}":`, validation.warnings);
          }

          // Prepare for database with enhanced logging
          const dbCard = CardPreparationService.prepareCardForDatabase(card, userId);
          console.log(`💾 Attempting database insertion for "${card.title}"`);
          
          // Attempt database insertion with timeout and proper error handling
          let dbResult: any;
          try {
            dbResult = await Promise.race([
              CardRepository.createCard(dbCard),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Database timeout after 10 seconds')), 10000)
              )
            ]);
          } catch (timeoutError) {
            const errorDetail = {
              cardId: card.id || 'unknown',
              cardTitle: card.title || 'Untitled',
              error: timeoutError instanceof Error ? timeoutError.message : 'Database operation timeout',
              validationDetails: validation
            };
            result.errors.push(errorDetail);
            result.failedCount++;
            console.error(`❌ Database timeout for "${card.title}"`);
            continue;
          }
          
          if (dbResult && typeof dbResult === 'object' && 'id' in dbResult) {
            result.migratedCount++;
            console.log(`✅ Successfully migrated "${card.title}" (DB ID: ${(dbResult as any).id})`);
          } else {
            const errorDetail = {
              cardId: card.id || 'unknown',
              cardTitle: card.title || 'Untitled',
              error: 'Database insertion failed - no result returned',
              validationDetails: validation
            };
            result.errors.push(errorDetail);
            result.failedCount++;
            console.error(`❌ Database insertion returned null for "${card.title}"`);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          const errorDetail = {
            cardId: card.id || 'unknown',
            cardTitle: card.title || 'Untitled',
            error: errorMessage,
            validationDetails: undefined
          };
          result.errors.push(errorDetail);
          result.failedCount++;
          console.error(`❌ Migration error for "${card.title}":`, error);
        }
      }

      result.success = result.migratedCount > 0;
      result.detailedReport = {
        processedAt: new Date().toISOString(),
        userRequested: userId,
        consolidationWarnings: consolidation.errors
      };
      
      console.log(`\n🎯 Migration completed:`, {
        total: result.totalCards,
        success: result.migratedCount,
        failed: result.failedCount,
        successRate: `${((result.migratedCount / result.totalCards) * 100).toFixed(1)}%`
      });

      // Log detailed error summary
      if (result.errors.length > 0) {
        console.group('❌ Failed Card Details:');
        result.errors.forEach((error, index) => {
          console.log(`${index + 1}. ${error.cardTitle} (${error.cardId}): ${error.error}`);
        });
        console.groupEnd();
      }
      
      return result;
    } catch (error) {
      console.error('💥 Migration system error:', error);
      result.errors.push({
        cardId: 'system',
        cardTitle: 'Migration System',
        error: error instanceof Error ? error.message : 'Unknown system error',
        validationDetails: undefined
      });
      return result;
    }
  }
}
