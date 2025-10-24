export default {
    async fetch(request, env) {
      const url = new URL(request.url);
  
      // Only handle POST /api/chat
      if (url.pathname === '/api/chat' && request.method === 'POST') {
        try {
          const { prompt, model } = await request.json();
  
          if (!prompt) {
            return new Response(JSON.stringify({ error: 'No prompt provided' }), {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            });
          }
  
          const modelId = model || '@cf/meta/llama-3.1-8b-instruct';
          console.log('Using model:', modelId);
  
          //schema: use { prompt: "..." }
          const aiResponse = await env.AI.run(modelId, 
            { prompt },
            {gateway: {
          id: "wrapper-models" 
                },
            });
  
          // Cloudflare’s AI bindings return { response: "text" }
          const reply = aiResponse?.response?.trim() || '(empty response)';
  
          return new Response(JSON.stringify({ response: reply }), {
            headers: { 'Content-Type': 'application/json' },
          });
  
        } catch (error) {
          console.error('AI Request Error:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }
  
      // Serve HTML on GET
      return new Response(HTML, {
        headers: { 'Content-Type': 'text/html' },
      });
    },
  };
  
