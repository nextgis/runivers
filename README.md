# russia-history

[Demo](http://213.248.47.89/static/ea960d4a9c1cbc99792ea6ed8425937a/asset/test/)

## Installation

```bash
git clone https://github.com/nextgis/russia-history.git
cd ./russia-history
npm i
# build prod version
npm run prod
# start development server
npm start
```

Add submodule to simplify the development process

```bash
git submodule update --init
# get latest version on nextgisweb_frontend submodule
cd ./nextgisweb_frontend
git checkout master
git pull origin master
```

In this case, the @nextgis libraries will be used from the submodule, not from the node_modules
