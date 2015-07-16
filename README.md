orion-cli
======

> Console scaffolding and development tool for Meteor Apps.


## How to install

```bash
npm install -g orion-cli
```
    
## How to use

### Creating apps

You can create meteor apps by using __orion create__, which downloads the [Meteor Boilerplate](https://github.com/matteodem/meteor-boilerplate).
__--blank__ or __-b__ let's you create a blank app (same as calling ```orion init```). 

```bash
orion create meteorApp
orion create -b blankApp
```

If you have a proxy, you need to set the ``http_proxy`` variable to access the repository.

```bash
export http_proxy=http://myproxy.net:myport
```

### Reset apps

You can reset the app to remove all the default code.

```bash
orion init
```

### Initializing exiting apps

Initialize Meteor Apps for use with scaffolding with following command.

```bash
cd existingMeteorApp
orion init
```

The resulting file orion-config.json under private/ has existing templates, list them by calling ```orion generate```. The configuration has following
structure.

```json
{
    "generate" : {
        "templateName" : {
            "default" : {
                "desc" : "description for template",
                "files" : ["private/templates/someFile.html"],
                "variables" : [
                    {
                        "name" : "templateVar",
                        "desc" : "templateQuestion"
                    }
                ]
            },
            "otherProfileName" : {
                "files" : ["private/templates/someOtherFile.html"]
            }
        }
    }
}
```

The template file also has one required line of configuration, which looks like following.

```html
<!-- { "path" : "client/views/__templateVar__.html" } -->
<template name="__templateVar__">
    <h1>This is the content</h1>
<template>
```

You can use the variables in the template, as long as the json configuration for the path is on the first line it'll recognize it.

### Generating files

You can create views, routes, models and more in the default configuration or change it and add more templates.

```bash
orion generate [entity] [name] [param]
```

Example:

```bash
orion generate view
orion generate routes
```

Advanced usage:

```bash
orion generate view name-of-view
orion generate routes category /category/:id
```

### Change profiles

The default profiles in the configuration are __es6__ and __coffee__, which generates other kind of files. You can also define your own profiles.

```bash
orion set-profile coffee
```
