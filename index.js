const { ux, sdk } = require('@cto.ai/sdk')
// const { buildLaravelProject } = require('./helpers/project_builder')

async function main() {
  sdk.track(['scaffold-laravel'], {
    event: 'began workflow',
  })
  
  let prompt_main = await ux.prompt({
    type: 'input',
    name: 'project_name',
    message: 'What would you like to call the project?',
  })
  
  // let project_built = buildLaravelProject(prompt_main.project_name);
  await ux.print("Project Name = "+prompt_main.project_name);
  // if (project_built)
  // {
  //   await ux.print("Initial Project Created - Let's talk packages");
  // } else {
  //   await ux.print("Hmm... There seem to be some errors.  maybe the project name wasn't available or was invalid")
  // }
    

}
main()
