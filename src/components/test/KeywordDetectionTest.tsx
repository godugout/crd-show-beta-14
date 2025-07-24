
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { simpleKeywordDetector } from '@/services/imageAnalysis/simpleKeywordDetector';

export const KeywordDetectionTest = () => {
  const [testInput, setTestInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleTest = () => {
    console.log('🧪 Manual keyword test with input:', testInput);
    const detectionResult = simpleKeywordDetector.detectFromKeywords(testInput);
    setResult(detectionResult);
  };

  const runPredefinedTests = () => {
    console.log('🧪 Running predefined tests...');
    simpleKeywordDetector.testKeywordDetection();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Keyword Detection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter test keywords (e.g., 'wookiee warrior', 'chewbacca', 'furry humanoid')"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleTest}>Test</Button>
          </div>
          
          <Button onClick={runPredefinedTests} variant="outline" className="w-full">
            Run Predefined Tests (check console)
          </Button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold text-lg">{result.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{result.description}</p>
              <div className="text-xs space-y-1">
                <div><strong>Rarity:</strong> {result.rarity}</div>
                <div><strong>Confidence:</strong> {result.confidence}</div>
                <div><strong>Method:</strong> {result.detectionMethod}</div>
                <div><strong>Matched Keywords:</strong> {result.matchedKeywords?.join(', ') || 'None'}</div>
                <div><strong>Tags:</strong> {result.tags.join(', ')}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
