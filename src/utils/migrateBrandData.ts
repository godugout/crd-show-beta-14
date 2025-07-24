
import { CardshowBrandService } from '@/services/cardshowBrandService';
import { cardshowLogoDatabase } from '@/lib/cardshowDNA';
import { completeLogoThemes } from '@/lib/completeLogoThemes';
import type { CreateBrandRequest, BrandCategory } from '@/types/cardshowBrands';

export const migrateBrandData = async () => {
  console.log('Starting brand data migration...');
  
  const migrationResults = {
    success: 0,
    errors: 0,
    skipped: 0
  };

  for (const logo of cardshowLogoDatabase) {
    try {
      // Check if brand already exists
      const existingBrand = await CardshowBrandService.getBrandByDnaCode(logo.dnaCode);
      if (existingBrand) {
        console.log(`Brand ${logo.dnaCode} already exists, skipping...`);
        migrationResults.skipped++;
        continue;
      }

      // Get theme data
      const themeData = completeLogoThemes[logo.dnaCode as keyof typeof completeLogoThemes];
      
      // Parse category from logo data
      let category: BrandCategory = 'Modern';
      if (logo.dnaCode.includes('SCRIPT')) category = 'Script';
      else if (logo.dnaCode.includes('BOLD')) category = 'Bold';
      else if (logo.dnaCode.includes('RETRO')) category = 'Retro';
      else if (logo.dnaCode.includes('FANTASY')) category = 'Fantasy';
      else if (logo.dnaCode.includes('SCIFI')) category = 'SciFi';
      else if (logo.dnaCode.includes('CLASSIC')) category = 'Classic';

      // Create brand request with all required properties
      const brandRequest: CreateBrandRequest = {
        dna_code: logo.dnaCode,
        file_name: `${logo.dnaCode}.png`,
        display_name: logo.displayName,
        product_name: logo.displayName,
        image_url: logo.imageUrl,
        category,
        font_style: 'Unknown',
        design_elements: [],
        style_tags: [],
        color_palette: logo.colorPalette || [],
        primary_color: themeData?.logoTheme?.primary || '#000000',
        secondary_color: themeData?.logoTheme?.secondary || '#FFFFFF',
        logo_theme: themeData?.logoTheme || {},
        theme_usage: themeData?.themeUsage || {},
        team_code: logo.dnaCode.split('_')[1] || undefined,
        team_name: logo.displayName,
        league: 'CRD',
        rarity: 'common',
        power_level: 50,
        unlock_method: 'starter',
        collectibility_score: 50,
        is_blendable: true,
        is_remixable: true,
        drop_rate: 0.5,
        description: `${logo.displayName} brand theme for custom applications`
      };

      // Create brand in database
      const result = await CardshowBrandService.createBrand(brandRequest);
      if (result) {
        console.log(`Successfully migrated brand: ${logo.dnaCode}`);
        migrationResults.success++;
      } else {
        console.error(`Failed to create brand: ${logo.dnaCode}`);
        migrationResults.errors++;
      }

    } catch (error) {
      console.error(`Failed to migrate brand ${logo.dnaCode}:`, error);
      migrationResults.errors++;
    }
  }

  console.log('Brand data migration completed:', migrationResults);
  return migrationResults;
};

// Helper function to run migration from browser console
export const runBrandMigration = () => {
  migrateBrandData().then(results => {
    console.log('Migration Results:', results);
  }).catch(error => {
    console.error('Migration failed:', error);
  });
};

// Make available globally for development
if (typeof window !== 'undefined') {
  (window as any).runBrandMigration = runBrandMigration;
}
