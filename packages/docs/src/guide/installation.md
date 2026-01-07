# Installation Guide

Get ARCANEA running on your system and start manifesting multiverses in minutes.

## System Requirements

### Minimum Requirements
- **Node.js** 18.0+ 
- **RAM** 4GB+ (8GB+ recommended)
- **Storage** 2GB+ free space
- **OS** Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Recommended for Optimal Performance
- **Node.js** 20.0+
- **RAM** 16GB+ (for complex realm manifestations)
- **Storage** 10GB+ free space (for assets and templates)
- **CPU** 8+ cores (for parallel Guardian processing)
- **GPU** Optional, for enhanced AI Guardian performance

## Quick Installation

### Using NPM (Recommended)

```bash
# Install ARCANEA CLI globally
npm install -g @arcanea/cli

# Verify installation
arcanea --version
# Expected output: @arcanea/cli version 1.0.0

# Check system compatibility
arcanea doctor
# Runs system diagnostics and reports any issues
```

### Using Yarn

```bash
# Install ARCANEA CLI
yarn global add @arcanea/cli

# Verify installation
arcanea --version
```

### Using PNPM

```bash
# Install ARCANEA CLI
pnpm add -g @arcanea/cli

# Verify installation  
arcanea --version
```

## Create Your First Project

### From Template

```bash
# Create from template (recommended for beginners)
arcanea create my-first-realm --template business-platform

# Available templates:
# - business-platform: Complete business solution starter
# - education-platform: E-learning and training systems
# - wellness-platform: Health and wellness applications
# - gaming-universe: Game worlds and interactive experiences
# - creative-studio: Content creation and media platforms
# - community-hub: Social platforms and community tools

# Navigate to your project
cd my-first-realm

# Install dependencies
npm install

# Start the Six Forces engine
npm run dev
```

### From Scratch

```bash
# Create empty realm
arcanea create my-custom-realm --blank

# Initialize Six Forces
cd my-custom-realm
arcanea init six-forces

# Install core packages
npm install @arcanea/six-forces @arcanea/community @arcanea/enterprise
```

## Configuration

### Basic Configuration

Create `arcanea.config.js` in your project root:

```javascript
// arcanea.config.js
export default {
  // Guardian Configuration
  guardians: {
    flame: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      enabled: true
    },
    form: {
      model: 'claude-3-haiku',
      creativity: 0.8,
      enabled: true
    },
    lore: {
      model: 'gpt-4o-mini',
      temperature: 0.8,
      enabled: true
    },
    resonance: {
      model: 'claude-3-haiku',
      enabled: false // Disable for basic setup
    },
    synthesis: {
      model: 'gpt-4',
      temperature: 0.4,
      enabled: true
    },
    manifestation: {
      model: 'gpt-4',
      temperature: 0.5,
      enabled: true
    }
  },
  
  // Community Features
  community: {
    enabled: true,
    collaboration: true,
    marketplace: true,
    mentorship: false
  },
  
  // Manifestation Settings
  manifestation: {
    defaultTarget: 'digital',
    defaultTimeline: 'standard',
    autoSave: true,
    validation: true
  },
  
  // Development Settings
  development: {
    hotReload: true,
    debugMode: true,
    mockData: true,
    localGuardians: false // Use cloud Guardians for better performance
  }
}
```

### Environment Variables

Create `.env` file for sensitive configuration:

```bash
# .env
# AI Model API Keys (choose your provider)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Community Features (optional)
ARCANEA_COMMUNITY_TOKEN=your_community_token

# Enterprise Features (enterprise customers only)
ARCANEA_ENTERPRISE_TOKEN=your_enterprise_token
ARCANEA_ORGANIZATION_ID=your_org_id

# Custom Guardian Endpoints (advanced)
ARCANEA_GUARDIAN_ENDPOINT=https://your-custom-guardian-api.com
```

## Guardian Setup

### AI Model Configuration

ARCANEA works with multiple AI providers. Configure your preferred models:

#### OpenAI Configuration
```javascript
// For OpenAI GPT models
guardians: {
  flame: {
    provider: 'openai',
    model: 'gpt-4',
    apiKey: process.env.OPENAI_API_KEY
  }
}
```

#### Anthropic Configuration
```javascript
// For Claude models
guardians: {
  form: {
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    apiKey: process.env.ANTHROPIC_API_KEY
  }
}
```

#### Local Models (Advanced)
```javascript
// For local deployment
guardians: {
  synthesis: {
    provider: 'local',
    model: 'llama-3-70b',
    endpoint: 'http://localhost:11434',
    gpu: true
  }
}
```

## Verification

### Test Your Installation

