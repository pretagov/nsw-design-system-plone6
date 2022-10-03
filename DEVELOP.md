# Developing

Before starting make sure your development environment is properly set. See [Volto Developer Documentation](https://docs.voltocms.com/getting-started/install/)

1. Make sure you have installed `yo`, `@plone/generator-volto` and `mrs-developer`

        npm install -g yo @plone/generator-volto mrs-developer

2. Create new volto app

        yo @plone/volto my-volto-project --addon nsw-design-system-plone6 --skip-install
        cd my-volto-project

3. Add the following to `mrs.developer.json`:

        {
            "nsw-design-system-plone6": {
                "url": "https://github.com/PretaGov/nsw-design-system-plone6.git",
                "package": "nsw-design-system-plone6",
                "branch": "main"
                "path": "src",
            }
        }


4. Install

        yarn develop
        yarn

5. Start backend

        docker pull plone
        docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone

    ...wait for backend to setup and start - `Ready to handle requests`:

        docker logs -f plone

    ...you can also check <http://localhost:8080/Plone>

6. Start frontend

        yarn start

7. Go to <http://localhost:3000>

8. Happy hacking!

        cd src/addons/nsw-design-system-plone6
