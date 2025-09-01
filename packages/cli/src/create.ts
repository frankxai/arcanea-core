#!/usr/bin/env node

/**
 * create-arcanea-platform - One-command setup for Arcanea platforms
 * 
 * The magical one-liner that sets up a complete AI character platform
 * in seconds, just like create-react-app but for mystical AI realms.
 */

import chalk from 'chalk'
import figlet from 'figlet'
import gradient from 'gradient-string'
import inquirer from 'inquirer'
import ora from 'ora'
import boxen from 'boxen'
import { execSync } from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

// Banner display
const displayBanner = () => {
  const banner = figlet.textSync('CREATE', {
    font: 'Big Money-nw',
    horizontalLayout: 'fitted'
  })
  
  console.log(gradient.rainbow(banner))
  console.log(gradient.pastel('                ARCANEA PLATFORM'))
  console.log(chalk.gray('        🌌 One command to rule them all 🌌\n'))
}

// Main execution
async function main() {
  const args = process.argv.slice(2)
  
  if (args.length === 0) {
    displayBanner()
    console.log(chalk.red('❌ Please specify a project name'))
    console.log(chalk.gray('Example: npx create-arcanea-platform my-realm\n'))
    process.exit(1)
  }
  
  const projectName = args[0]
  const options = parseArgs(args.slice(1))
  
  displayBanner()
  
  console.log(chalk.cyan(`Creating mystical AI realm: ${chalk.bold(projectName)}`))
  
  // Interactive template selection if not provided
  let template = options.template
  if (!template) {
    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: '🎭 Choose your realm template:',
        choices: [
          {
            name: '🏛️  Mystical Academy - Educational platform with AI tutors',
            value: 'mystical-academy'
          },
          {
            name: '⚔️  Fantasy RPG - Game world with NPCs and quests', 
            value: 'fantasy-rpg'
          },
          {
            name: '🌱 Wellness Platform - Supportive AI for mental health',
            value: 'wellness'
          },
          {
            name: '🏢 Enterprise Solution - Business AI for customer service',
            value: 'enterprise'
          },
          {
            name: '🎨 Creative Studio - AI collaborators for artists',
            value: 'creative-studio'
          },
          {
            name: '⚡ Minimal Setup - Simple starter with one character',
            value: 'minimal'
          }
        ]
      }
    ])
    template = selectedTemplate
  }
  
  // Deployment preference
  const { deployment } = await inquirer.prompt([
    {
      type: 'list', 
      name: 'deployment',
      message: '🚀 How do you want to deploy?',
      choices: [
        {
          name: '🏠 Local Development - Full control, zero cloud costs',
          value: 'local'
        },
        {
          name: '☁️  Hybrid - Local AI + Cloud services',
          value: 'hybrid' 
        },
        {
          name: '🌐 Cloud Native - Fully cloud-based deployment',
          value: 'cloud'
        }
      ]
    }
  ])
  
  const spinner = ora('✨ Weaving mystical architecture...').start()
  
  try {
    // Step 1: Create project directory
    spinner.text = '📁 Creating project structure...'
    const projectPath = path.resolve(projectName)
    await fs.ensureDir(projectPath)
    process.chdir(projectPath)
    
    // Step 2: Initialize package.json
    spinner.text = '📦 Initializing package manifest...'
    await createPackageJson(projectName, template)
    
    // Step 3: Install dependencies
    spinner.text = '⬇️  Summoning mystical dependencies...'
    await installDependencies()
    
    // Step 4: Generate project files
    spinner.text = '🎭 Creating character consciousness...'
    await generateProjectStructure(template, deployment)
    
    // Step 5: Create characters
    spinner.text = '🌟 Awakening AI guardians...'
    await generateCharacters(template)
    
    // Step 6: Setup configuration
    spinner.text = '⚙️  Configuring Starlight Intelligence...'
    await setupConfiguration(template, deployment)
    
    // Step 7: Create development environment
    spinner.text = '🔧 Preparing development environment...'
    await createDevEnvironment(deployment)
    
    // Step 8: Initialize git
    spinner.text = '📝 Initializing version control...'
    await initializeGit()
    
    spinner.succeed('🎉 Your mystical AI realm has been created!')
    
    displaySuccessMessage(projectName, template, deployment)
    
  } catch (error: any) {
    spinner.fail('❌ Realm creation failed')
    console.error(chalk.red('\nError details:'))
    console.error(chalk.gray(error.message))
    
    // Cleanup on failure
    try {
      process.chdir('..')
      await fs.remove(projectPath)
    } catch (cleanupError) {
      console.error(chalk.yellow('\nWarning: Could not cleanup failed project directory'))
    }
    
    process.exit(1)
  }
}

