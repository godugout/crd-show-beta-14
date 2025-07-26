import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, cardData } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'Image URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const analysisPrompt = `
Analyze this image for card creation and provide a detailed analysis in the following JSON format:

{
  "colorPalette": {
    "dominant": ["#color1", "#color2", "#color3"],
    "temperature": "warm" | "cool" | "neutral",
    "saturation": "high" | "medium" | "low"
  },
  "subject": {
    "category": "sports" | "gaming" | "art" | "portrait" | "landscape" | "abstract" | "other",
    "confidence": 0.0-1.0
  },
  "era": {
    "period": "vintage" | "retro" | "modern" | "futuristic",
    "confidence": 0.0-1.0
  },
  "mood": {
    "primary": "energetic" | "calm" | "dramatic" | "mysterious" | "elegant",
    "intensity": 0.0-1.0
  },
  "quality": {
    "resolution": "low" | "medium" | "high",
    "clarity": 0.0-1.0,
    "composition": 0.0-1.0
  }
}

Consider these factors:
- Color temperature: warm colors (reds, oranges, yellows) vs cool colors (blues, greens, purples)
- Subject matter: what is the main focus of the image?
- Era/time period: does it look vintage, modern, or futuristic?
- Emotional mood: what feeling does the image convey?
- Technical quality: image sharpness, composition, and overall quality

Be precise and analytical. Return only valid JSON.
`;

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
            content: 'You are an expert image analyst specializing in visual content analysis for creative applications. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: analysisPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const analysisContent = data.choices[0].message.content;

    try {
      // Parse the JSON response from GPT
      const analysis = JSON.parse(analysisContent);
      
      // Validate the analysis structure
      if (!analysis.colorPalette || !analysis.subject || !analysis.era || !analysis.mood || !analysis.quality) {
        throw new Error('Invalid analysis structure');
      }

      return new Response(
        JSON.stringify({ analysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', analysisContent);
      
      // Fallback analysis if AI response is invalid
      const fallbackAnalysis = {
        colorPalette: {
          dominant: ['#808080', '#404040', '#C0C0C0'],
          temperature: 'neutral',
          saturation: 'medium'
        },
        subject: {
          category: 'other',
          confidence: 0.5
        },
        era: {
          period: 'modern',
          confidence: 0.5
        },
        mood: {
          primary: 'calm',
          intensity: 0.5
        },
        quality: {
          resolution: 'medium',
          clarity: 0.5,
          composition: 0.5
        }
      };

      return new Response(
        JSON.stringify({ analysis: fallbackAnalysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-card-content function:', error);
    return new Response(
      JSON.stringify({ error: 'Analysis failed', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});