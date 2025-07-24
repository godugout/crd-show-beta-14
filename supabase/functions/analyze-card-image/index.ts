
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const huggingFaceToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisResult {
  playerName?: string;
  teamName?: string;
  year?: string;
  cardNumber?: string;
  manufacturer?: string;
  extractedText?: string[];
  confidence: number;
  visualAnalysis?: {
    condition: string;
    conditionScore: number;
    hasHologram: boolean;
    hasAutograph: boolean;
    hasRelic: boolean;
    isVintage: boolean;
    dominantColors: string[];
    layout: string;
    manufacturer?: string;
  };
  estimatedValue?: number;
  analysisMethod: string;
  stats?: Record<string, string>;
}

async function performOCRAnalysis(imageData: string): Promise<Partial<AnalysisResult>> {
  if (!huggingFaceToken) {
    console.log('No Hugging Face token - skipping OCR analysis');
    return { analysisMethod: 'visual_fallback', confidence: 0.3 };
  }

  try {
    console.log('🔍 Starting OCR analysis with Hugging Face...');
    
    const response = await fetch(
      'https://api-inference.huggingface.co/models/microsoft/trocr-base-printed',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingFaceToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: imageData,
          options: { wait_for_model: true }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OCR API failed: ${response.statusText}`);
    }

    const ocrResult = await response.json();
    const extractedText = ocrResult?.[0]?.generated_text || '';
    
    console.log('📝 OCR extracted text:', extractedText);

    // Parse baseball card specific information
    const playerMatch = extractedText.match(/([A-Z][a-z]+ [A-Z][a-z]+)/);
    const yearMatch = extractedText.match(/(19|20)\d{2}/);
    const numberMatch = extractedText.match(/#?(\d{1,4})/);
    
    return {
      extractedText: [extractedText],
      playerName: playerMatch?.[0],
      year: yearMatch?.[0],
      cardNumber: numberMatch?.[1],
      analysisMethod: 'ocr',
      confidence: extractedText.length > 10 ? 0.8 : 0.4
    };
  } catch (error) {
    console.error('OCR analysis failed:', error);
    return { analysisMethod: 'ocr_failed', confidence: 0.2 };
  }
}

async function performVisualAnalysis(imageData: string): Promise<Partial<AnalysisResult>> {
  if (!openAIApiKey) {
    console.log('No OpenAI key - using basic visual analysis');
    return {
      visualAnalysis: {
        condition: 'good',
        conditionScore: 70,
        hasHologram: false,
        hasAutograph: false,
        hasRelic: false,
        isVintage: false,
        dominantColors: ['#ffffff', '#000000'],
        layout: 'standard'
      },
      analysisMethod: 'visual_basic',
      confidence: 0.5
    };
  }

  try {
    console.log('👁️ Starting visual analysis with GPT-4V...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert baseball card appraiser. Analyze this card image and provide detailed information in JSON format with these fields:
            - playerName: extracted player name if visible
            - teamName: team name or abbreviation
            - year: estimated year based on design
            - manufacturer: card company (Topps, Panini, Upper Deck, etc.)
            - condition: poor/fair/good/excellent/mint based on visible wear
            - conditionScore: 0-100 numeric condition score
            - hasHologram: true if holographic elements visible
            - hasAutograph: true if signature visible
            - hasRelic: true if jersey/bat piece visible
            - isVintage: true if appears to be from before 1990
            - dominantColors: array of hex colors
            - estimatedValue: estimated market value in USD
            - layout: standard/horizontal/special describing card layout
            - specialFeatures: array of notable features`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Please analyze this baseball card image and provide detailed information.'
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 800,
        temperature: 0.1
      }),
    });

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content;
    
    if (!analysisText) {
      throw new Error('No analysis content received');
    }

    console.log('🔍 Visual analysis result:', analysisText);

    try {
      const analysis = JSON.parse(analysisText);
      
      return {
        playerName: analysis.playerName,
        teamName: analysis.teamName,
        year: analysis.year?.toString(),
        manufacturer: analysis.manufacturer,
        estimatedValue: analysis.estimatedValue || 0,
        visualAnalysis: {
          condition: analysis.condition || 'good',
          conditionScore: analysis.conditionScore || 70,
          hasHologram: analysis.hasHologram || false,
          hasAutograph: analysis.hasAutograph || false,
          hasRelic: analysis.hasRelic || false,
          isVintage: analysis.isVintage || false,
          dominantColors: analysis.dominantColors || ['#ffffff', '#000000'],
          layout: analysis.layout || 'standard',
          manufacturer: analysis.manufacturer
        },
        analysisMethod: 'visual_ai',
        confidence: 0.75
      };
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      // Fallback parsing for key information
      const playerMatch = analysisText.match(/player[^:]*:\s*([^,\n]+)/i);
      const teamMatch = analysisText.match(/team[^:]*:\s*([^,\n]+)/i);
      const yearMatch = analysisText.match(/(19|20)\d{2}/);
      const valueMatch = analysisText.match(/\$?(\d+(?:\.\d{2})?)/);
      
      return {
        playerName: playerMatch?.[1]?.trim(),
        teamName: teamMatch?.[1]?.trim(),
        year: yearMatch?.[0],
        estimatedValue: valueMatch ? parseFloat(valueMatch[1]) : 0,
        visualAnalysis: {
          condition: 'good',
          conditionScore: 70,
          hasHologram: false,
          hasAutograph: false,
          hasRelic: false,
          isVintage: false,
          dominantColors: ['#ffffff', '#000000'],
          layout: 'standard'
        },
        analysisMethod: 'visual_parsed',
        confidence: 0.6
      };
    }
  } catch (error) {
    console.error('Visual analysis failed:', error);
    return {
      visualAnalysis: {
        condition: 'good',
        conditionScore: 70,
        hasHologram: false,
        hasAutograph: false,
        hasRelic: false,
        isVintage: false,
        dominantColors: ['#ffffff', '#000000'],
        layout: 'standard'
      },
      analysisMethod: 'visual_failed',
      confidence: 0.3
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, analysisType } = await req.json();
    
    console.log('🚀 Starting enhanced card analysis:', analysisType || 'unified');

    let result: AnalysisResult;

    if (analysisType === 'ocr') {
      const ocrResult = await performOCRAnalysis(imageData);
      result = {
        confidence: 0.5,
        analysisMethod: 'ocr',
        ...ocrResult
      } as AnalysisResult;
    } else if (analysisType === 'visual') {
      const visualResult = await performVisualAnalysis(imageData);
      result = {
        confidence: 0.6,
        analysisMethod: 'visual',
        ...visualResult
      } as AnalysisResult;
    } else {
      // Unified analysis - combine both methods
      console.log('🔄 Running unified analysis...');
      
      const [ocrResult, visualResult] = await Promise.all([
        performOCRAnalysis(imageData),
        performVisualAnalysis(imageData)
      ]);

      // Merge results with priority to visual analysis for descriptive fields
      // and OCR for text-based fields
      result = {
        playerName: ocrResult.playerName || visualResult.playerName,
        teamName: ocrResult.teamName || visualResult.teamName,
        year: ocrResult.year || visualResult.year,
        cardNumber: ocrResult.cardNumber,
        manufacturer: visualResult.manufacturer,
        extractedText: ocrResult.extractedText,
        estimatedValue: visualResult.estimatedValue || 0,
        visualAnalysis: visualResult.visualAnalysis,
        analysisMethod: 'unified',
        confidence: Math.max((ocrResult.confidence || 0), (visualResult.confidence || 0))
      };
    }

    console.log('✅ Enhanced analysis complete:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('❌ Enhanced analysis error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      confidence: 0,
      analysisMethod: 'failed'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
