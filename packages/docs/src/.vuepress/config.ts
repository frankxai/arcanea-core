import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { searchPlugin } from '@vuepress/plugin-search'
import { docsearchPlugin } from '@vuepress/plugin-docsearch'

export default defineUserConfig({
  lang: 'en-US',
  title: 'Arcanea Documentation',
  description: 'The Complete Guide to Building AI Character Platforms with Arcanea',
  
  head: [
    ['link', { rel: 'icon', href: '/images/arcanea-logo.png' }],
    ['meta', { name: 'theme-color', content: '#8B5CF6' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js' }],
    ['script', { }, `
      mermaid.initialize({ 
        startOnLoad: true,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#8B5CF6',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#7C3AED',
          lineColor: '#A855F7'
        }
      })
    `]
  ],

  theme: defaultTheme({
    logo: '/images/arcanea-logo.png',
    
    repo: 'frankxai/arcanea-core',
    
    navbar: [
      {
        text: 'Getting Started',
        link: '/guide/'
      },
      {
        text: 'API Reference',
        link: '/api/'
      },
      {
        text: 'Examples',
        children: [
          '/examples/basic-setup.md',
          '/examples/character-creation.md',
          '/examples/advanced-features.md',
          '/examples/enterprise-deployment.md'
        ]
      },
      {
        text: 'Tutorials',
        children: [
          '/tutorials/quick-start.md',
          '/tutorials/character-design.md',
          '/tutorials/prompt-language.md',
          '/tutorials/deployment.md',
          '/tutorials/analytics.md'
        ]
      },
      {
        text: 'Enterprise',
        link: '/enterprise/'
      },
      {
        text: 'Community',
        children: [
          {
            text: 'Discord',
            link: 'https://discord.gg/arcanea'
          },
          {
            text: 'GitHub Discussions',
            link: 'https://github.com/frankxai/arcanea-core/discussions'
          },
          {
            text: 'Stack Overflow',
            link: 'https://stackoverflow.com/questions/tagged/arcanea'
          }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          children: [
            '/guide/',
            '/guide/what-is-arcanea.md',
            '/guide/architecture.md',
            '/guide/core-concepts.md'
          ]
        },
        {
          text: 'Installation',
          children: [
            '/guide/installation.md',
            '/guide/quick-start.md',
            '/guide/configuration.md',
            '/guide/environment-setup.md'
          ]
        },
        {
          text: 'Character Creation',
          children: [
            '/guide/character-basics.md',
            '/guide/archetype-system.md',
            '/guide/personality-design.md',
            '/guide/memory-systems.md',
            '/guide/consciousness-levels.md'
          ]
        },
        {
          text: 'Arcanean Prompt Language',
          children: [
            '/guide/apl-introduction.md',
            '/guide/apl-syntax.md',
            '/guide/apl-advanced.md',
            '/guide/apl-best-practices.md'
          ]
        },
        {
          text: 'Starlight Intelligence',
          children: [
            '/guide/starlight-overview.md',
            '/guide/local-deployment.md',
            '/guide/model-management.md',
            '/guide/performance-optimization.md'
          ]
        }
      ],
      
      '/api/': [
        {
          text: 'Core API',
          children: [
            '/api/',
            '/api/character-manager.md',
            '/api/conversation-engine.md',
            '/api/memory-system.md',
            '/api/personality-engine.md'
          ]
        },
        {
          text: 'Prompt Language API',
          children: [
            '/api/apl-parser.md',
            '/api/apl-compiler.md',
            '/api/apl-runtime.md'
          ]
        },
        {
          text: 'Starlight Intelligence API',
          children: [
            '/api/starlight-manager.md',
            '/api/model-orchestrator.md',
            '/api/load-balancer.md'
          ]
        },
        {
          text: 'UI Components API',
          children: [
            '/api/chat-components.md',
            '/api/visualization-components.md',
            '/api/interactive-components.md'
          ]
        },
        {
          text: 'Enterprise API',
          children: [
            '/api/enterprise-manager.md',
            '/api/analytics-engine.md',
            '/api/tenant-management.md',
            '/api/security-manager.md'
          ]
        }
      ],

      '/tutorials/': [
        {
          text: 'Getting Started',
          children: [
            '/tutorials/',
            '/tutorials/your-first-character.md',
            '/tutorials/basic-conversation.md',
            '/tutorials/adding-personality.md'
          ]
        },
        {
          text: 'Advanced Tutorials',
          children: [
            '/tutorials/multi-character-scenarios.md',
            '/tutorials/custom-knowledge-base.md',
            '/tutorials/voice-integration.md',
            '/tutorials/memory-persistence.md'
          ]
        },
        {
          text: 'Deployment Guides',
          children: [
            '/tutorials/local-deployment.md',
            '/tutorials/cloud-deployment.md',
            '/tutorials/docker-deployment.md',
            '/tutorials/kubernetes-deployment.md'
          ]
        },
        {
          text: 'Integration Tutorials',
          children: [
            '/tutorials/react-integration.md',
            '/tutorials/nextjs-integration.md',
            '/tutorials/webhook-integration.md',
            '/tutorials/api-integration.md'
          ]
        }
      ],

      '/enterprise/': [
        {
          text: 'Overview',
          children: [
            '/enterprise/',
            '/enterprise/features.md',
            '/enterprise/pricing.md',
            '/enterprise/support.md'
          ]
        },
        {
          text: 'Multi-Tenancy',
          children: [
            '/enterprise/tenant-management.md',
            '/enterprise/resource-isolation.md',
            '/enterprise/tenant-customization.md'
          ]
        },
        {
          text: 'Security',
          children: [
            '/enterprise/security-overview.md',
            '/enterprise/authentication.md',
            '/enterprise/authorization.md',
            '/enterprise/compliance.md'
          ]
        },
        {
          text: 'Analytics',
          children: [
            '/enterprise/analytics-overview.md',
            '/enterprise/business-intelligence.md',
            '/enterprise/reporting.md',
            '/enterprise/predictive-analytics.md'
          ]
        },
        {
          text: 'Deployment',
          children: [
            '/enterprise/infrastructure.md',
            '/enterprise/scalability.md',
            '/enterprise/monitoring.md',
            '/enterprise/disaster-recovery.md'
          ]
        }
      ]
    },

    editLink: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: true,
    lastUpdatedText: 'Last Updated',

    contributors: true,
    contributorsText: 'Contributors',

    // Custom theme variables
    colorMode: 'auto',
    colorModeSwitch: true
  }),

  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: 'Search documentation...'
        }
      },
      hotKeys: ['s', '/'],
      maxSuggestions: 10
    }),
    
    docsearchPlugin({
      appId: 'ARCANEA_DOCS',
      apiKey: 'your-docsearch-api-key',
      indexName: 'arcanea',
      locales: {
        '/': {
          placeholder: 'Search docs...',
          translations: {
            button: {
              buttonText: 'Search',
              buttonAriaLabel: 'Search'
            },
            modal: {
              searchBox: {
                resetButtonTitle: 'Clear query',
                resetButtonAriaLabel: 'Clear query',
                cancelButtonText: 'Cancel',
                cancelButtonAriaLabel: 'Cancel'
              },
              startScreen: {
                recentSearchesTitle: 'Recent Searches',
                noRecentSearchesText: 'No recent searches',
                saveRecentSearchButtonTitle: 'Save this search',
                removeRecentSearchButtonTitle: 'Remove this search from history',
                favoriteSearchesTitle: 'Favorites',
                removeFavoriteSearchButtonTitle: 'Remove this search from favorites'
              },
              errorScreen: {
                titleText: 'Unable to fetch results',
                helpText: 'You might want to check your network connection'
              },
              footer: {
                selectText: 'to select',
                navigateText: 'to navigate',
                closeText: 'to close',
                searchByText: 'Search powered by'
              },
              noResultsScreen: {
                noResultsText: 'No results for',
                suggestedQueryText: 'Try searching for',
                reportMissingResultsText: 'Report missing results',
                reportMissingResultsLinkText: 'Let us know'
              }
            }
          }
        }
      }
    })
  ],

  markdown: {
    code: {
      lineNumbers: true
    },
    importCode: {
      handleImportPath: (str) => str.replace(/^@/, '/packages/')
    }
  },

  // Custom configurations
  define: {
    __VERSION__: JSON.stringify('1.0.0')
  }
})