import { promisify } from 'util'
import { copyFile } from 'fs'
import { sep } from 'path'
import DeploymentException from '../exceptions/DeploymentException'

export class DeploymentHandler {
  async deploy (deploymentPath: string, jarPath: string, jarName: string): Promise<void> {
    let fullDeploymentPath = deploymentPath
    if (!deploymentPath.endsWith('/')) {
      fullDeploymentPath = `${deploymentPath}${sep}`
    }

    try {
      await promisify(copyFile)(jarPath, `${fullDeploymentPath}${jarName}.jar`)
    } catch (error) {
      throw new DeploymentException(`Could not deploy ${jarName}.jar to ${fullDeploymentPath}`)
    }
  }
}
