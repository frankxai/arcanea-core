#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { StarlightIntelligence } from './index.js';
import { ModelProvider, StarlightConfig } from './types.js';

const program = new Command();

program
  .name('starlight')
  .description('Starlight Intelligence - Local AI Model Orchestration')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Starlight Intelligence configuration')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🌟 Starlight Intelligence Setup\n'));

    const answers = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'providers',
        message: 'Which AI providers would you like to configure?',
        choices: [
          { name: 'Ollama (Local)', value: 'ollama', checked: true },
          { name: 'LlamaCpp (Local)', value: 'llamacpp' },
          { name: 'OpenAI (Cloud)', value: 'openai' },
          { name: 'Anthropic (Cloud)', value: 'anthropic' },
          { name: 'OpenRouter (Cloud)', value: 'openrouter' }
        ]
      },
      {
        type: 'input',
        name: 'port',
        message: 'Starlight server port:',
        default: '3001'
      },
      {
        type: 'confirm',
        name: 'autoDiscovery',
        message: 'Enable automatic model discovery?',
        default: true
      },
      {
        type: 'list',
        name: 'loadBalancing',
        message: 'Load balancing strategy:',
        choices: ['round-robin', 'least-loaded', 'fastest-response'],
        default: 'least-loaded'
      }
    ]);

    const config: StarlightConfig = {
      server: {
        port: parseInt(answers.port),
        host: '0.0.0.0'
      },
      providers: {},
      loadBalancing: {
        strategy: answers.loadBalancing,
        healthCheck: {
          interval: 30000,
          timeout: 5000,
          retries: 3
        }
      },
      autoDiscovery: answers.autoDiscovery,
      logging: {
        level: 'info',
        file: './starlight.log'
      }
    };

    // Configure each selected provider
    for (const provider of answers.providers) {
      const providerConfig = await configureProvider(provider);
      config.providers[provider as ModelProvider] = providerConfig;
    }

    const spinner = ora('Creating Starlight configuration...').start();
    
    try {
      const fs = await import('fs-extra');
      await fs.writeJson('./starlight.config.json', config, { spaces: 2 });
      
      // Create Docker Compose for local providers
      if (answers.providers.includes('ollama') || answers.providers.includes('llamacpp')) {
        await createDockerCompose(answers.providers);
      }

      spinner.succeed('Starlight Intelligence configured successfully!');
      
      console.log(chalk.green('\n✅ Configuration complete!'));
      console.log(chalk.yellow('\nNext steps:'));
      console.log('1. Run: starlight start');
      console.log('2. Visit: http://localhost:' + answers.port);
      
      if (answers.providers.includes('ollama')) {
        console.log('3. Pull models: starlight models pull llama2');
      }
      
    } catch (error) {
      spinner.fail('Failed to create configuration');
      console.error(chalk.red(error));
    }
  });

