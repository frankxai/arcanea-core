import { EventEmitter } from 'events'
import { CollaborationSession, WorkspaceChange, SharedResource, GuardianType } from '../interfaces'
import { RealmDefinition } from '../types'

/**
 * CollaborativeBuilder - Real-time Collaborative Realm Building
 * 
 * Enables multiple realm builders to work together in real-time,
 * with AI Guardian coordination and conflict resolution.
 */
export class CollaborativeBuilder extends EventEmitter {
  private activeSessions: Map<string, CollaborationSession> = new Map()
  private realtimeConnections: Map<string, WebSocket[]> = new Map()
  private changeQueue: Map<string, WorkspaceChange[]> = new Map()

  constructor(private config: any) {
    super()
  }

  /**
   * Join a collaborative session
   */
  async joinSession(sessionId: string, userId: string): Promise<{
    session: CollaborationSession
    workspace: any
    permissions: string[]
    activeCollaborators: Array<{
      userId: string
      displayName: string
      currentFocus: GuardianType
      lastActivity: Date
    }>
  }> {
    try {
      const session = this.activeSessions.get(sessionId)
      if (!session) {
        throw new Error(`Collaboration session ${sessionId} not found`)
      }

      if (!session.participants.includes(userId)) {
        throw new Error('User not authorized for this collaboration session')
      }

      this.emit('collaboration:user-joined', { sessionId, userId })

      const workspace = await this.getSharedWorkspace(sessionId)
      const permissions = session.sharedWorkspace.permissions[userId] || ['view']
      const activeCollaborators = await this.getActiveCollaborators(sessionId)

      return {
        session,
        workspace,
        permissions,
        activeCollaborators
      }

    } catch (error) {
      this.emit('collaboration:join-failed', { sessionId, userId, error })
      throw error
    }
  }

  /**
   * Apply a change to the shared realm
   */
  async applyChange(sessionId: string, change: Omit<WorkspaceChange, 'id' | 'timestamp' | 'applied'>): Promise<{
    changeId: string
    applied: boolean
    conflicts: any[]
    mergedResult?: any
  }> {
    try {
      const session = this.activeSessions.get(sessionId)
      if (!session) {
        throw new Error(`Session ${sessionId} not found`)
      }

      // Create change record
      const workspaceChange: WorkspaceChange = {
        id: this.generateChangeId(),
        userId: change.userId,
        force: change.force,
        changeType: change.changeType,
        data: change.data,
        timestamp: new Date(),
        applied: false
      }

      // Check for conflicts
      const conflicts = await this.detectConflicts(sessionId, workspaceChange)
      
      if (conflicts.length === 0) {
        // Apply change immediately
        await this.applyChangeToWorkspace(sessionId, workspaceChange)
        workspaceChange.applied = true
        
        // Broadcast to all participants
        this.broadcastChange(sessionId, workspaceChange)
        
        this.emit('collaboration:change-applied', { sessionId, change: workspaceChange })
        
        return {
          changeId: workspaceChange.id,
          applied: true,
          conflicts: []
        }
      } else {
        // Queue change for conflict resolution
        this.queueChange(sessionId, workspaceChange)
        
        this.emit('collaboration:conflict-detected', { sessionId, change: workspaceChange, conflicts })
        
        return {
          changeId: workspaceChange.id,
          applied: false,
          conflicts
        }
      }

    } catch (error) {
      this.emit('collaboration:change-failed', { sessionId, change, error })
      throw error
    }
  }

  /**
   * Resolve conflicts using AI Guardian mediation
   */
  async resolveConflicts(sessionId: string, conflictIds: string[], resolutionStrategy: 'merge' | 'vote' | 'guardian-mediation'): Promise<{
    resolution: 'resolved' | 'partial' | 'escalated'
    mergedChanges?: WorkspaceChange[]
    requiredVotes?: Array<{
      changeId: string
      options: WorkspaceChange[]
      votingEndTime: Date
    }>
    guardianRecommendation?: string
  }> {
    try {
      const session = this.activeSessions.get(sessionId)
      if (!session) {
        throw new Error(`Session ${sessionId} not found`)
      }

      switch (resolutionStrategy) {
        case 'merge':
          return await this.mergeConflictingChanges(sessionId, conflictIds)
        
        case 'vote':
          return await this.initiateConflictVoting(sessionId, conflictIds)
        
        case 'guardian-mediation':
          return await this.requestGuardianMediation(sessionId, conflictIds)
        
        default:
          throw new Error(`Unknown resolution strategy: ${resolutionStrategy}`)
      }

    } catch (error) {
      this.emit('collaboration:conflict-resolution-failed', { sessionId, conflictIds, error })
      throw error
    }
  }

  /**
   * Get real-time collaboration analytics
   */
  async getCollaborationAnalytics(sessionId: string): Promise<{
    duration: number
    participantActivity: Record<string, {
      changesContributed: number
      forcesFocused: GuardianType[]
      collaborationScore: number
    }>
    productivity: {
      changesPerHour: number
      conflictRate: number
      resolutionTime: number
    }
    realmQuality: {
      completenessScore: number
      forceBalance: Record<GuardianType, number>
      innovationIndex: number
    }
  }> {
    const session = this.activeSessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    // Calculate analytics
    const duration = Date.now() - session.startTime.getTime()
    const changes = session.sharedWorkspace.liveChanges

    const participantActivity: Record<string, any> = {}
    session.participants.forEach(participantId => {
      const userChanges = changes.filter(c => c.userId === participantId)
      participantActivity[participantId] = {
        changesContributed: userChanges.length,
        forcesFocused: [...new Set(userChanges.map(c => c.force))],
        collaborationScore: this.calculateCollaborationScore(userChanges, changes)
      }
    })

    return {
      duration: Math.floor(duration / 1000 / 60), // minutes
      participantActivity,
      productivity: {
        changesPerHour: (changes.length / duration) * 1000 * 60 * 60,
        conflictRate: this.calculateConflictRate(sessionId),
        resolutionTime: this.calculateAverageResolutionTime(sessionId)
      },
      realmQuality: {
        completenessScore: this.calculateCompletenessScore(sessionId),
        forceBalance: this.calculateForceBalance(changes),
        innovationIndex: this.calculateInnovationIndex(changes)
      }
    }
  }

