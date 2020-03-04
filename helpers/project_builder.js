const { sdk } = require('@cto.ai/sdk')

const make_laravel = async (project_name) => {
    
    try {
        await sdk.exec('laravel new '+project_name+" --quiet")
        //await sdk.exec('composer create-project --prefer-dist laravel/laravel '+project_name)
    } catch(err) {
        sdk.log('Error building laravel project: ', err);    
        return "Failed";
    }
    return "Success";
}

const composer_install = async (project_name) => {
    try {
        await sdk.exec('cd '+project_name+' && composer install')
    } catch(err) {
        sdk.log("Error with composer install", err);
        return "Failed";
    }
    return "Success";
}

const npm_install = async (project_name) => {
    try {
        await sdk.exec('cd '+project_name+' && npm install')
    } catch(err) {
        sdk.log("npm install", err);
        return "Failed";
    }
    return "Success";
}

const run_cmd = async (cmd) => {
    try {
        await sdk.exec(cmd)
    } catch(err) {
        sdk.log("cmd failed: ", err);
        return "Failed";
    }
    return "Success";
}

const run_cmd_in_project = async (cmd, project_name) => {
    try {
        await sdk.exec("cd "+project_name+" && "+cmd)
    } catch(err) {
        sdk.log("cmd failed: ", err);
        return "Failed";
    }
    return "Success";
}


const base_packages = [
    "laravel/telescope",
    "laravel/ui",
    "laravel-shift/blueprint"
]

const ui_extensions = [
    {name: "None",has_auth: false },
    {name: "Bootstrap", has_auth: false},
    {name: "Vue", has_auth: false },
    {name: "React", has_auth: false },
    {name: "Bootstrap with auth", has_auth: true }, 
    {name: "Vue with auth",  has_auth: true },
    {name: "React with auth", has_auth: true },
]

module.exports = {
    make_laravel,
    composer_install,
    npm_install,
    run_cmd,
    base_packages,
    ui_extensions,
    run_cmd_in_project

}