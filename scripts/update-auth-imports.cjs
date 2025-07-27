#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need to be updated
const filesToUpdate = [
  'src/components/home/CTASection.tsx',
  'src/components/auth/ForgotPasswordForm.tsx',
  'src/components/auth/ProtectedRoute.tsx',
  'src/components/auth/components/OAuthButtons.tsx',
  'src/components/auth/DevLoginFloatingButton.tsx',
  'src/components/cards/CardCreationInterface.tsx',
  'src/components/social/FollowButton.tsx',
  'src/components/social/ShareButton.tsx',
  'src/components/social/LikeButton.tsx',
  'src/components/editor/unified/components/steps/IntentStep.tsx',
  'src/components/editor/quick-create/RevolutionaryQuickCreate.tsx',
  'src/pages/DNALabLanding.tsx',
  'src/pages/auth/VerifyEmail.tsx',
  'src/pages/Studio.tsx',
  'src/pages/UserGallery.tsx',
  'src/pages/BulkUpload.tsx'
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace import
    content = content.replace(
      /import\s+\{\s*useAuth\s*\}\s+from\s+['"]@\/features\/auth\/providers\/AuthProvider['"];?/g,
      "import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';"
    );
    
    // Replace usage
    content = content.replace(
      /const\s+\{\s*([^}]+)\s*\}\s*=\s*useAuth\(\);/g,
      'const { $1 } = useSecureAuth();'
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
}

console.log('🔄 Updating auth imports...');

filesToUpdate.forEach(updateFile);

console.log('✅ Auth import update complete!'); 