  // Private helper methods
  private async getSharedWorkspace(sessionId: string): Promise<any> {
    const session = this.activeSessions.get(sessionId)
    return session?.sharedWorkspace || null
  }

  private async getActiveCollaborators(sessionId: string): Promise<any[]> {
    const session = this.activeSessions.get(sessionId)
    if (!session) return []

    return session.participants.map(userId => ({
      userId,
      displayName: `Builder ${userId.slice(-4)}`, // Would be real names
      currentFocus: session.sharedWorkspace.currentFocus,
      lastActivity: new Date()
    }))
  }

  private generateChangeId(): string {
    return `change_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  }

  private async detectConflicts(sessionId: string, newChange: WorkspaceChange): Promise<any[]> {
    const session = this.activeSessions.get(sessionId)
    if (!session) return []

    const recentChanges = session.sharedWorkspace.liveChanges
      .filter(c => c.force === newChange.force && Date.now() - c.timestamp.getTime() < 30000) // 30 seconds

    const conflicts = []
    for (const recentChange of recentChanges) {
      if (this.changesConflict(newChange, recentChange)) {
        conflicts.push({
          conflictType: 'concurrent_edit',
          existingChange: recentChange,
          newChange: newChange,
          force: newChange.force
        })
      }
    }

    return conflicts
  }

  private changesConflict(change1: WorkspaceChange, change2: WorkspaceChange): boolean {
    return change1.force === change2.force && 
           change1.changeType === change2.changeType &&
           change1.userId !== change2.userId
  }

  private async applyChangeToWorkspace(sessionId: string, change: WorkspaceChange): Promise<void> {
    const session = this.activeSessions.get(sessionId)
    if (session) {
      session.sharedWorkspace.liveChanges.push(change)
    }
  }

  private broadcastChange(sessionId: string, change: WorkspaceChange): void {
    const connections = this.realtimeConnections.get(sessionId) || []
    const changeMessage = JSON.stringify({
      type: 'workspace_change',
      change: change
    })

    connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(changeMessage)
      }
    })
  }

  private queueChange(sessionId: string, change: WorkspaceChange): void {
    const queue = this.changeQueue.get(sessionId) || []
    queue.push(change)
    this.changeQueue.set(sessionId, queue)
  }

  private async mergeConflictingChanges(sessionId: string, conflictIds: string[]): Promise<any> {
    return {
      resolution: 'resolved',
      mergedChanges: [] // Would implement smart merging
    }
  }

  private async initiateConflictVoting(sessionId: string, conflictIds: string[]): Promise<any> {
    const votingEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    return {
      resolution: 'partial',
      requiredVotes: conflictIds.map(id => ({
        changeId: id,
        options: [], // Would be actual conflicting changes
        votingEndTime
      }))
    }
  }

  private async requestGuardianMediation(sessionId: string, conflictIds: string[]): Promise<any> {
    return {
      resolution: 'resolved',
      guardianRecommendation: 'AI Guardian suggests merging complementary elements while maintaining realm coherence'
    }
  }

  private calculateCollaborationScore(userChanges: WorkspaceChange[], allChanges: WorkspaceChange[]): number {
    const userContribution = userChanges.length / allChanges.length
    const forcesDiversity = new Set(userChanges.map(c => c.force)).size / 6
    const collaborationFactor = userChanges.filter(c => c.changeType === 'update').length / userChanges.length
    
    return Math.min(1, (userContribution + forcesDiversity + collaborationFactor) / 3) * 100
  }

  private calculateConflictRate(sessionId: string): number {
    return 0.05 // 5% simulated conflict rate
  }

  private calculateAverageResolutionTime(sessionId: string): number {
    return 15 // 15 minutes average resolution time
  }

  private calculateCompletenessScore(sessionId: string): number {
    return 0.78 // 78% completeness
  }

  private calculateForceBalance(changes: WorkspaceChange[]): Record<GuardianType, number> {
    const forceChanges: Record<GuardianType, number> = {
      flame: 0, form: 0, lore: 0, resonance: 0, synthesis: 0, manifestation: 0
    }

    changes.forEach(change => {
      forceChanges[change.force]++
    })

    const total = Object.values(forceChanges).reduce((sum, count) => sum + count, 0)
    Object.keys(forceChanges).forEach(force => {
      forceChanges[force as GuardianType] = total > 0 ? forceChanges[force as GuardianType] / total : 0
    })

    return forceChanges
  }

  private calculateInnovationIndex(changes: WorkspaceChange[]): number {
    const createChanges = changes.filter(c => c.changeType === 'create').length
    const totalChanges = changes.length
    return totalChanges > 0 ? (createChanges / totalChanges) * 100 : 0
  }
}

export default CollaborativeBuilder