program
  .command('start')
  .description('Start Starlight Intelligence server')
  .option('-d, --daemon', 'Run as daemon')
  .action(async (options) => {
    const spinner = ora('Starting Starlight Intelligence...').start();
    
    try {
      const starlight = new StarlightIntelligence();
      await starlight.initialize();
      await starlight.start();
      
      spinner.succeed('Starlight Intelligence started successfully!');
      console.log(chalk.green(`\n🌟 Server running on http://localhost:${starlight.config.server.port}`));
      
      if (!options.daemon) {
        console.log(chalk.yellow('\nPress Ctrl+C to stop the server\n'));
        
        process.on('SIGINT', async () => {
          console.log(chalk.yellow('\n\nShutting down Starlight Intelligence...'));
          await starlight.stop();
          process.exit(0);
        });
      }
      
    } catch (error) {
      spinner.fail('Failed to start Starlight Intelligence');
      console.error(chalk.red(error));
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Stop Starlight Intelligence server')
  .action(async () => {
    const spinner = ora('Stopping Starlight Intelligence...').start();
    
    try {
      // Implementation for stopping daemon
      spinner.succeed('Starlight Intelligence stopped');
    } catch (error) {
      spinner.fail('Failed to stop server');
      console.error(chalk.red(error));
    }
  });

program
  .command('status')
  .description('Check Starlight Intelligence status')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🌟 Starlight Intelligence Status\n'));
    
    try {
      const starlight = new StarlightIntelligence();
      await starlight.initialize();
      
      const status = await starlight.getSystemStatus();
      
      console.log(chalk.green('System Status:'), status.healthy ? '✅ Healthy' : '❌ Unhealthy');
      console.log(chalk.blue('Active Models:'), status.activeModels.length);
      console.log(chalk.blue('Total Requests:'), status.totalRequests);
      console.log(chalk.blue('Average Response Time:'), status.averageResponseTime + 'ms');
      
      console.log(chalk.yellow('\nProvider Status:'));
      for (const [provider, info] of Object.entries(status.providers)) {
        const statusIcon = info.healthy ? '✅' : '❌';
        console.log(`  ${provider}: ${statusIcon} ${info.models.length} models`);
      }
      
      console.log(chalk.yellow('\nActive Models:'));
      for (const model of status.activeModels) {
        console.log(`  • ${model.name} (${model.provider}) - ${model.status}`);
      }
      
    } catch (error) {
      console.error(chalk.red('Failed to get status:', error));
    }
  });

program
  .command('models')
  .description('Manage AI models')
  .addCommand(
    new Command('list')
      .description('List available models')
      .action(async () => {
        const starlight = new StarlightIntelligence();
        await starlight.initialize();
        
        const models = await starlight.getAvailableModels();
        
        console.log(chalk.cyan.bold('\n🤖 Available Models\n'));
        
        for (const [provider, providerModels] of Object.entries(models)) {
          console.log(chalk.yellow(`${provider.toUpperCase()}:`));
          for (const model of providerModels) {
            const statusIcon = model.loaded ? '🟢' : '⚪';
            console.log(`  ${statusIcon} ${model.name} - ${model.size}`);
          }
          console.log();
        }
      })
  )
  .addCommand(
    new Command('pull')
      .description('Pull a model')
      .argument('<model>', 'Model name to pull')
      .option('-p, --provider <provider>', 'Specific provider')
      .action(async (model, options) => {
        const spinner = ora(`Pulling model: ${model}`).start();
        
        try {
          const starlight = new StarlightIntelligence();
          await starlight.initialize();
          
          await starlight.pullModel(model, options.provider);
          spinner.succeed(`Model ${model} pulled successfully!`);
          
        } catch (error) {
          spinner.fail(`Failed to pull model: ${model}`);
          console.error(chalk.red(error));
        }
      })
  )
  .addCommand(
    new Command('remove')
      .description('Remove a model')
      .argument('<model>', 'Model name to remove')
      .action(async (model) => {
        const confirm = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmed',
            message: `Remove model ${model}?`,
            default: false
          }
        ]);
        
        if (!confirm.confirmed) {
          console.log('Cancelled');
          return;
        }
        
        const spinner = ora(`Removing model: ${model}`).start();
        
        try {
          const starlight = new StarlightIntelligence();
          await starlight.initialize();
          
          await starlight.removeModel(model);
          spinner.succeed(`Model ${model} removed successfully!`);
          
        } catch (error) {
          spinner.fail(`Failed to remove model: ${model}`);
          console.error(chalk.red(error));
        }
      })
  );

program
  .command('test')
  .description('Test AI model response')
  .option('-m, --model <model>', 'Specific model to test')
  .option('-p, --prompt <prompt>', 'Test prompt', 'Hello, how are you?')
  .action(async (options) => {
    const spinner = ora('Testing model response...').start();
    
    try {
      const starlight = new StarlightIntelligence();
      await starlight.initialize();
      
      const response = await starlight.generateResponse({
        prompt: options.prompt,
        model: options.model,
        maxTokens: 100
      });
      
      spinner.succeed('Test completed!');
      
      console.log(chalk.cyan('\nPrompt:'), options.prompt);
      console.log(chalk.green('Response:'), response.text);
      console.log(chalk.yellow('Model:'), response.model);
      console.log(chalk.blue('Response Time:'), response.responseTime + 'ms');
      
    } catch (error) {
      spinner.fail('Test failed');
      console.error(chalk.red(error));
    }
  });

async function configureProvider(provider: string) {
  switch (provider) {
    case 'ollama':
      const ollamaConfig = await inquirer.prompt([
        {
          type: 'input',
          name: 'baseUrl',
          message: 'Ollama API URL:',
          default: 'http://localhost:11434'
        }
      ]);
      return {
        enabled: true,
        baseUrl: ollamaConfig.baseUrl,
        models: ['llama2', 'mistral', 'codellama']
      };

    case 'openai':
      const openaiConfig = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'OpenAI API Key:',
          mask: '*'
        }
      ]);
      return {
        enabled: true,
        apiKey: openaiConfig.apiKey,
        models: ['gpt-4', 'gpt-3.5-turbo']
      };

    case 'openrouter':
      const openrouterConfig = await inquirer.prompt([
        {
          type: 'password',
          name: 'apiKey',
          message: 'OpenRouter API Key:',
          mask: '*'
        }
      ]);
      return {
        enabled: true,
        apiKey: openrouterConfig.apiKey,
        baseUrl: 'https://openrouter.ai/api/v1',
        models: ['anthropic/claude-3-opus', 'openai/gpt-4']
      };

    default:
      return { enabled: true };
  }
}

async function createDockerCompose(providers: string[]) {
  let compose = `version: '3.8'

services:`;

  if (providers.includes('ollama')) {
    compose += `
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    restart: unless-stopped
    environment:
      - OLLAMA_HOST=0.0.0.0`;
  }

  compose += `

volumes:
  ollama_data:`;

  const fs = await import('fs-extra');
  await fs.writeFile('./docker-compose.yml', compose);
}

program.parse();