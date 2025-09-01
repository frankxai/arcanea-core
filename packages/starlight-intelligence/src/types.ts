export type ModelProvider = 'ollama' | 'llamacpp' | 'openai' | 'anthropic' | 'openrouter';

export interface ModelInfo {
  name: string;
  provider: ModelProvider;
  size: string;
  loaded: boolean;
  status: 'idle' | 'busy' | 'error';
  lastUsed?: Date;
  responseTime?: number;
}

export interface ProviderConfig {
  enabled: boolean;
  baseUrl?: string;
  apiKey?: string;
  models: string[];
  maxConcurrency?: number;
  timeout?: number;
}

export interface StarlightConfig {
  server: {
    port: number;
    host: string;
  };
  providers: Record<ModelProvider, ProviderConfig>;
  loadBalancing: {
    strategy: 'round-robin' | 'least-loaded' | 'fastest-response';
    healthCheck: {
      interval: number;
      timeout: number;
      retries: number;
    };
  };
  autoDiscovery: boolean;
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    file?: string;
  };
}

export interface GenerationRequest {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  systemPrompt?: string;
}

export interface GenerationResponse {
  text: string;
  model: string;
  provider: ModelProvider;
  responseTime: number;
  tokensGenerated?: number;
  finishReason?: string;
}

export interface SystemStatus {
  healthy: boolean;
  uptime: number;
  activeModels: ModelInfo[];
  totalRequests: number;
  averageResponseTime: number;
  providers: Record<string, {
    healthy: boolean;
    models: ModelInfo[];
    responseTime: number;
  }>;
}

export interface ProviderInterface {
  initialize(): Promise<void>;
  generateResponse(request: GenerationRequest): Promise<GenerationResponse>;
  getAvailableModels(): Promise<ModelInfo[]>;
  pullModel(modelName: string): Promise<void>;
  removeModel(modelName: string): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface LoadBalancerStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  providerStats: Record<ModelProvider, {
    requests: number;
    responseTime: number;
    errorRate: number;
  }>;
}