```bash
# Run system diagnostics
arcanea doctor

# Test Guardian connectivity
arcanea test guardians

# Create a simple test realm
arcanea create test-realm --template minimal
cd test-realm
npm install
npm run dev

# Test manifestation
arcanea manifest --vision "Simple blog platform" --forces flame,form,lore
```

Expected output:
```
✅ System Requirements: Passed
✅ Node.js Version: 20.0.0 ✓
✅ ARCANEA CLI: 1.0.0 ✓
✅ Guardian Connectivity: All Guardians responsive
✅ Template Library: 15 templates available
✅ Test Manifestation: Completed successfully

🌟 ARCANEA is ready! Create your first realm with 'arcanea create'
```

## Troubleshooting

### Common Issues

#### Guardian Connection Issues
```bash
# Problem: Guardians not responding
# Solution: Check API keys and network connectivity
arcanea test guardians --verbose

# Reset Guardian configuration
arcanea config reset guardians
```

#### Template Download Issues
```bash
# Problem: Templates not downloading
# Solution: Update template library
arcanea templates update

# Clear template cache
arcanea templates clear-cache
```

#### Memory Issues
```bash
# Problem: Out of memory during manifestation
# Solution: Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"
arcanea manifest --vision "your vision"
```

#### Permission Issues (Linux/macOS)
```bash
# Problem: Permission denied
# Solution: Fix npm global permissions
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}

# Or use nvm for Node.js management
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

### Performance Optimization

#### For Large Realms
```javascript
// arcanea.config.js - Optimize for complex manifestations
export default {
  guardians: {
    // Use faster models for initial iterations
    flame: { model: 'gpt-4o-mini' },
    form: { model: 'claude-3-haiku' },
    // Use premium models for final manifestation
    synthesis: { model: 'gpt-4' },
    manifestation: { model: 'gpt-4' }
  },
  manifestation: {
    parallelProcessing: true,
    caching: true,
    incrementalUpdates: true
  },
  performance: {
    maxConcurrentGuardians: 4,
    timeoutMs: 300000, // 5 minutes
    retryAttempts: 3
  }
}
```

#### For Development Speed
```javascript
// Faster development configuration
export default {
  guardians: {
    // Use lightweight models for rapid iteration
    flame: { model: 'gpt-4o-mini', temperature: 0.8 },
    form: { model: 'claude-3-haiku', creativity: 0.9 },
    synthesis: { model: 'gpt-4o-mini', temperature: 0.6 }
  },
  development: {
    hotReload: true,
    mockData: true,
    skipValidation: true, // Skip for speed
    parallelGuardians: false // Sequential for debugging
  }
}
```

## Advanced Setup

### Docker Installation

```bash
# Use official ARCANEA Docker image
docker pull arcanea/multiverse-engine:latest

# Run with Docker Compose
curl -O https://raw.githubusercontent.com/frankxai/arcanea-core/main/docker-compose.yml
docker-compose up -d

# Verify container health
docker-compose ps
```

### Kubernetes Deployment

```yaml
# arcanea-k8s.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: arcanea-multiverse-engine
spec:
  replicas: 3
  selector:
    matchLabels:
      app: arcanea-engine
  template:
    metadata:
      labels:
        app: arcanea-engine
    spec:
      containers:
      - name: multiverse-engine
        image: arcanea/multiverse-engine:latest
        env:
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: arcanea-secrets
              key: openai-api-key
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "8Gi"
            cpu: "4000m"
```

### Enterprise Installation

For enterprise customers, use the dedicated installation script:

```bash
# Download enterprise installer
curl -O https://enterprise.arcanea.app/install/enterprise-setup.sh
chmod +x enterprise-setup.sh

# Run enterprise installation
./enterprise-setup.sh --organization "your-org-id" --environment production

# Configure enterprise features
arcanea enterprise configure --compliance SOC2,GDPR --governance strict
```

## Next Steps

Now that ARCANEA is installed, you're ready to start manifesting multiverses:

1. **[Your First Realm](/tutorials/your-first-realm.md)** - Create your first complete multiverse
2. **[Six Forces Overview](/guide/six-forces-overview.md)** - Understand each Guardian's capabilities
3. **[Community Features](/community/)** - Connect with other realm builders
4. **[API Reference](/api/)** - Dive deep into technical capabilities

## Getting Help

If you encounter issues during installation:

- **Documentation**: Check our [troubleshooting guide](/guide/troubleshooting.md)
- **Community**: Ask questions in [GitHub Discussions](https://github.com/frankxai/arcanea-core/discussions)
- **Support**: Enterprise customers can contact support@arcanea.app
- **Discord**: Join our [Discord community](https://discord.gg/arcanea) for real-time help

---

*"The first step in manifesting multiverses is having the tools. You now possess the most powerful creation platform ever built. What will you manifest first?"*