/**
 * @arcanea/collaboration - Real-time Collaboration and Multiplayer Features
 * 
 * Enables multiple users to interact with AI characters simultaneously,
 * share experiences, collaborate on character development, and participate
 * in group conversations with persistent shared state.
 */

// Core Collaboration Services
export { default as CollaborationManager } from './core/CollaborationManager'
export { default as SessionManager } from './core/SessionManager'
export { default as RealTimeSync } from './core/RealTimeSync'
export { default as PresenceManager } from './core/PresenceManager'

// Multiplayer Chat Features
export { default as MultiplayerChatRoom } from './chat/MultiplayerChatRoom'
export { default as SharedConversation } from './chat/SharedConversation'
export { default as GroupCharacterInteraction } from './chat/GroupCharacterInteraction'
export { default as CollaborativeMemory } from './chat/CollaborativeMemory'

// Real-time Components
export { default as CollaborativeCharacterChat } from './components/CollaborativeCharacterChat'
export { default as UserPresenceIndicator } from './components/UserPresenceIndicator'
export { default as SharedWhiteboard } from './components/SharedWhiteboard'
export { default as CollaborativeCharacterDesigner } from './components/CollaborativeCharacterDesigner'
export { default as MultiplayerGameCanvas } from './components/MultiplayerGameCanvas'

// Synchronization & State Management
export { default as SharedStateManager } from './sync/SharedStateManager'
export { default as ConflictResolver } from './sync/ConflictResolver'
export { default as OperationalTransform } from './sync/OperationalTransform'
export { default as CRDTManager } from './sync/CRDTManager'

// P2P Features  
export { default as P2PConnection } from './p2p/P2PConnection'
export { default as PeerManager } from './p2p/PeerManager'
export { default as P2PCharacterSharing } from './p2p/P2PCharacterSharing'

// Networking & Transport
export { default as WebSocketManager } from './transport/WebSocketManager'
export { default as WebRTCManager } from './transport/WebRTCManager'
export { default as MessageBroker } from './transport/MessageBroker'

// Collaboration Hooks (React)
export { default as useCollaboration } from './hooks/useCollaboration'
export { default as useSharedState } from './hooks/useSharedState'
export { default as usePresence } from './hooks/usePresence'
export { default as useMultiplayerChat } from './hooks/useMultiplayerChat'
export { default as usePeerConnection } from './hooks/usePeerConnection'

// Gaming & Interactive Features
export { default as MultiplayerGameEngine } from './gaming/MultiplayerGameEngine'
export { default as CharacterBattleArena } from './gaming/CharacterBattleArena'
export { default as CooperativeQuesting } from './gaming/CooperativeQuesting'
export { default as SharedWorldBuilder } from './gaming/SharedWorldBuilder'

// Event System
export { default as CollaborationEvents } from './events/CollaborationEvents'
export { default as EventSynchronizer } from './events/EventSynchronizer'

// Security & Permissions
export { default as CollaborationSecurity } from './security/CollaborationSecurity'
export { default as RoomPermissions } from './security/RoomPermissions'
export { default as UserAuthentication } from './security/UserAuthentication'

// Analytics & Monitoring
export { default as CollaborationAnalytics } from './analytics/CollaborationAnalytics'
export { default as SessionMetrics } from './analytics/SessionMetrics'

// Types and Interfaces
export * from './types'
export * from './interfaces'

// Configuration
export * from './config'

// Default Collaboration Configuration
export const COLLABORATION_CONFIG = {
  version: '1.0.0',
  features: {
    realTimeChat: true,
    sharedCharacterInteraction: true,
    collaborativeDesign: true,
    multiplayerGaming: true,
    peerToPeerSharing: true,
    voiceChat: true,
    screenSharing: true,
    sharedWhiteboard: true,
    presenceIndicators: true,
    conflictResolution: true
  },
  limits: {
    maxUsersPerSession: 50,
    maxConcurrentSessions: 1000,
    maxMessageRate: 10, // per second per user
    maxCharactersPerSession: 10,
    sessionTimeoutMinutes: 30
  },
  networking: {
    preferredTransport: 'websocket',
    fallbackToP2P: true,
    enableWebRTC: true,
    heartbeatInterval: 30000,
    reconnectAttempts: 3
  },
  security: {
    requireAuthentication: true,
    encryptMessages: true,
    rateLimiting: true,
    moderationEnabled: true,
    profanityFilter: true
  }
}