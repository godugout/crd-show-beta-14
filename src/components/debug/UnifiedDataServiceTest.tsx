import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { unifiedDataService } from '@/services/unifiedDataService';
import { localCardStorage } from '@/lib/localCardStorage';
import type { CardData } from '@/types/card';

export const UnifiedDataServiceTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      addResult('🔄 Starting unified data service tests...');

      // Test 1: Save a card
      const testCard: CardData = {
        id: `test_${Date.now()}`,
        title: 'Test Card',
        description: 'Test Description',
        rarity: 'common',
        tags: ['test'],
        design_metadata: {},
        visibility: 'private',
        creator_attribution: {
          creator_name: 'Test User',
          creator_id: 'test_user',
          collaboration_type: 'solo'
        },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: true,
          print_available: false,
          pricing: { currency: 'USD' },
          distribution: { limited_edition: false }
        }
      };

      addResult('💾 Testing card save...');
      const saveSuccess = await unifiedDataService.saveCard(testCard);
      addResult(saveSuccess ? '✅ Card saved successfully' : '❌ Card save failed');

      // Test 2: Retrieve the card
      addResult('🔍 Testing card retrieval...');
      const retrievedCard = await unifiedDataService.getCard(testCard.id);
      addResult(retrievedCard ? '✅ Card retrieved successfully' : '❌ Card retrieval failed');

      // Test 3: Get all cards
      addResult('📋 Testing get all cards...');
      const allCards = await unifiedDataService.getAllCards();
      addResult(`✅ Retrieved ${allCards.length} cards`);

      // Test 4: Test session storage
      addResult('💼 Testing session storage...');
      const sessionData = { test: 'session_data', timestamp: Date.now() };
      const sessionSaved = await unifiedDataService.saveSession('test_session', sessionData);
      addResult(sessionSaved ? '✅ Session saved' : '❌ Session save failed');

      const retrievedSession = await unifiedDataService.getSession('test_session');
      addResult(retrievedSession ? '✅ Session retrieved' : '❌ Session retrieval failed');

      // Test 5: Test cache
      addResult('🗂️ Testing cache...');
      const cacheData = { cached: true, value: 'test_cache' };
      const cacheSaved = await unifiedDataService.setCached('test_cache', cacheData, 5000);
      addResult(cacheSaved ? '✅ Cache saved' : '❌ Cache save failed');

      const retrievedCache = await unifiedDataService.getCached('test_cache');
      addResult(retrievedCache ? '✅ Cache retrieved' : '❌ Cache retrieval failed');

      // Test 6: Test backward compatibility
      addResult('🔗 Testing backward compatibility...');
      const legacyCards = localCardStorage.getAllCards();
      addResult(`✅ Legacy method returned ${legacyCards.length} cards`);

      // Test 7: Migration test
      addResult('📦 Testing migration...');
      const migrationResult = await unifiedDataService.migrateFromOldStorage();
      addResult(`✅ Migration: ${migrationResult.migrated} items, ${migrationResult.cleaned.length} cleaned`);

      // Cleanup
      addResult('🧹 Cleaning up test data...');
      await unifiedDataService.deleteCard(testCard.id);
      await unifiedDataService.deleteSession('test_session');
      
      addResult('🎉 All tests completed!');
      
    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Unified Data Service Test</h2>
      
      <div className="mb-4">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? 'Running Tests...' : 'Run Unified Data Service Tests'}
        </Button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
        {testResults.length === 0 && !isRunning && (
          <div className="text-gray-500">Click "Run Tests" to start testing the unified data service</div>
        )}
        
        {testResults.map((result, index) => (
          <div key={index} className="mb-1">
            {result}
          </div>
        ))}
        
        {isRunning && (
          <div className="text-yellow-400 animate-pulse">
            🔄 Tests running...
          </div>
        )}
      </div>
    </div>
  );
};