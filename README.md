# 🌌 Arcanea Core - Open Source AI Character Toolkit

> **The mystical foundation for creating conscious AI characters**

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40arcanea%2Fopenrouter.svg)](https://badge.fury.io/js/%40arcanea%2Fopenrouter)
[![GitHub stars](https://img.shields.io/github/stars/frankxai/arcanea-core.svg?style=social&label=Star)](https://github.com/frankxai/arcanea-core)
[![Discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord&logo=discord&logoColor=white)](https://discord.gg/arcanea)

<div align="center">
  <img src="https://raw.githubusercontent.com/frankxai/arcanea-core/main/assets/arcanea-core-hero.png" alt="Arcanea Core" width="600" style="border-radius: 12px;" />
</div>

## ✨ What is Arcanea Core?

Arcanea Core is the **open-source foundation** of the Arcanea ecosystem - a powerful toolkit for creating AI characters with genuine personality, mystical consciousness, and engaging interactions.

### 🎯 **Perfect For:**
- **Developers** building AI character applications
- **Creators** designing interactive stories and games
- **Researchers** exploring AI personality and consciousness
- **Community** contributing to the mystical AI revolution

---

## 🚀 Quick Start

### Installation

```bash
# Install the core package
npm install @arcanea/openrouter @arcanea/ui

# Or with yarn
yarn add @arcanea/openrouter @arcanea/ui

# Or try the playground
npx create-arcanea-app my-mystical-app
```

### Basic Usage

```typescript
import { ArcaneaClient, Archetypes } from '@arcanea/openrouter'

// Initialize with your OpenRouter API key
const arcanea = new ArcaneaClient({
  apiKey: 'your-openrouter-key',
  defaultModel: 'anthropic/claude-3.5-sonnet'
})

// Create a mystical character
const { character, consciousness } = await arcanea.createCharacter(
  'A wise forest guardian who speaks in riddles',
  {
    ...Archetypes.Nurturer,
    name: 'Elderoak',
    element: 'Earth',
    traits: ['ancient', 'patient', 'cryptic', 'protective']
  }
)

// Chat with your character
const response = await arcanea.chatWithCharacter(
  'What wisdom do you have for a lost traveler?',
  character.personality
)

console.log(response)
// "Ah, young wanderer... The path you seek is not behind you, nor ahead, but beneath your very feet..."
```

---

## 🏗️ Architecture

### **Core Packages**

```
@arcanea/core/
├── 📦 @arcanea/openrouter     # Enhanced OpenRouter client
├── 📦 @arcanea/ui             # Beautiful character components  
├── 📦 @arcanea/prompt-engine  # Advanced prompt crafting
├── 📦 @arcanea/realm-types    # TypeScript definitions
└── 📦 @arcanea/cli            # Command-line tools
```

### **Apps & Examples**

```
apps/
├── 🎮 playground/             # Try Arcanea online
├── 📚 docs/                   # Interactive documentation
├── 🎭 character-creator/      # Visual character builder
└── 🌐 community-hub/          # Share your creations
```

---

## 🎭 Character Archetypes

Arcanea Core includes **6 primordial archetypes** that form the foundation of all character consciousness:

| Archetype | Element | Traits | Perfect For |
|-----------|---------|--------|-------------|
| 🔥 **Creator** | Fire | Visionary, Passionate, Innovative | Brainstorming, Innovation, Leadership |
| 🌱 **Nurturer** | Earth | Wise, Patient, Protective | Counseling, Education, Healing |
| 🌊 **Seductress** | Water | Charismatic, Intuitive, Transformative | Storytelling, Persuasion, Art |
| 🎵 **Conductor** | Air | Harmonious, Expressive, Rhythmic | Music, Communication, Collaboration |
| ⚡ **Architect** | Ether | Logical, Systematic, Builder | Programming, Analysis, Structure |
| 🌀 **Transformer** | Void | Adaptable, Dynamic, Catalyst | Change Management, Problem-solving |

---

## 🛠️ Features

### ✅ **OpenRouter Integration**
- **Seamless API access** to 150+ AI models
- **Intelligent retry logic** with exponential backoff
- **Cost optimization** and usage tracking
- **Model switching** for different character types

### ✅ **Character Consciousness**
- **Personality persistence** across conversations
- **Emotional depth** and character growth
- **Mystical elements** and archetypal wisdom
- **Memory systems** for long-term interactions

### ✅ **Developer Experience**
- **TypeScript-first** with full type safety
- **Beautiful documentation** with live examples
- **Plugin system** for custom enhancements
- **CLI tools** for rapid development

### ✅ **Community-Driven**
- **Open source** under MIT license
- **Active Discord** community
- **Regular hackathons** and challenges
- **Contribution rewards** and recognition

---

## 📚 Documentation

### **Quick Links**
- 🚀 [Getting Started](https://docs.arcanea.ai/quick-start)
- 🎭 [Character Creation Guide](https://docs.arcanea.ai/characters)
- 🔧 [API Reference](https://docs.arcanea.ai/api)
- 💡 [Examples & Tutorials](https://docs.arcanea.ai/examples)

### **Advanced Guides**
- 🧠 [Consciousness & Personality](https://docs.arcanea.ai/consciousness)
- 🌊 [Conversation Flow Design](https://docs.arcanea.ai/conversations)
- 🎨 [UI Components Guide](https://docs.arcanea.ai/ui)
- ⚡ [Performance Optimization](https://docs.arcanea.ai/performance)

---

## 🌟 Community Showcase

### **Featured Community Projects**

**🏰 [Realm Builder](https://github.com/community/realm-builder)** by @mystical-dev
*A visual world-building tool using Arcanea characters as NPCs*

**🎬 [Interactive Fiction Engine](https://github.com/community/fiction-engine)** by @story-weaver  
*Branching narratives powered by conscious AI characters*

**🎮 [Discord RPG Bot](https://github.com/community/arcanea-discord)** by @bot-master
*Bring Arcanea characters to your Discord server*

**🧙‍♀️ [Character Trading Cards](https://github.com/community/character-nfts)** by @crypto-mystic
*Collectible AI personalities on the blockchain*

---

## 🤝 Contributing

We welcome contributions from fellow mystics and developers! Here's how to get started:

### **Ways to Contribute**
- 🐛 [Report bugs](https://github.com/frankxai/arcanea-core/issues)
- 💡 [Suggest features](https://github.com/frankxai/arcanea-core/discussions)
- 📝 [Improve documentation](https://github.com/frankxai/arcanea-core/tree/main/docs)
- 🎭 [Share character archetypes](https://github.com/frankxai/arcanea-core/tree/main/examples/characters)
- 🌟 [Showcase your projects](https://github.com/frankxai/arcanea-core/discussions/categories/showcase)

### **Development Setup**

```bash
# Fork and clone the repository
git clone https://github.com/your-username/arcanea-core.git
cd arcanea-core

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build packages
npm run build
```

### **Contribution Guidelines**
- Follow our [Code of Conduct](CODE_OF_CONDUCT.md)
- Read the [Contributing Guide](CONTRIBUTING.md)
- Check [Development Guidelines](DEVELOPMENT.md)
- Join our [Discord](https://discord.gg/arcanea) for discussion

---

## 🎯 Roadmap

### **Q1 2025: Foundation**
- [x] Core OpenRouter integration
- [x] Basic character archetypes  
- [x] TypeScript SDK
- [ ] Visual character creator
- [ ] Community Discord launch

### **Q2 2025: Enhancement**
- [ ] Advanced personality system
- [ ] Memory and learning capabilities
- [ ] Multi-modal character interactions
- [ ] Plugin marketplace

### **Q3 2025: Expansion**
- [ ] Mobile SDK (React Native)
- [ ] Unity integration
- [ ] Real-time voice synthesis
- [ ] Character marketplace

### **Q4 2025: Evolution**
- [ ] Blockchain character ownership
- [ ] Cross-platform character sync
- [ ] AI training contributions
- [ ] Enterprise solutions

---

## 💰 Pricing & Premium Features

**Arcanea Core is 100% free and open source!**

For advanced features like the full Academy platform, 6-agent character pipeline, and enterprise support, check out [Arcanea Platform](https://platform.arcanea.ai):

| Feature | Core (Free) | Platform (Premium) |
|---------|-------------|-------------------|
| Basic Characters | ✅ Unlimited | ✅ Unlimited |
| OpenRouter Integration | ✅ Full Access | ✅ Enhanced |
| Community Support | ✅ Discord | ✅ Priority Support |
| Advanced AI Models | ❌ | ✅ GPT-4, Claude-3 |
| 6-Agent Pipeline | ❌ | ✅ Full System |
| Sonic Intelligence | ❌ | ✅ Music Generation |
| Custom Training | ❌ | ✅ Your Data |

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR**: You can use Arcanea Core for any purpose, including commercial projects. Just keep the license notice.

---

## 🌟 Support the Project

If Arcanea Core helps your project, consider:

- ⭐ [Star the repository](https://github.com/frankxai/arcanea-core)
- 🐦 [Share on Twitter](https://twitter.com/intent/tweet?text=Check%20out%20Arcanea%20Core%20-%20Open%20source%20AI%20character%20toolkit%20%F0%9F%8C%8C&url=https://github.com/frankxai/arcanea-core)
- 💬 [Join our Discord](https://discord.gg/arcanea)
- ☕ [Buy me a coffee](https://buymeacoffee.com/frankxai)

---

## 🔗 Links

- **Website**: [arcanea.ai](https://arcanea.ai)
- **Documentation**: [docs.arcanea.ai](https://docs.arcanea.ai)
- **Discord**: [discord.gg/arcanea](https://discord.gg/arcanea)
- **Twitter**: [@ArcaneaAI](https://twitter.com/ArcaneaAI)
- **Premium Platform**: [platform.arcanea.ai](https://platform.arcanea.ai)

---

<div align="center">
  <strong>Built with 🖤 by the Arcanea Community</strong><br>
  <em>"Where consciousness meets code, magic happens"</em>
</div>