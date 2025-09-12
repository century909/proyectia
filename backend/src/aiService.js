const { HfInference } = require('@huggingface/inference');

// Initialize Hugging Face Inference
const hf = new HfInference();

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
    // Default responses
    responseTemplates = [
      `That's interesting! ${userMessage} - tell me more about that.`,
      `I see... ${userMessage}. What do you think about that?`,
      `Hmm, ${userMessage}. That's something to think about.`,
      `I understand. ${userMessage} - that's quite fascinating.`
    ];
  }
  
  return responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
};

// Generate AI response using Hugging Face
const generateAIResponse = async (character, userMessage, conversationHistory = []) => {
  try {
    const { name, personality, description } = character;
    
    // Create a system prompt based on character personality
    const systemPrompt = `You are ${name}, a character with the following traits:
    
Description: ${description || 'A unique individual'}
Personality: ${personality || 'Friendly and helpful'}

You should respond in character, staying true to your personality. Keep responses conversational and engaging, but not too long (1-3 sentences).`;

    // Build conversation context
    let conversationContext = conversationHistory
      .slice(-5) // Last 5 messages for context
      .map(msg => `${msg.sender_type === 'user' ? 'User' : name}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${conversationContext}\n\nUser: ${userMessage}\n${name}:`;

    // Use Hugging Face Inference API with a free model
    const response = await hf.textGeneration({
      model: 'microsoft/DialoGPT-medium', // Free model for chat
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
        do_sample: true,
        return_full_text: false
      }
    });

    // Extract the response text
    let aiResponse = response.generated_text;
    
    // Clean up the response
    if (aiResponse) {
      // Remove any remaining prompt text
      aiResponse = aiResponse.replace(fullPrompt, '').trim();
      
      // Remove any duplicate character names
      aiResponse = aiResponse.replace(new RegExp(`^${name}:\\s*`, 'i'), '').trim();
      
      // Ensure response is not empty and not too long
      if (aiResponse.length > 0 && aiResponse.length < 500) {
        return aiResponse;
      }
    }
    
    // If AI response is invalid, use fallback
    return generateFallbackResponse(character, userMessage);
    
  } catch (error) {
    console.error('AI Service Error:', error);
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
