
import { CardStorageService } from '@/services/cardStorage';
import { CardMigrationService } from '@/services/cardMigration';

export class CardStorageDebug {
  // Log detailed storage information
  static logStorageInfo(): void {
    console.group('📊 Card Storage Debug Information');
    
    const report = CardStorageService.getStorageReport();
    
    console.log('📈 Storage Summary:', {
      totalCards: report.totalCards,
      locations: report.locations.length,
      duplicates: report.duplicates,
      errors: report.errors.length
    });

    if (report.locations.length > 0) {
      console.group('📍 Storage Locations');
      report.locations.forEach(location => {
        console.log(`${location.key}:`, {
          cardCount: location.cards.length,
          cards: location.cards.map(c => ({
            id: c.id,
            title: c.title,
            rarity: c.rarity,
            visibility: c.visibility
          }))
        });
      });
      console.groupEnd();
    }

    if (report.errors.length > 0) {
      console.group('❌ Storage Errors');
      report.errors.forEach(error => console.error(error));
      console.groupEnd();
    }

    console.groupEnd();
  }

  // Preview migration with detailed logging
  static async previewMigrationDetailed(userId: string): Promise<void> {
    console.group('🔍 Migration Preview');
    
    try {
      const preview = await CardMigrationService.previewMigration(userId);
      
      console.log('📊 Preview Summary:', {
        totalCards: preview.report.totalCards,
        validCards: preview.validCards,
        invalidCards: preview.invalidCards,
        validationIssues: preview.validationIssues.length
      });

      if (preview.validationIssues.length > 0) {
        console.group('⚠️ Validation Issues');
        preview.validationIssues.forEach(issue => {
          console.log(`Card: ${issue.cardTitle} (${issue.cardId})`);
          if (issue.errors.length > 0) {
            console.error('Errors:', issue.errors);
          }
          if (issue.warnings.length > 0) {
            console.warn('Warnings:', issue.warnings);
          }
        });
        console.groupEnd();
      }

      console.log('Storage Report:', preview.report);
    } catch (error) {
      console.error('Preview failed:', error);
    }
    
    console.groupEnd();
  }

  // Test localStorage access
  static testLocalStorageAccess(): void {
    console.group('🔧 localStorage Test');
    
    try {
      const testKey = 'crd-test-' + Date.now();
      const testData = { test: true, timestamp: Date.now() };
      
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
      localStorage.removeItem(testKey);
      
      console.log('✅ localStorage access works');
      console.log('Test data:', testData);
      console.log('Retrieved data:', retrieved);
    } catch (error) {
      console.error('❌ localStorage access failed:', error);
    }
    
    console.groupEnd();
  }

  // Run comprehensive debug
  static runFullDebug(userId?: string): void {
    console.group('🚀 Full Card Storage Debug');
    
    this.testLocalStorageAccess();
    this.logStorageInfo();
    
    if (userId) {
      this.previewMigrationDetailed(userId).catch(console.error);
    }
    
    console.groupEnd();
  }
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).cardStorageDebug = CardStorageDebug;
}
