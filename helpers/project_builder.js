import { sdk, ux } from '@cto.ai/sdk'
import Debug from debug

export const buildLaravelProject = async (project_name) => {
    try {
        sdk.track(['scaffold-laravel', 'build-laravel-project'], {
            event: 'buildLaravelProject - started',
        })
        const { stdout, stderr } = await sdk.exec('laravel new '+question.project_name)
        sdk.log('stdout is:\n', stdout)
        sdk.log('stderr is:\n', stderr)
        
        sdk.track(['scaffold-laravel', 'build-laravel-project'], {
            event: 'buildLaravelProject - done',
        })
        return true;
    } catch (err) {
        debug('There was an error creating the Laravel Project', err);
        sdk.track(['scaffold-laravel', 'build-laravel-project'], {
            event: 'buildLaravelProject - failed',
        })
        return false;
    }
}