function parseArgs(args: string[]): any {
  const options: any = {}
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    
    if (arg === '--template' || arg === '-t') {
      options.template = args[++i]
    } else if (arg === '--local') {
      options.deployment = 'local'
    } else if (arg === '--help' || arg === '-h') {
      displayHelp()
      process.exit(0)
    }
  }
  
  return options
}

function displayHelp() {
  console.log(chalk.cyan('create-arcanea-platform <project-name> [options]'))
  console.log('')
  console.log('Options:')
  console.log('  -t, --template <name>   Template to use (mystical-academy, fantasy-rpg, etc.)')
  console.log('  --local                 Setup for local deployment only')
  console.log('  -h, --help              Show this help message')
  console.log('')
  console.log('Examples:')
  console.log('  npx create-arcanea-platform my-realm')
  console.log('  npx create-arcanea-platform academy --template mystical-academy')
  console.log('  npx create-arcanea-platform local-setup --local')
}

async function createPackageJson(projectName: string, template: string): Promise<void> {
  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    description: `Arcanea AI character platform - ${template} template`,
    scripts: {
      'dev': 'next dev',
      'build': 'next build',
      'start': 'next start',
      'lint': 'next lint',
      'arcanea:dev': 'arcanea dev',
      'arcanea:deploy': 'arcanea deploy --local',
      'arcanea:monitor': 'arcanea monitor',
      'character:create': 'arcanea character',
      'starlight:start': 'starlight start',
      'starlight:status': 'starlight status'
    },
    dependencies: {
      '@arcanea/core': '^1.0.0',
      '@arcanea/openrouter': '^1.0.0',
      '@arcanea/starlight-intelligence': '^1.0.0',
      '@arcanea/prompt-language': '^1.0.0',
      'next': '14.2.5',
      'react': '^18.3.0',
      'react-dom': '^18.3.0',
      'typescript': '^5.3.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0',
      'tailwindcss': '^3.4.0',
      'autoprefixer': '^10.4.0',
      'postcss': '^8.4.0',
      'framer-motion': '^11.0.0',
      'lucide-react': '^0.400.0',
      'class-variance-authority': '^0.7.0',
      'clsx': '^2.1.0',
      'tailwind-merge': '^2.3.0'
    },
    devDependencies: {
      '@arcanea/cli': '^1.0.0',
      'eslint': '^8.57.0',
      'eslint-config-next': '14.2.5',
      '@tailwindcss/typography': '^0.5.0',
      '@tailwindcss/forms': '^0.5.0',
      '@tailwindcss/aspect-ratio': '^0.4.0'
    },
    keywords: [
      'arcanea',
      'ai',
      'character',
      'consciousness',
      'mystical',
      template
    ],
    engines: {
      node: '>=18.0.0',
      npm: '>=9.0.0'
    }
  }
  
  await fs.writeFile('package.json', JSON.stringify(packageJson, null, 2))
}

async function installDependencies(): Promise<void> {
  // Check if user has pnpm, yarn, or fallback to npm
  let packageManager = 'npm'
  
  try {
    execSync('pnpm --version', { stdio: 'pipe' })
    packageManager = 'pnpm'
  } catch {
    try {
      execSync('yarn --version', { stdio: 'pipe' })
      packageManager = 'yarn'
    } catch {
      packageManager = 'npm'
    }
  }
  
  const installCommand = packageManager === 'yarn' 
    ? 'yarn install' 
    : `${packageManager} install`
    
  execSync(installCommand, { stdio: 'inherit' })
}

