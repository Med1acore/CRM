// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

// Types for request and response
interface SermonRequest {
  sermonText: string;
  roles: string[];
}

interface RoleAnalysis {
  role: string;
  feedback: string;
  improvements: string;
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle preflight requests
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

// Create error response
function createErrorResponse(message: string, status: number): Response {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    }
  );
}

// Create success response
function createSuccessResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    { 
      status: 200,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    }
  );
}

// Validate request body
function validateRequest(body: any): SermonRequest | null {
  if (!body || typeof body !== 'object') {
    return null;
  }
  
  if (!body.sermonText || typeof body.sermonText !== 'string') {
    return null;
  }
  
  if (!body.roles || !Array.isArray(body.roles) || body.roles.length === 0) {
    return null;
  }
  
  if (!body.roles.every((role: any) => typeof role === 'string')) {
    return null;
  }
  
  return body as SermonRequest;
}

// Call Google AI API (Gemini)
async function callGoogleAI(sermonText: string, roles: string[]): Promise<RoleAnalysis[]> {
  const apiKey = Deno.env.get('GOOGLE_AI_API_KEY');
  
  if (!apiKey) {
    throw new Error('Google AI API key not found in environment variables');
  }

  // Create the prompt with role-specific instructions
  const roleInstructions = {
  'Теолог-догматист': 'Твоя задача — проверить богословскую точность. Соответствует ли проповедь догматам, библейским истинам и историческому христианскому учению? Найди любые утверждения, которые могут быть неточными, двусмысленными или еретическими. Ссылайся на конкретные места Писания или богословские концепции (например, агапэ, кенозис, Троица).',

  'Практический психолог-консультант': 'Оцени психологическое воздействие на слушателя. Как эти слова повлияют на человека с тревогой, депрессией или выгоранием? Не вызывает ли проповедь ложного чувства вины (guilt-tripping)? Дай практические советы, как сделать проповедь более поддерживающей, эмпатичной и применимой в реальной жизни. Предложи психологически здоровые формулировки.',

  'Критик-секулярист (Адвокат дьявола)': 'Твоя роль — быть безжалостным интеллектуальным оппонентом. Представь, что ты — эрудированный атеист или агностик, который слушает эту проповедь на дебатах. Твоя задача — разнести ее в пух и прах. Атакуй каждое слабое место: \
• **Логические дыры:** Находи любые логические ошибки, non sequitur, апелляции к эмоциям вместо фактов. \
• **Бездоказательные утверждения:** Подвергай сомнению каждое заявление, которое подается как факт, но не имеет доказательств за пределами Библии. Используй фразы вроде "На чем основано это утверждение?", "Какие есть эмпирические данные?". \
• **"Розовые очки":** Высмеивай наивный идеализм. Если говорится "любовь спасет мир", противопоставь этому реальные системные проблемы: экономическое неравенство, политические конфликты, человеческую психологию. \
• **Устаревшие концепции:** Указывай на идеи, которые кажутся архаичными или несовместимыми с современной наукой, этикой или правами человека (например, вопросы гендера, научного мировоззрения). \
• **Манипуляции:** Ищи любые попытки эмоционального давления, запугивания ("ад") или обещания "награды на небесах" как способа управления поведением. \
Твой фидбэк должен быть едким, но умным. Твоя цель — не оскорбить, а вскрыть все слабости аргументации, чтобы автор был готов к встрече с самым серьезным критиком в реальной жизни.',

  'Философ': 'Анализируй логическую структуру, философские основания и методологию рассуждений. Есть ли в проповеди логические ошибки (fallacies)? На какие философские идеи (сознательно или нет) опирается автор (например, этика Канта, экзистенциализм Кьеркегора)? Подними сложные этические дилеммы, которые проповедь игнорирует (любовь vs справедливость). Предложи, как укрепить аргументацию.',
  
  'Богослов': 'Оценивай богословскую глубину. Выходит ли проповедь за рамки базовых истин? Связана ли она с более широким контекстом — историей церкви, различными богословскими течениями, эсхатологией? Предложи, как можно углубить тему, связав ее с центральными доктринами христианства, чтобы она была интересна и для духовно зрелых верующих.',

  'Историк': 'Проверяй исторический контекст. Если в проповеди есть отсылки к историческим событиям, личностям или библейскому фону, насколько они точны? Не является ли интерпретация событий анахронизмом? Предложи, как можно обогатить проповедь точными историческими деталями, чтобы сделать ее более живой и достоверной.',

  'Пастор': 'Оценивай проповедь с точки зрения пастырской заботы. Направлена ли она на реальные нужды общины? Содержит ли она практическую мудрость и утешение? Является ли призыв к действию ясным и выполнимым для обычного прихожанина? Предложи, как сделать проповедь более теплой, личной и ориентированной на духовный рост паствы.',
  
  'Прихожанин': 'Анализируй с точки зрения обычного верующего, сидящего в зале. Понятна ли главная мысль? Не слишком ли она абстрактна или, наоборот, слишком проста? Вдохновляет ли она? Легко ли ее запомнить и пересказать? Что я унесу с собой после этой проповеди на неделю вперед? Укажи на моменты, которые могут быть скучными или непонятными.'
  };

  const rolesText = roles.map(role => {
    const instruction = roleInstructions[role] || 'анализирует с профессиональной точки зрения';
    return `- ${role}: ${instruction}`;
  }).join('\n');

  const prompt = `Ты — консилиум экспертов, анализирующих текст христианской проповеди. Твоя задача — дать обратную связь от лица нескольких ролей, чтобы помочь автору улучшить текст.

Вот текст проповеди для анализа:
"${sermonText}"

Проанализируй этот текст с точки зрения следующих ролей:
${rolesText}

Для каждой роли предоставь четкий ответ в двух частях: 
1. Фидбэк: Оцени сильные и слабые стороны с точки зрения этой конкретной роли
2. Улучшения: Дай конкретные, практические предложения по улучшению

Отформатируй свой ответ в виде валидного JSON-массива, где каждый объект представляет одну роль и имеет поля "role", "feedback", и "improvements".`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4000,
        topP: 0.8,
        topK: 10
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Google AI API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    throw new Error('Invalid response from Google AI API');
  }

  const content = data.candidates[0].content.parts[0].text;
  
  try {
    // Try to parse the JSON response
    const parsed = JSON.parse(content);
    
    // Validate the structure
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }
    
    // Validate each role analysis
    for (const item of parsed) {
      if (!item.role || !item.feedback || !item.improvements) {
        throw new Error('Invalid role analysis structure');
      }
    }
    
    return parsed as RoleAnalysis[];
  } catch (parseError) {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as RoleAnalysis[];
      } catch (e) {
        throw new Error('Failed to parse JSON from Google AI response');
      }
    }
    throw new Error('No valid JSON found in Google AI response');
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) {
    return corsResponse;
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return createErrorResponse('Method not allowed. Use POST.', 405);
    }

    // Simplified user identification for testing
    // In production, you'd properly verify JWT tokens
    const authHeader = req.headers.get('Authorization');
    const userId = authHeader ? 'user_' + Math.random().toString(36).substr(2, 9) : 'anonymous_user';

    // Check usage limit (3 per month) - simplified for testing
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const usageKey = `usage_${userId}_${currentMonth}`;
    
    // For testing, we'll use a simple approach
    // In production, store this in a database
    const usageCount = 0; // Reset for testing - in production: parseInt(Deno.env.get(usageKey) || '0');
    
    if (usageCount >= 3) {
      return createErrorResponse('Превышен лимит использования: 3 анализа в месяц. Попробуйте в следующем месяце.', 429);
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return createErrorResponse('Invalid JSON in request body', 400);
    }

    // Validate request
    const validatedRequest = validateRequest(body);
    if (!validatedRequest) {
      return createErrorResponse(
        'Invalid request. Expected: { "sermonText": "string", "roles": ["string", ...] }', 
        400
      );
    }

    // Check if sermon text is not empty
    if (validatedRequest.sermonText.trim().length === 0) {
      return createErrorResponse('Sermon text cannot be empty', 400);
    }

    // Check if roles array is not empty
    if (validatedRequest.roles.length === 0) {
      return createErrorResponse('At least one role must be provided', 400);
    }

    // Call Google AI API
    const analysis = await callGoogleAI(validatedRequest.sermonText, validatedRequest.roles);
    
    // Update usage count (in production, store this in database)
    const newUsageCount = usageCount + 1;
    // Note: In production, you'd update this in a database table
    // For now, this is just a placeholder to show the concept
    
    // Return the analysis with usage info
    return createSuccessResponse({
      analysis,
      usage: {
        current: newUsageCount,
        limit: 3,
        month: currentMonth
      }
    });

  } catch (error) {
    console.error('Error in improve-sermon function:', error);
    
    // Handle specific error types
    if (error.message.includes('Google AI API key not found')) {
      return createErrorResponse('Google AI API key not configured', 500);
    }
    
    if (error.message.includes('Google AI API error')) {
      return createErrorResponse('Google AI API error: ' + error.message, 502);
    }
    
    if (error.message.includes('Failed to parse JSON')) {
      return createErrorResponse('Failed to parse Google AI response', 502);
    }
    
    // Generic error
    return createErrorResponse('Internal server error', 500);
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Set your Google AI API key: `supabase secrets set GOOGLE_AI_API_KEY=your_key_here`
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/improve-sermon' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{
      "sermonText": "Сегодня мы поговорим о важности веры в нашей жизни...",
      "roles": ["Богослов", "Пастор", "Прихожанин"]
    }'

*/
