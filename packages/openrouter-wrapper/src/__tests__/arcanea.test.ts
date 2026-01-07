/**
 * Arcanea Core Tests
 * Comprehensive test suite for the Arcanea platform
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import { Arcanea, ArcaneaConfig, ChatMessage } from '../index'

// Mock axios
vi.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Arcanea Core', () => {
  let arcanea: Arcanea
  let mockClient: any

  beforeEach(() => {
    // Setup mock axios instance
    mockClient = {
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    }

    mockedAxios.create = vi.fn(() => mockClient)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with OpenRouter provider', () => {
      const config: ArcaneaConfig = {
        provider: 'openrouter',
        apiKey: 'test-key'
      }

      arcanea = new Arcanea(config)
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://openrouter.ai/api/v1',
          timeout: 30000,
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-key'
          })
        })
      )
    })

    it('should initialize with Anthropic provider', () => {
      const config: ArcaneaConfig = {
        provider: 'anthropic',
        apiKey: 'test-key'
      }

      arcanea = new Arcanea(config)
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.anthropic.com/v1',
          headers: expect.objectContaining({
            'X-API-Key': 'test-key'
          })
        })
      )
    })

    it('should throw error if provider is missing', () => {
      expect(() => new Arcanea({} as ArcaneaConfig)).toThrow('Provider is required')
    })

    it('should throw error if API key is missing', () => {
      expect(() => new Arcanea({ provider: 'openrouter' } as ArcaneaConfig)).toThrow('API key is required')
    })

    it('should use custom config values', () => {
      const config: ArcaneaConfig = {
        provider: 'openrouter',
        apiKey: 'test-key',
        baseURL: 'https://custom.api.com',
        model: 'custom-model',
        timeout: 60000,
        maxRetries: 5,
        caching: false,
        telemetry: false
      }

      arcanea = new Arcanea(config)
      
      expect(mockedAxios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom.api.com',
          timeout: 60000
        })
      )
    })
  })

  describe('Chat Completions', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openrouter',
        apiKey: 'test-key'
      })
    })

    it('should handle simple string message', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'test-model',
          choices: [{
            message: { content: 'Hello, world!' }
          }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 5,
            total_tokens: 15
          }
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const response = await arcanea.chat('Hello')
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/chat/completions',
        expect.objectContaining({
          model: 'anthropic/claude-3-5-sonnet',
          messages: [{ role: 'user', content: 'Hello' }]
        })
      )
      
      expect(response).toEqual({
        id: 'test-id',
        model: 'test-model',
        content: 'Hello, world!',
        usage: {
          promptTokens: 10,
          completionTokens: 5,
          totalTokens: 15
        }
      })
    })

    it('should handle message array', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are helpful' },
        { role: 'user', content: 'Hello' }
      ]

      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'test-model',
          choices: [{
            message: { content: 'Hi there!' }
          }]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const response = await arcanea.chat(messages)
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/chat/completions',
        expect.objectContaining({
          messages
        })
      )
      
      expect(response.content).toBe('Hi there!')
    })

    it('should handle chat options', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'gpt-4',
          choices: [{
            message: { content: 'Response' }
          }]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      await arcanea.chat('Test', {
        temperature: 0.5,
        maxTokens: 1000,
        model: 'gpt-4'
      })
      
      expect(mockClient.post).toHaveBeenCalledWith(
        '/chat/completions',
        expect.objectContaining({
          model: 'gpt-4',
          temperature: 0.5,
          max_tokens: 1000
        })
      )
    })

    it('should use cache for identical requests', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'test-model',
          choices: [{
            message: { content: 'Cached response' }
          }]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      // First call
      await arcanea.chat('Hello')
      expect(mockClient.post).toHaveBeenCalledTimes(1)

      // Second call should use cache
      const cachedResponse = await arcanea.chat('Hello')
      expect(mockClient.post).toHaveBeenCalledTimes(1)
      expect(cachedResponse.content).toBe('Cached response')
    })

    it('should handle API errors gracefully', async () => {
      mockClient.post.mockRejectedValue({
        response: {
          data: {
            error: {
              message: 'Rate limit exceeded'
            }
          }
        }
      })

      await expect(arcanea.chat('Test')).rejects.toThrow('[openrouter] Rate limit exceeded')
    })
  })

  describe('Streaming', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openrouter',
        apiKey: 'test-key'
      })
    })

    it('should handle streaming responses', async () => {
      const mockStream = {
        data: {
          [Symbol.asyncIterator]: async function* () {
            yield Buffer.from('data: {"choices":[{"delta":{"content":"Hello"}}]}\n')
            yield Buffer.from('data: {"choices":[{"delta":{"content":" world"}}]}\n')
            yield Buffer.from('data: [DONE]\n')
          }
        }
      }

      mockClient.post.mockResolvedValue(mockStream)

      const chunks: string[] = []
      const stream = arcanea.stream('Test')
      
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      expect(chunks).toEqual(['Hello', ' world'])
      expect(mockClient.post).toHaveBeenCalledWith(
        '/chat/completions',
        expect.objectContaining({
          stream: true
        }),
        expect.objectContaining({
          responseType: 'stream'
        })
      )
    })
  })

  describe('Multimodal Processing', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openrouter',
        apiKey: 'test-key'
      })
    })

    it('should process text and images', async () => {
      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'test-model',
          choices: [{
            message: { content: 'I see a cat' }
          }]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const response = await arcanea.processMultimodal({
        text: 'What is this?',
        images: ['data:image/jpeg;base64,abc123']
      })

      expect(mockClient.post).toHaveBeenCalledWith(
        '/chat/completions',
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user'
            })
          ])
        })
      )

      expect(response.content).toBe('I see a cat')
    })

    it('should handle Buffer images', async () => {
      const imageBuffer = Buffer.from('test-image-data')
      const mockResponse = {
        data: {
          id: 'test-id',
          model: 'test-model',
          choices: [{
            message: { content: 'Image processed' }
          }]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      await arcanea.processMultimodal({
        text: 'Analyze',
        images: [imageBuffer]
      })

      expect(mockClient.post).toHaveBeenCalled()
    })
  })

  describe('Image Generation', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openai',
        apiKey: 'test-key'
      })
    })

    it('should generate images', async () => {
      const mockResponse = {
        data: {
          data: [
            { url: 'https://example.com/image1.jpg' },
            { url: 'https://example.com/image2.jpg' }
          ]
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const images = await arcanea.generateImage('A beautiful sunset', {
        size: '1024x1024',
        n: 2
      })

      expect(mockClient.post).toHaveBeenCalledWith(
        '/images/generations',
        expect.objectContaining({
          prompt: 'A beautiful sunset',
          size: '1024x1024',
          n: 2
        })
      )

      expect(images).toHaveLength(2)
      expect(images[0].url).toBe('https://example.com/image1.jpg')
    })

    it('should throw error for unsupported providers', async () => {
      const anthropicClient = new Arcanea({
        provider: 'anthropic',
        apiKey: 'test-key'
      })

      await expect(
        anthropicClient.generateImage('Test')
      ).rejects.toThrow('Image generation is only available with OpenAI or OpenRouter')
    })
  })

  describe('Model Management', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openrouter',
        apiKey: 'test-key'
      })
    })

    it('should list available models', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 'model-1', name: 'Model 1' },
            { id: 'model-2', name: 'Model 2' }
          ]
        }
      }

      mockClient.get.mockResolvedValue(mockResponse)

      const models = await arcanea.listModels()

      expect(mockClient.get).toHaveBeenCalledWith('/models')
      expect(models).toHaveLength(2)
      expect(models[0].id).toBe('model-1')
    })

    it('should validate API key', async () => {
      mockClient.get.mockResolvedValue({ data: { valid: true } })

      const isValid = await arcanea.validateKey()

      expect(mockClient.get).toHaveBeenCalledWith('/auth/key')
      expect(isValid).toBe(true)
    })

    it('should handle invalid API key', async () => {
      mockClient.get.mockRejectedValue(new Error('Unauthorized'))

      const isValid = await arcanea.validateKey()

      expect(isValid).toBe(false)
    })
  })

  describe('Error Handling & Retries', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'openrouter',
        apiKey: 'test-key',
        maxRetries: 2
      })
    })

    it('should retry on server errors', async () => {
      let attempts = 0
      mockClient.post.mockImplementation(() => {
        attempts++
        if (attempts < 3) {
          return Promise.reject({
            response: { status: 500 },
            config: { retry: attempts - 1 }
          })
        }
        return Promise.resolve({
          data: {
            id: 'success',
            model: 'test',
            choices: [{ message: { content: 'Success after retries' } }]
          }
        })
      })

      // Mock the interceptor to handle retries
      mockClient.interceptors.response.use.mockImplementation((onSuccess, onError) => {
        mockClient.request = vi.fn().mockResolvedValue({
          data: {
            id: 'success',
            model: 'test',
            choices: [{ message: { content: 'Success after retries' } }]
          }
        })
        return { onSuccess, onError }
      })

      const response = await arcanea.chat('Test')
      
      expect(response.content).toBe('Success after retries')
    })

    it('should not retry on client errors', async () => {
      mockClient.post.mockRejectedValue({
        response: { 
          status: 400,
          data: { error: { message: 'Bad request' } }
        }
      })

      await expect(arcanea.chat('Test')).rejects.toThrow('[openrouter] Bad request')
      expect(mockClient.post).toHaveBeenCalledTimes(1)
    })
  })

  describe('Anthropic Provider', () => {
    beforeEach(() => {
      arcanea = new Arcanea({
        provider: 'anthropic',
        apiKey: 'test-key'
      })
    })

    it('should format messages for Anthropic', async () => {
      const messages: ChatMessage[] = [
        { role: 'system', content: 'You are helpful' },
        { role: 'user', content: 'Hello' }
      ]

      const mockResponse = {
        data: {
          id: 'msg-123',
          model: 'claude-3',
          content: [{ text: 'Hi there!' }],
          usage: {
            input_tokens: 10,
            output_tokens: 5
          }
        }
      }

      mockClient.post.mockResolvedValue(mockResponse)

      const response = await arcanea.chat(messages)

      expect(mockClient.post).toHaveBeenCalledWith(
        '/messages',
        expect.objectContaining({
          system: 'You are helpful',
          messages: [{ role: 'user', content: 'Hello' }]
        })
      )

      expect(response.content).toBe('Hi there!')
      expect(response.usage).toEqual({
        promptTokens: 10,
        completionTokens: 5,
        totalTokens: 15
      })
    })
  })
})