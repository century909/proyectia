const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face Inference with API key if available
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// Fallback responses for when AI is not available
const generateFallbackResponse = (character, userMessage) => {
  const { name, personality, description } = character;
  const personalityTraits = personality ? personality.toLowerCase().split(',').map(t => t.trim()) : [];
  
  // Base responses based on personality traits
  let responseTemplates = [];
  
  if (personalityTraits.includes('sarcastic') || personalityTraits.includes('sarcástico')) {
    responseTemplates = [
      `Oh, ${userMessage}? How original. *rolls eyes*`,
      `Well, well, well... ${userMessage}. How... predictable.`,
      `*sighs dramatically* ${userMessage}? Really? That's what you're going with?`,
      `Oh please, ${userMessage}? I've heard that one before. Try harder.`
    ];
  } else if (personalityTraits.includes('friendly') || personalityTraits.includes('amigable')) {
    responseTemplates = [
      `That's so interesting! ${userMessage} - I love hearing about that!`,
      `Oh wow, ${userMessage}! Tell me more about that!`,
      `That sounds amazing! ${userMessage} - I'm so happy you shared that with me!`,
      `I'm so glad you told me about ${userMessage}! That's wonderful!`
    ];
  } else if (personalityTraits.includes('mysterious') || personalityTraits.includes('misterioso')) {
    responseTemplates = [
      `*whispers* ${userMessage}... interesting. Very interesting indeed.`,
      `Hmm... ${userMessage}. There's more to this than meets the eye.`,
      `*smirks* ${userMessage}? You don't know what you're getting into.`,
      `The shadows whisper of ${userMessage}... but do you really want to know?`
    ];
  } else if (personalityTraits.includes('wise') || personalityTraits.includes('sabio')) {
    responseTemplates = [
      `Ah, ${userMessage}. A wise observation indeed.`,
      `In my many years, I've learned that ${userMessage} holds deeper meaning.`,
      `*nods thoughtfully* ${userMessage}... yes, there is wisdom in your words.`,
      `The ancient texts speak of ${userMessage}. Let me share what I know.`
    ];
  } else {
    // Default responses - more natural and engaging
    responseTemplates = [
      `¡Hola! Me alegra que me hables sobre ${userMessage}. ¿Podrías contarme más detalles?`,
      `Interesante... ${userMessage}. Me gustaría saber tu opinión al respecto.`,
      `Ah, ${userMessage}. Eso me hace pensar en muchas cosas. ¿Qué más tienes en mente?`,
      `Entiendo perfectamente. ${userMessage} es un tema fascinante. ¿Cómo llegaste a esa conclusión?`,
      `Wow, ${userMessage}. Nunca había pensado en eso de esa manera. ¿Podrías explicarme más?`,
      `Me encanta que me cuentes sobre ${userMessage}. Es muy interesante tu perspectiva.`
    ];
  }
  
  return responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
};

// Generate AI response using Hugging Face
const generateAIResponse = async (character, userMessage, conversationHistory = []) => {
  try {
    if (!process.env.HUGGINGFACE_API_KEY) {
      return generateFallbackResponse(character, userMessage);
    }
    
    const { name, personality, description } = character;
    
    // Simple prompt for better compatibility
    const prompt = `You are ${name}. ${description || 'A friendly character'}. 
User says: "${userMessage}"
${name} responds:`;

    // Use Hugging Face Inference API with a simple model
    const response = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 30,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      }
    });

    // Extract the response text
    let aiResponse = response.generated_text;
    
    // Clean up the response
    if (aiResponse && aiResponse.trim().length > 0) {
      // Remove the prompt from the response
      aiResponse = aiResponse.replace(prompt, '').trim();
      
      // Clean up any unwanted characters
      aiResponse = aiResponse.replace(/^[^a-zA-ZáéíóúÁÉÍÓÚñÑ]*/, '').trim();
      
      // Ensure response is reasonable length
      if (aiResponse.length > 0 && aiResponse.length < 200) {
        return aiResponse;
      }
    }
    
    return generateFallbackResponse(character, userMessage);
    
  } catch (error) {
    console.error('AI Service Error:', error.message);
    // Fallback to simulated response if AI fails
    return generateFallbackResponse(character, userMessage);
  }
};

// Alternative AI service using a different free model
const generateAIResponseAlternative = async (character, userMessage) => {
  try {
    const { name, personality, description } = character;
    
    // Use a different free model
    const response = await hf.textGeneration({
      model: 'gpt2', // Free GPT-2 model
      inputs: `Character: ${name}\nPersonality: ${personality}\nUser says: ${userMessage}\n${name} responds:`,
      parameters: {
        max_new_tokens: 50,
        temperature: 0.8,
        do_sample: true,
        return_full_text: false
      }
    });

    let aiResponse = response.generated_text;
    
    if (aiResponse && aiResponse.length > 0 && aiResponse.length < 300) {
      return aiResponse.trim();
    }
    
    return generateFallbackResponse(character, userMessage);
    
  } catch (error) {
    console.error('Alternative AI Service Error:', error);
    return generateFallbackResponse(character, userMessage);
  }
};

module.exports = {
  generateAIResponse,
  generateAIResponseAlternative,
  generateFallbackResponse
};
