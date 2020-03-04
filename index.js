const { ux, sdk } = require('@cto.ai/sdk');
const builder = require('./helpers/project_builder');

async function main() {
  sdk.track(['scaffold-laravel'], {
    event: 'began workflow',
  })

  await ux.print("Ok - Let's start with a few questions")

  let project_name_prompt = await ux.prompt({
    type: 'input',
    name: 'response',
    message: 'What would you like to call the project? (use project name rules, no spaces etc)',
  })

  //TODO - I need to implement some validation on this to ensure it's a valid project name
  let project_name = project_name_prompt.response;

  await ux.print("Great, let's talk packages");

  const { other_packages } = await ux.prompt({
    type: "checkbox",
    name: "other_packages",
    message: "What other packages would you like installed?",
    choices: builder.base_packages,
  })

  let has_laravel_ui = false;
  let laravel_ui_command = "";
  let get_auth_tests = false;

  for (const pkg_to_pull of other_packages)
  {
    if (pkg_to_pull == "laravel/ui")
    {
      has_laravel_ui = true;
    }
  }

  //Laravel UI Block
  if (has_laravel_ui) {
    const { laravel_ui_commands } = await ux.prompt({
      type: "list",
      name: "laravel_ui_commands",
      message: "What command do you want to run with the laravel/ui package?",
      default: "None",
      choices: builder.ui_extensions.map(pkg => pkg.name),
    })
    laravel_ui_command = laravel_ui_commands;


    const ui_extension = builder.ui_extensions.find(pkg => pkg.name == laravel_ui_commands);
    if (ui_extension.has_auth)
    {
      const { pull_in_auth_tests } = await ux.prompt({
        type: "confirm",
        name: "pull_in_auth_tests",
        flag: "V",
        message: "Do you want to pull in DCzajkowski/auth-tests ?"
      })
      if (pull_in_auth_tests)
      {
        get_auth_tests = true;
      }
    }
  }

  await ux.print("Ok - got it!")
  await ux.print("We're going to build your new project: " + project_name)
  await ux.print("Then we'll pull in the packages:")
  
  for (const pkg_to_pull of other_packages) {
    await ux.print(` - ${pkg_to_pull}`)
  }

  if (has_laravel_ui) {
    if (laravel_ui_command == "None") {
      await ux.print("We're not going to run any of the scaffolding commands for laravel/ui so you'll have to do that yourself after we're finished")
    } else {
      await ux.print(`We're going to scaffold out ${laravel_ui_command} using the laravel/ui package`)

      if (get_auth_tests)
      {
        await ux.print(`We're also going to grab the DCzajkowski/auth-tests package so you can get started quickly for auth testing`);
      }
    }
  }


  const { build_is_good } = await ux.prompt({
    type: "confirm",
    name: "build_is_good",
    flag: "V",
    message: "Does all that sound right?  (the build can take a minute or two)"
  })
  if (build_is_good)
  {
    await ux.print("Ok - now building🛠  - This may be a good time for a ☕ break")
  
    await ux.spinner.start('Creating Laravel Project...')
    await builder.make_laravel(project_name)
    await ux.spinner.stop('Laravel Project Created!')

    await ux.spinner.start('Running a composer install...')
    await builder.composer_install(project_name)
    await ux.spinner.stop('composer install finished successfully!')

    await ux.spinner.start('Running a npm install...')
    await builder.npm_install(project_name)
    await ux.spinner.start('npm install finished successfully!')
     

    for (const pkg in other_packages) {
      if (pkg == "laravel-shift/blueprint")  {
        await ux.spinner.start('Pulling in Blueprint - Make sure you checkout https://github.com/laravel-shift/blueprint to see how to draft models')
        await builder.run_cmd_in_project("composer require --dev laravel-shift/blueprint", project_name)
        await builder.run_cmd_in_project('echo "Make sure you checkout https://github.com/laravel-shift/blueprint to see how to draft models" > blueprint_draft.yaml', project_name)
        await ux.spinner.stop('Blueprint Pulled in - make sure you checkout https://github.com/laravel-shift/blueprint to see how to draft models')
      }

      if (pkg == "laravel/telescope") {
        await ux.spinner.start("Pulling & installing laravel/telescope - ❗ Don't forget to migrate your database after all this is over")
        await builder.run_cmd_in_project('composer require laravel/telescope', project_name)
        await builder.run_cmd_in_project('php artisan telescope:install', project_name)
        await ux.spinner.start("laravel/telescope installed")
      }
    }

    if (has_laravel_ui) {
      await ux.spinner.start("Pulling in laravel/ui...")
      await builder.run_cmd_in_project('composer require laravel/ui "^2.0" --dev', project_name)
      await ux.spinner.stop("laravel/ui pulled")
      if (laravel_ui_command == "Bootstrap") {
        await ux.spinner.start("Running bootstrap scaffolding")
        await builder.run_cmd_in_project("php artisan ui bootstrap", project_name)
        await ux.spinner.stop("bootstrap scaffolding complete")
      } else if (laravel_ui_command == "Vue") {
        await ux.spinner.start("Running vue scaffolding")
        await builder.run_cmd_in_project("php artisan ui vue", project_name)
        await ux.spinner.stop("vue scaffolding complete")
      } else if (laravel_ui_command == "React") {
        await ux.spinner.start("Running react scaffolding")
        await builder.run_cmd_in_project("php artisan ui react", project_name)
        await ux.spinner.stop("react scaffolding complete")
      } else if (laravel_ui_command == "Bootstrap with auth") {
        await ux.spinner.start("Running bootstrap scaffolding")
        await builder.run_cmd_in_project("php artisan ui bootstrap --auth", project_name)
        await ux.spinner.stop("bootstrap scaffolding complete")
      } else if (laravel_ui_command == "Vue with auth") {
        await ux.spinner.start("Running vue scaffolding")
        await builder.run_cmd_in_project("php artisan ui vue --auth", project_name)
        await ux.spinner.stop("vue scaffolding complete")
      } else if (laravel_ui_command == "React with auth") {
        await ux.spinner.start("Running react scaffolding")
        await builder.run_cmd_in_project("php artisan ui react --auth", project_name)
        await ux.spinner.stop("react scaffolding complete")
      }
      if (get_auth_tests)
      {
        await ux.spinner.start("Pulling in Auth Tests")
        await builder.run_cmd_in_project("composer require dczajkowski/auth-tests --dev", project_name)
        await builder.run_cmd_in_project("php artisan make:auth-tests --without-email-verification", project_name)
        await ux.spinner.start("Auth Tests Installed")
      }
    }



  }


}
main()
