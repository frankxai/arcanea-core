/**
 * Arcanea Quickstart Example
 * Get started in under 30 seconds
 */

import { Arcanea } from '@arcanea/openrouter'

// Initialize with OpenRouter (recommended)
const arcanea = new Arcanea({
  provider: 'openrouter',
  apiKey: process.env.OPENROUTER_API_KEY!,
  model: 'anthropic/claude-3-5-sonnet' // Optional, this is the default
})

async function main() {
  // Simple chat completion
  const response = await arcanea.chat('What is the capital of France?')
  console.log(response.content) // "Paris"

  // Chat with conversation history
  const conversation = await arcanea.chat([
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'user', content: 'Tell me about TypeScript' }
  ])
  console.log(conversation.content)

  // Stream responses for real-time output
  const stream = arcanea.stream('Write a haiku about coding')
  for await (const chunk of stream) {
    process.stdout.write(chunk)
  }

  // Process images with vision models
  const analysis = await arcanea.processMultimodal({
    text: 'What do you see in this image?',
    images: ['path/to/image.jpg']
  })
  console.log(analysis.content)

  // Generate images (requires OpenAI or OpenRouter)
  const images = await arcanea.generateImage(
    'A futuristic city with flying cars',
    { size: '1024x1024', quality: 'hd' }
  )
  console.log(images[0].url)
}

// Error handling
main().catch(error => {
  console.error('Error:', error.message)
  process.exit(1)
})