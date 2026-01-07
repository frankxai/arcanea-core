import { EventEmitter } from 'events'
import { ManifestationResult, DeploymentPlan, DigitalPresence, PhysicalPresence, BusinessPresence } from '../types'
import { DigitalManifester } from '../manifestation/DigitalManifester'
import { PhysicalManifester } from '../manifestation/PhysicalManifester'
import { BusinessManifester } from '../manifestation/BusinessManifester'

/**
 * ManifestationEngine - Transforms realm definitions into reality
 * 
 * The specialized engine that takes complete realm definitions and
 * deploys them into the physical and digital world through coordinated
 * manifestation strategies.
 */
export class ManifestationEngine extends EventEmitter {
  private digitalManifester: DigitalManifester
  private physicalManifester: PhysicalManifester
  private businessManifester: BusinessManifester
  private manifestationQueue: Map<string, ManifestationJob> = new Map()

  constructor(config: any) {
    super()
    this.digitalManifester = new DigitalManifester(config.manifestation.digital)
    this.physicalManifester = new PhysicalManifester(config.manifestation.physical)
    this.businessManifester = new BusinessManifester(config.manifestation.business)
  }

  /**
   * Execute complete manifestation process
   */
  async executeManifestationPlan(plan: DeploymentPlan, realmId: string): Promise<{
    digitalDeployment: any
    physicalDeployment: any
    businessDeployment: any
    manifestationUrl: string
    status: 'success' | 'partial' | 'failed'
    timeline: Date[]
  }> {
    try {
      const jobId = this.createManifestationJob(realmId, plan)
      this.emit('manifestation:execution-started', { jobId, realmId, plan })

      // Execute manifestation phases in parallel where possible
      const [digitalResult, physicalResult, businessResult] = await Promise.allSettled([
        this.manifestDigitalPresence(plan.digital_presence, realmId),
        this.manifestPhysicalPresence(plan.physical_presence, realmId),
        this.manifestBusinessModel(plan.business_model, realmId)
      ])

      // Process results
      const deploymentResults = this.processManifestationResults({
        digital: digitalResult,
        physical: physicalResult,
        business: businessResult
      })

      // Generate manifestation URL
      const manifestationUrl = plan.primary_url || this.generateManifestationUrl(realmId)

      // Update job status
      this.updateManifestationJob(jobId, 'completed', deploymentResults)

      this.emit('manifestation:execution-completed', {
        jobId,
        realmId,
        results: deploymentResults,
        manifestationUrl
      })

      return {
        digitalDeployment: deploymentResults.digital,
        physicalDeployment: deploymentResults.physical,
        businessDeployment: deploymentResults.business,
        manifestationUrl,
        status: deploymentResults.status,
        timeline: deploymentResults.timeline
      }

    } catch (error) {
      this.emit('manifestation:execution-failed', { realmId, error })
      throw new Error(`Manifestation execution failed: ${error}`)
    }
  }

  /**
   * Monitor manifestation progress
   */
  async getManifestationStatus(jobId: string): Promise<{
    status: 'queued' | 'in-progress' | 'completed' | 'failed'
    progress: Record<string, number>
    currentPhase: string
    estimatedCompletion: Date
    errors: string[]
  }> {
    const job = this.manifestationQueue.get(jobId)
    if (!job) {
      throw new Error(`Manifestation job ${jobId} not found`)
    }

    return {
      status: job.status,
      progress: job.progress,
      currentPhase: job.currentPhase,
      estimatedCompletion: job.estimatedCompletion,
      errors: job.errors
    }
  }

  /**
   * Get all active manifestations
   */
  getActiveManifestations(): Array<{
    jobId: string
    realmId: string
    status: string
    startTime: Date
    progress: number
  }> {
    return Array.from(this.manifestationQueue.values())
      .filter(job => job.status === 'in-progress')
      .map(job => ({
        jobId: job.id,
        realmId: job.realmId,
        status: job.status,
        startTime: job.startTime,
        progress: this.calculateOverallProgress(job.progress)
      }))
  }

