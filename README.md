# russia-history

This cartographic project contains historical geodata about the political boundaries of modern Russia from 1462-2018.

[Web site](http://map.runivers.ru)

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
# get latest version on nextgis_frontend submodule
cd ./nextgis_frontend
git checkout master
git pull origin master
```

In this case, the @nextgis libraries will be used from the submodule, not from the node_modules

## Docker

```bash
docker build -t registry.nextgis.com/runivers:4.0.3 .
docker build -t registry.nextgis.com/runivers:4.0.3 .
docker run -it -p 8080:8080 --rm --name code-nextgis-1 registry.nextgis.com/runivers:latest

docker push registry.nextgis.com/runivers:0.0.0
docker push registry.nextgis.com/runivers:latest
```
