import 'regenerator-runtime/runtime'
import { Plugin as RollupPlugin } from 'rollup'
import { exec } from 'child_process'

export default function lnbi (): RollupPlugin {
  return {
    name: 'liferay-npm-bundler-improved',
    closeBundle: async (): Promise<void> => {
      console.log('liferay-npm-bundler-improved')
      exec('npm run bundle')
    }
  };
}