  /**
   * Cancel a manifestation in progress
   */
  async cancelManifestation(jobId: string): Promise<void> {
    const job = this.manifestationQueue.get(jobId)
    if (!job) {
      throw new Error(`Manifestation job ${jobId} not found`)
    }

    if (job.status === 'completed') {
      throw new Error('Cannot cancel completed manifestation')
    }

    // Cancel ongoing manifestation processes
    await Promise.allSettled([
      this.digitalManifester.cancelDeployment(jobId),
      this.physicalManifester.cancelDeployment(jobId),
      this.businessManifester.cancelDeployment(jobId)
    ])

    this.updateManifestationJob(jobId, 'cancelled', {})
    this.emit('manifestation:cancelled', { jobId })
  }

  // Private manifestation methods
  private async manifestDigitalPresence(presence: DigitalPresence, realmId: string): Promise<any> {
    return await this.digitalManifester.deployDigitalPresence(presence, realmId)
  }

  private async manifestPhysicalPresence(presence: PhysicalPresence, realmId: string): Promise<any> {
    return await this.physicalManifester.deployPhysicalPresence(presence, realmId)
  }

  private async manifestBusinessModel(business: any, realmId: string): Promise<any> {
    return await this.businessManifester.deployBusinessModel(business, realmId)
  }

  private createManifestationJob(realmId: string, plan: DeploymentPlan): string {
    const jobId = `manifest_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    
    const job: ManifestationJob = {
      id: jobId,
      realmId,
      plan,
      status: 'queued',
      progress: {
        digital: 0,
        physical: 0,
        business: 0
      },
      currentPhase: 'initialization',
      startTime: new Date(),
      estimatedCompletion: this.calculateEstimatedCompletion(plan),
      errors: []
    }

    this.manifestationQueue.set(jobId, job)
    return jobId
  }

  private updateManifestationJob(jobId: string, status: string, results: any): void {
    const job = this.manifestationQueue.get(jobId)
    if (job) {
      job.status = status as any
      job.results = results
      job.endTime = new Date()
    }
  }

  private processManifestationResults(results: {
    digital: PromiseSettledResult<any>
    physical: PromiseSettledResult<any>
    business: PromiseSettledResult<any>
  }): any {
    const processedResults = {
      digital: results.digital.status === 'fulfilled' ? results.digital.value : null,
      physical: results.physical.status === 'fulfilled' ? results.physical.value : null,
      business: results.business.status === 'fulfilled' ? results.business.value : null,
      errors: [] as string[],
      timeline: [] as Date[]
    }

    // Collect errors
    if (results.digital.status === 'rejected') {
      processedResults.errors.push(`Digital manifestation failed: ${results.digital.reason}`)
    }
    if (results.physical.status === 'rejected') {
      processedResults.errors.push(`Physical manifestation failed: ${results.physical.reason}`)
    }
    if (results.business.status === 'rejected') {
      processedResults.errors.push(`Business manifestation failed: ${results.business.reason}`)
    }

    // Determine overall status
    const successCount = [results.digital, results.physical, results.business]
      .filter(r => r.status === 'fulfilled').length

    let status: 'success' | 'partial' | 'failed'
    if (successCount === 3) {
      status = 'success'
    } else if (successCount > 0) {
      status = 'partial'
    } else {
      status = 'failed'
    }

    return { ...processedResults, status }
  }

  private generateManifestationUrl(realmId: string): string {
    return `https://${realmId.replace(/_/g, '-')}.arcanea.app`
  }

  private calculateEstimatedCompletion(plan: DeploymentPlan): Date {
    // Parse build estimate and calculate completion time
    const buildEstimate = plan.build_estimate
    let months = 6 // Default

    if (buildEstimate.includes('2-4 months')) months = 3
    else if (buildEstimate.includes('4-8 months')) months = 6
    else if (buildEstimate.includes('8-12 months')) months = 10

    const completion = new Date()
    completion.setMonth(completion.getMonth() + months)
    return completion
  }

  private calculateOverallProgress(progress: Record<string, number>): number {
    const values = Object.values(progress)
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }
}

interface ManifestationJob {
  id: string
  realmId: string
  plan: DeploymentPlan
  status: 'queued' | 'in-progress' | 'completed' | 'failed' | 'cancelled'
  progress: Record<string, number>
  currentPhase: string
  startTime: Date
  endTime?: Date
  estimatedCompletion: Date
  errors: string[]
  results?: any
}

export default ManifestationEngine