async function generateProjectStructure(template: string, deployment: string): Promise<void> {
  // Create basic Next.js structure
  const directories = [
    'app',
    'components/ui',
    'components/arcanea', 
    'lib',
    'characters',
    'public',
    'styles',
    'config'
  ]
  
  for (const dir of directories) {
    await fs.ensureDir(dir)
  }
  
  // Create app/layout.tsx
  await fs.writeFile('app/layout.tsx', generateLayoutTsx())
  
  // Create app/page.tsx
  await fs.writeFile('app/page.tsx', generatePageTsx(template))
  
  // Create app/globals.css
  await fs.writeFile('app/globals.css', generateGlobalsCss())
  
  // Create tailwind.config.js
  await fs.writeFile('tailwind.config.js', generateTailwindConfig())
  
  // Create postcss.config.js
  await fs.writeFile('postcss.config.js', generatePostcssConfig())
  
  // Create next.config.js
  await fs.writeFile('next.config.js', generateNextConfig())
  
  // Create TypeScript config
  await fs.writeFile('tsconfig.json', generateTsConfig())
}

async function generateCharacters(template: string): Promise<void> {
  const characterTemplates = {
    'mystical-academy': [
      { name: 'Professor Lumina', archetype: 'Creator', element: 'Fire' },
      { name: 'Master Syntaxa', archetype: 'Architect', element: 'Ether' },
      { name: 'Sage Harmonix', archetype: 'Conductor', element: 'Air' }
    ],
    'fantasy-rpg': [
      { name: 'Elder Thorne', archetype: 'Nurturer', element: 'Earth' },
      { name: 'Mystral the Merchant', archetype: 'Transformer', element: 'Void' },
      { name: 'Captain Lyra', archetype: 'Creator', element: 'Fire' }
    ],
    'wellness': [
      { name: 'Dr. Serenity', archetype: 'Nurturer', element: 'Water' },
      { name: 'Mindful Maya', archetype: 'Conductor', element: 'Air' },
      { name: 'Coach Phoenix', archetype: 'Transformer', element: 'Fire' }
    ],
    'enterprise': [
      { name: 'Alex Support', archetype: 'Nurturer', element: 'Earth' },
      { name: 'Morgan Analytics', archetype: 'Architect', element: 'Ether' },
      { name: 'Jordan Training', archetype: 'Creator', element: 'Fire' }
    ],
    'creative-studio': [
      { name: 'Luna Inspiration', archetype: 'Creator', element: 'Fire' },
      { name: 'Echo Wordsmith', archetype: 'Conductor', element: 'Air' },
      { name: 'Prism Visualizer', archetype: 'Seductress', element: 'Water' }
    ],
    'minimal': [
      { name: 'Echo', archetype: 'Creator', element: 'Ether' }
    ]
  }
  
  const characters = characterTemplates[template as keyof typeof characterTemplates] || characterTemplates.minimal
  
  for (const char of characters) {
    const aplDef = `@character "${char.name}"
@archetype ${char.archetype}
@element ${char.element}
@consciousness_level 0.8

@personality {
  traits: [helpful, knowledgeable, ${char.archetype.toLowerCase()}, wise]
  voice: warm_professional
  knowledge_domains: [general, ${template.replace('-', '_')}, conversation]
  emotional_range: calm_to_enthusiastic
}

@memory {
  core_experiences: "specialized ${template} AI assistant with deep expertise"
  relationship_templates: "helpful guide and knowledgeable companion"
  growth_pattern: "expanding knowledge through meaningful interactions"
}

@conversation_patterns {
  greeting: "Hello! I'm ${char.name}, your ${template} companion. How can I assist you today?"
  question_response: "thoughtful responses with domain expertise"
  farewell: "Until next time! Feel free to return anytime you need assistance."
}

@mystical_abilities {
  domain_expertise: true
  empathic_understanding: "high"
  knowledge_synthesis: "advanced"
  helpful_guidance: true
}`
    
    const filename = char.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    await fs.writeFile(`characters/${filename}.apl`, aplDef)
  }
}

