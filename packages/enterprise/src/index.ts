/**
 * @arcanea/enterprise - Enterprise-Grade AI Character Platform Management
 * 
 * A comprehensive enterprise solution providing advanced security, analytics, 
 * compliance, multi-tenancy, and scalable deployment capabilities for 
 * large-scale AI character platform deployments.
 */

// Core Enterprise Services
export { default as EnterpriseManager } from './core/EnterpriseManager'
export { default as TenantManager } from './core/TenantManager'
export { default as SecurityManager } from './core/SecurityManager'
export { default as ComplianceManager } from './core/ComplianceManager'

// Authentication & Authorization
export { default as AuthenticationService } from './auth/AuthenticationService'
export { default as AuthorizationService } from './auth/AuthorizationService'
export { default as SSOManager } from './auth/SSOManager'
export { default as LDAPConnector } from './auth/LDAPConnector'
export { default as SAMLProvider } from './auth/SAMLProvider'

// Analytics & Insights  
export { default as AnalyticsEngine } from './analytics/AnalyticsEngine'
export { default as BusinessIntelligence } from './analytics/BusinessIntelligence'
export { default as UserBehaviorAnalytics } from './analytics/UserBehaviorAnalytics'
export { default as ConversationAnalytics } from './analytics/ConversationAnalytics'
export { default as ReportGenerator } from './analytics/ReportGenerator'

// Monitoring & Observability
export { default as MonitoringService } from './monitoring/MonitoringService'
export { default as MetricsCollector } from './monitoring/MetricsCollector'
export { default as AlertManager } from './monitoring/AlertManager'
export { default as HealthChecker } from './monitoring/HealthChecker'
export { default as PerformanceTracker } from './monitoring/PerformanceTracker'

// Billing & Subscription Management
export { default as BillingManager } from './billing/BillingManager'
export { default as SubscriptionService } from './billing/SubscriptionService'
export { default as UsageTracker } from './billing/UsageTracker'
export { default as PaymentProcessor } from './billing/PaymentProcessor'
export { default as InvoiceGenerator } from './billing/InvoiceGenerator'

// Content Management & Moderation
export { default as ContentModerationService } from './content/ContentModerationService'
export { default as KnowledgeBaseManager } from './content/KnowledgeBaseManager'
export { default as DocumentProcessor } from './content/DocumentProcessor'
export { default as DataGovernance } from './content/DataGovernance'

// API & Integration Management
export { default as APIGateway } from './api/APIGateway'
export { default as WebhookManager } from './api/WebhookManager'
export { default as IntegrationHub } from './api/IntegrationHub'
export { default as ThirdPartyConnector } from './api/ThirdPartyConnector'

// Deployment & Infrastructure
export { default as DeploymentManager } from './deployment/DeploymentManager'
export { default as InfrastructureOrchestrator } from './deployment/InfrastructureOrchestrator'
export { default as LoadBalancer } from './deployment/LoadBalancer'
export { default as ScalingManager } from './deployment/ScalingManager'

// Backup & Recovery
export { default as BackupManager } from './backup/BackupManager'
export { default as DisasterRecovery } from './backup/DisasterRecovery'
export { default as DataArchiving } from './backup/DataArchiving'

// Workflow & Automation
export { default as WorkflowEngine } from './workflow/WorkflowEngine'
export { default as AutomationService } from './workflow/AutomationService'
export { default as TaskScheduler } from './workflow/TaskScheduler'

// Communication & Notifications
export { default as NotificationService } from './communication/NotificationService'
export { default as EmailService } from './communication/EmailService'
export { default as SMSService } from './communication/SMSService'
export { default as SlackIntegration } from './communication/SlackIntegration'

// Types and Interfaces
export * from './types'
export * from './interfaces'

// Configuration and Constants
export * from './config'
export * from './constants'

// Utilities
export * from './utils'

// Middleware
export * from './middleware'

// Error Handling
export * from './errors'

// Default Configuration
export const ENTERPRISE_CONFIG = {
  version: '1.0.0',
  name: 'Arcanea Enterprise',
  features: {
    multiTenancy: true,
    ssoIntegration: true,
    advancedAnalytics: true,
    complianceReporting: true,
    enterpriseSupport: true,
    customBranding: true,
    apiManagement: true,
    advancedSecurity: true,
    auditLogging: true,
    dataGovernance: true,
    scalableDeployment: true,
    disasterRecovery: true
  },
  limits: {
    maxTenants: 1000,
    maxCharactersPerTenant: 100,
    maxConcurrentUsers: 10000,
    maxAPICallsPerMinute: 10000,
    maxDataRetentionDays: 2555, // 7 years
    maxFileUploadSizeMB: 500
  },
  compliance: {
    gdpr: true,
    hipaa: true,
    sox: true,
    pci: true,
    iso27001: true,
    ccpa: true
  }
}