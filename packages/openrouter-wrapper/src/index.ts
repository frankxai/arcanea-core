/**
 * @arcanea/openrouter - Professional OpenRouter Client
 * 
 * Enterprise-grade OpenRouter integration for AI orchestration.
 * Supports multiple LLM providers with unified interface.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface ArcaneaConfig {
  provider: 'openrouter' | 'anthropic' | 'openai'
  apiKey: string
  baseURL?: string
  model?: string
  timeout?: number
  maxRetries?: number
  telemetry?: boolean
  caching?: boolean
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'function'
  content: string
  name?: string
  function_call?: any
  metadata?: Record<string, any>
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stopSequences?: string[]
  stream?: boolean
  tools?: Tool[]
  toolChoice?: 'auto' | 'none' | { type: 'function', function: { name: string } }
}

export interface Tool {
  type: 'function'
  function: {
    name: string
    description?: string
    parameters?: Record<string, any>
  }
}

export interface ImageOptions {
  model?: string
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
  n?: number
}

export interface VisionOptions extends ChatOptions {
  detail?: 'low' | 'high' | 'auto'
}

export interface MultimodalInput {
  text?: string
  images?: string[] | Buffer[]
  audio?: string | Buffer
  documents?: Array<{ content: string; type: string }>
}

export interface CompletionResponse {
  id: string
  model: string
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost?: number
  }
  metadata?: Record<string, any>
}

export interface StreamResponse extends AsyncIterable<string> {
  id: string
  model: string
  abort: () => void
}

export class Arcanea {
  private client: AxiosInstance
  private config: ArcaneaConfig
  private cache: Map<string, { response: any; timestamp: number }> = new Map()
  private readonly CACHE_TTL = 300000 // 5 minutes

  constructor(config: ArcaneaConfig) {
    this.validateConfig(config)
    
    this.config = {
      baseURL: config.baseURL || this.getProviderURL(config.provider),
      model: config.model || this.getDefaultModel(config.provider),
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      telemetry: config.telemetry ?? true,
      caching: config.caching ?? true,
      ...config
    }

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: this.getProviderHeaders(config)
    })

    this.setupInterceptors()
  }

  private validateConfig(config: ArcaneaConfig): void {
    if (!config.provider) {
      throw new Error('Provider is required (openrouter, anthropic, or openai)')
    }
    if (!config.apiKey) {
      throw new Error('API key is required')
    }
  }

  private getProviderURL(provider: string): string {
    const urls: Record<string, string> = {
      openrouter: 'https://openrouter.ai/api/v1',
      anthropic: 'https://api.anthropic.com/v1',
      openai: 'https://api.openai.com/v1'
    }
    return urls[provider] || urls.openrouter
  }

  private getDefaultModel(provider: string): string {
    const models: Record<string, string> = {
      openrouter: 'anthropic/claude-3-5-sonnet',
      anthropic: 'claude-3-5-sonnet-20241022',
      openai: 'gpt-4-turbo-preview'
    }
    return models[provider] || models.openrouter
  }

  private getProviderHeaders(config: ArcaneaConfig): Record<string, string> {
    const baseHeaders = {
      'Content-Type': 'application/json',
    }

    switch (config.provider) {
      case 'openrouter':
        return {
          ...baseHeaders,
          'Authorization': `Bearer ${config.apiKey}`,
          'HTTP-Referer': 'https://arcanea.ai',
          'X-Title': 'Arcanea Platform'
        }
      case 'anthropic':
        return {
          ...baseHeaders,
          'X-API-Key': config.apiKey,
          'anthropic-version': '2023-06-01'
        }
      case 'openai':
        return {
          ...baseHeaders,
          'Authorization': `Bearer ${config.apiKey}`
        }
      default:
        return baseHeaders
    }
  }

  private setupInterceptors(): void {
    // Request interceptor for telemetry
    this.client.interceptors.request.use(
      (config) => {
        if (this.config.telemetry) {
          config.headers['X-Request-ID'] = this.generateRequestId()
          config.metadata = { startTime: Date.now() }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling and retries
    this.client.interceptors.response.use(
      (response) => {
        if (this.config.telemetry && response.config.metadata) {
          const duration = Date.now() - response.config.metadata.startTime
          this.logMetrics({ duration, status: response.status })
        }
        return response
      },
      async (error) => {
        const config = error.config
        
        if (!config || !config.retry) config.retry = 0
        
        if (config.retry < this.config.maxRetries! && this.shouldRetry(error)) {
          config.retry++
          const delay = this.calculateBackoff(config.retry)
          await this.delay(delay)
          return this.client.request(config)
        }
        
        throw this.enhanceError(error)
      }
    )
  }

  /**
   * Chat completion with support for conversation history
   */
  async chat(
    messages: ChatMessage[] | string,
    options: ChatOptions = {}
  ): Promise<CompletionResponse> {
    const formattedMessages = typeof messages === 'string' 
      ? [{ role: 'user' as const, content: messages }]
      : messages

    const cacheKey = this.getCacheKey(formattedMessages, options)
    
    if (this.config.caching) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    try {
      const endpoint = this.getChatEndpoint()
      const payload = this.buildChatPayload(formattedMessages, options)
      
      const response: AxiosResponse = await this.client.post(endpoint, payload)
      const result = this.parseChatResponse(response)
      
      if (this.config.caching) {
        this.addToCache(cacheKey, result)
      }
      
      return result
    } catch (error: any) {
      throw this.enhanceError(error)
    }
  }

  /**
   * Streaming chat completion
   */
  async *stream(
    messages: ChatMessage[] | string,
    options: ChatOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    const formattedMessages = typeof messages === 'string' 
      ? [{ role: 'user' as const, content: messages }]
      : messages

    const endpoint = this.getChatEndpoint()
    const payload = this.buildChatPayload(formattedMessages, { ...options, stream: true })
    
    try {
      const response = await this.client.post(endpoint, payload, {
        responseType: 'stream'
      })

      for await (const chunk of response.data) {
        const lines = chunk.toString().split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') return
            
            try {
              const parsed = JSON.parse(data)
              const content = this.extractStreamContent(parsed)
              if (content) yield content
            } catch (e) {
              // Skip invalid JSON chunks
            }
          }
        }
      }
    } catch (error: any) {
      throw this.enhanceError(error)
    }
  }

  /**
   * Generate images using DALL-E or similar models
   */
  async generateImage(
    prompt: string,
    options: ImageOptions = {}
  ): Promise<{ url: string; revised_prompt?: string }[]> {
    if (this.config.provider !== 'openai' && this.config.provider !== 'openrouter') {
      throw new Error('Image generation is only available with OpenAI or OpenRouter')
    }

    try {
      const response = await this.client.post('/images/generations', {
        prompt,
        model: options.model || 'dall-e-3',
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'vivid',
        n: options.n || 1
      })

      return response.data.data
    } catch (error: any) {
      throw this.enhanceError(error)
    }
  }

  /**
   * Process multimodal inputs (text, images, audio)
   */
  async processMultimodal(
    inputs: MultimodalInput,
    options: VisionOptions = {}
  ): Promise<CompletionResponse> {
    const messages: ChatMessage[] = []

    // Build multimodal message
    const content: any[] = []
    
    if (inputs.text) {
      content.push({ type: 'text', text: inputs.text })
    }
    
    if (inputs.images) {
      for (const image of inputs.images) {
        const imageData = typeof image === 'string' ? image : image.toString('base64')
        content.push({
          type: 'image_url',
          image_url: {
            url: imageData.startsWith('data:') ? imageData : `data:image/jpeg;base64,${imageData}`,
            detail: options.detail || 'auto'
          }
        })
      }
    }

    messages.push({ role: 'user', content: JSON.stringify(content) })

    return this.chat(messages, options)
  }

  /**
   * Get available models
   */
  async listModels(): Promise<any[]> {
    try {
      const response = await this.client.get('/models')
      return response.data.data || []
    } catch (error: any) {
      throw this.enhanceError(error)
    }
  }

  /**
   * Validate API key and get account info
   */
  async validateKey(): Promise<boolean> {
    try {
      if (this.config.provider === 'openrouter') {
        const response = await this.client.get('/auth/key')
        return !!response.data
      } else {
        // Try a minimal request to validate
        await this.listModels()
        return true
      }
    } catch (error) {
      return false
    }
  }

  // Helper methods
  private getChatEndpoint(): string {
    switch (this.config.provider) {
      case 'anthropic':
        return '/messages'
      case 'openai':
      case 'openrouter':
      default:
        return '/chat/completions'
    }
  }

  private buildChatPayload(messages: ChatMessage[], options: ChatOptions): any {
    const basePayload = {
      model: options.model || this.config.model,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxTokens,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stop: options.stopSequences,
      stream: options.stream || false,
      tools: options.tools,
      tool_choice: options.toolChoice
    }

    // Provider-specific adjustments
    if (this.config.provider === 'anthropic') {
      return this.convertToAnthropicFormat(basePayload)
    }

    return this.cleanPayload(basePayload)
  }

  private convertToAnthropicFormat(payload: any): any {
    // Convert to Anthropic's message format
    return {
      model: payload.model,
      messages: payload.messages.filter((m: ChatMessage) => m.role !== 'system'),
      system: payload.messages.find((m: ChatMessage) => m.role === 'system')?.content,
      max_tokens: payload.max_tokens || 4096,
      temperature: payload.temperature,
      top_p: payload.top_p,
      top_k: payload.top_k,
      stop_sequences: payload.stop,
      stream: payload.stream
    }
  }

  private parseChatResponse(response: AxiosResponse): CompletionResponse {
    if (this.config.provider === 'anthropic') {
      return {
        id: response.data.id,
        model: response.data.model,
        content: response.data.content[0]?.text || '',
        usage: response.data.usage ? {
          promptTokens: response.data.usage.input_tokens,
          completionTokens: response.data.usage.output_tokens,
          totalTokens: response.data.usage.input_tokens + response.data.usage.output_tokens
        } : undefined
      }
    }

    // OpenAI/OpenRouter format
    const choice = response.data.choices[0]
    return {
      id: response.data.id,
      model: response.data.model,
      content: choice?.message?.content || choice?.text || '',
      usage: response.data.usage ? {
        promptTokens: response.data.usage.prompt_tokens,
        completionTokens: response.data.usage.completion_tokens,
        totalTokens: response.data.usage.total_tokens,
        cost: response.data.usage.cost
      } : undefined
    }
  }

  private extractStreamContent(data: any): string | null {
    if (this.config.provider === 'anthropic') {
      return data.delta?.text || null
    }
    return data.choices?.[0]?.delta?.content || null
  }

  private cleanPayload(payload: any): any {
    return Object.entries(payload).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value
      }
      return acc
    }, {} as any)
  }

  private shouldRetry(error: any): boolean {
    if (!error.response) return true // Network errors
    const status = error.response.status
    return status >= 500 || status === 429 // Server errors or rate limits
  }

  private calculateBackoff(attempt: number): number {
    return Math.min(Math.pow(2, attempt) * 1000, 30000)
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getCacheKey(messages: ChatMessage[], options: ChatOptions): string {
    return JSON.stringify({ messages, options })
  }

  private getFromCache(key: string): CompletionResponse | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.response
    }
    this.cache.delete(key)
    return null
  }

  private addToCache(key: string, response: CompletionResponse): void {
    this.cache.set(key, { response, timestamp: Date.now() })
    
    // Clean old cache entries
    if (this.cache.size > 100) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
  }

  private logMetrics(metrics: any): void {
    // In production, send to telemetry service
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Arcanea Metrics]', metrics)
    }
  }

  private enhanceError(error: any): Error {
    if (error.response?.data?.error) {
      const apiError = error.response.data.error
      return new Error(
        `[${this.config.provider}] ${apiError.message || apiError.type || 'API Error'}`,
        { cause: error }
      )
    }
    return new Error(
      `[${this.config.provider}] ${error.message || 'Unknown error'}`,
      { cause: error }
    )
  }
}

// Convenience exports
export default Arcanea
export const createClient = (config: ArcaneaConfig) => new Arcanea(config)