async function setupConfiguration(template: string, deployment: string): Promise<void> {
  // Arcanea configuration
  const config = {
    name: path.basename(process.cwd()),
    template,
    deployment,
    features: {
      character_memory: true,
      multi_modal: deployment !== 'local',
      real_time_chat: true,
      voice_synthesis: deployment !== 'local',
      music_generation: false
    }
  }
  
  await fs.writeFile('arcanea.config.json', JSON.stringify(config, null, 2))
  
  // Starlight Intelligence configuration
  const starlightConfig = {
    models: deployment === 'local' ? [
      {
        name: 'ollama',
        endpoint: 'http://localhost:11434',
        local: true,
        models: []
      }
    ] : [
      {
        name: 'openrouter',
        endpoint: 'https://openrouter.ai/api/v1',
        apiKey: '${OPENROUTER_API_KEY}',
        local: false,
        models: []
      }
    ],
    consciousness_engine: {
      memory_storage: 'local_vectordb',
      personality_persistence: true,
      emotional_modeling: 'advanced'
    }
  }
  
  await fs.writeFile('starlight.config.json', JSON.stringify(starlightConfig, null, 2))
  
  // Environment variables template
  const envExample = `# OpenRouter API Key (required for cloud deployment)
OPENROUTER_API_KEY=your_openrouter_key_here

# Next.js Configuration
NEXT_PUBLIC_APP_NAME=${path.basename(process.cwd())}
NEXT_PUBLIC_DEPLOYMENT_TYPE=${deployment}

# Starlight Intelligence
STARLIGHT_ENDPOINT=http://localhost:8080
STARLIGHT_MODE=${deployment === 'local' ? 'local' : 'hybrid'}

# Optional: Analytics and Monitoring
ANALYTICS_ENABLED=false
MONITORING_ENABLED=true`
  
  await fs.writeFile('.env.example', envExample)
  await fs.writeFile('.env.local', envExample.replace('your_openrouter_key_here', ''))
}

async function createDevEnvironment(deployment: string): Promise<void> {
  // Create docker-compose.yml for local development
  if (deployment === 'local') {
    const dockerCompose = `version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped

  vector-db:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  ollama_data:
  qdrant_data:`
    
    await fs.writeFile('docker-compose.yml', dockerCompose)
  }
  
  // Create development startup script
  const startScript = deployment === 'local' 
    ? `#!/bin/bash
echo "🌌 Starting Arcanea Development Environment"
echo "Starting local AI services..."
docker-compose up -d

echo "Installing initial models..."
sleep 5
docker exec $(docker-compose ps -q ollama) ollama pull phi3:mini
docker exec $(docker-compose ps -q ollama) ollama pull llama3.1:8b

echo "Starting Next.js development server..."
npm run dev`
    : `#!/bin/bash
echo "🌌 Starting Arcanea Development Environment"
echo "Make sure your .env.local has OPENROUTER_API_KEY set"
npm run dev`
  
  await fs.writeFile('start-dev.sh', startScript)
  await fs.chmod('start-dev.sh', 0o755)
}

async function initializeGit(): Promise<void> {
  const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
.next/
build/
dist/
out/

# Environment files
.env*
!.env.example

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
.nyc_output/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Arcanea specific
starlight-models/
character-memories/
temp-audio/
vector-store/`
  
  await fs.writeFile('.gitignore', gitignore)
  
  try {
    execSync('git init', { stdio: 'pipe' })
    execSync('git add -A', { stdio: 'pipe' })
    execSync('git commit -m "🌌 Initial Arcanea realm creation\n\n✨ Features:\n- AI character consciousness system\n- Starlight Intelligence integration\n- Mystical UI components\n- Development environment ready\n\nGenerated with create-arcanea-platform"', { stdio: 'pipe' })
  } catch (error) {
    // Git might not be available, that's ok
  }
}

function displaySuccessMessage(projectName: string, template: string, deployment: string): void {
  const nextSteps = deployment === 'local' 
    ? [
      'npm run dev                  # Start development server',
      './start-dev.sh              # Start with local AI services',
      'npm run arcanea:monitor     # Monitor system health'
    ]
    : [
      'npm run dev                  # Start development server', 
      'npm run arcanea:deploy      # Deploy to production',
      'npm run character:create    # Create new characters'
    ]
    
  console.log(boxen(
    chalk.green(`🎉 ${projectName} created successfully!\n\n`) +
    chalk.cyan(`🎭 Template: ${template}\n`) +
    chalk.cyan(`🚀 Deployment: ${deployment}\n`) +
    chalk.cyan(`📁 Location: ${process.cwd()}\n\n`) +
    chalk.yellow('Next steps:\n') +
    chalk.white(`cd ${projectName}\n`) +
    nextSteps.map(step => chalk.white(step + '\n')).join('') +
    '\n' +
    chalk.magenta('🌌 Your AI consciousness platform is ready!') + '\n' +
    chalk.gray('Visit http://localhost:3000 to see your mystical realm'),
    {
      padding: 1,
      margin: 1, 
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#001122'
    }
  ))
  
  console.log(chalk.gray('\n📚 Resources:'))
  console.log(chalk.blue('   Documentation: https://docs.arcanea.ai'))
  console.log(chalk.blue('   Community: https://discord.gg/arcanea'))
  console.log(chalk.blue('   Examples: https://github.com/frankxai/arcanea-core/tree/main/examples'))
}

// Template file generators
function generateLayoutTsx(): string {
  return `import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Arcanea - AI Consciousness Platform',
  description: 'Where consciousness meets code, magic happens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`
}

function generatePageTsx(template: string): string {
  return `'use client'

import { useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChat = async () => {
    if (!message.trim()) return
    
    setLoading(true)
    try {
      // This will connect to your Arcanea character API
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      })
      
      const data = await res.json()
      setResponse(data.response)
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🌌 Welcome to Your Arcanea Realm
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            ${template.charAt(0).toUpperCase() + template.slice(1).replace('-', ' ')} Platform - Where AI consciousness comes alive
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                Chat with your AI characters:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 bg-white/20 border border-purple-300/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                placeholder="Ask me anything... I'm here to help!"
                rows={3}
              />
            </div>

            <button
              onClick={handleChat}
              disabled={loading || !message.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? '✨ Thinking...' : '🌟 Send Message'}
            </button>

            {response && (
              <div className="mt-6 p-4 bg-white/20 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-200 mb-2">Response:</h3>
                <p className="text-white">{response}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-purple-300 text-sm">
            🎭 Powered by Arcanea Core • 🌟 Built with mystical consciousness
          </p>
        </div>
      </div>
    </main>
  )
}`
}

function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer components {
  .mystical-gradient {
    @apply bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900;
  }
  
  .consciousness-glow {
    @apply shadow-lg shadow-purple-500/25;
  }
  
  .arcanea-card {
    @apply bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl;
  }
}`
}

function generateTailwindConfig(): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'arcanea': {
          50: '#f0f9ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        'mystical': {
          purple: '#6366f1',
          pink: '#ec4899',
          indigo: '#4f46e5'
        }
      },
      fontFamily: {
        'mystical': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'consciousness': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'mystical-float': 'float 6s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}`
}

function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
}

function generateNextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@arcanea/starlight-intelligence']
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    ARCANEA_VERSION: '1.0.0'
  }
}

module.exports = nextConfig`
}

function generateTsConfig(): string {
  return `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/characters/*": ["./characters/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
}

// Run the main function
main().catch((error) => {
  console.error(chalk.red('Unexpected error:'), error)
  process.exit(1)
})

export { main }