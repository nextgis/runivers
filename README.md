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
cd ./@nextgis
git checkout master
git pull origin master
```

In this case, the @nextgis libraries will be used from the submodule, not from the node_modules

## Docker

```bash
docker build -t registry.gitlab.com/nextgis/ngwdocker/runivers:6.2.0 -f ./docker/Dockerfile .

docker run -it -p 8080:8080 --rm --name runivers registry.gitlab.com/nextgis/ngwdocker/runivers:6.2.0

docker push registry.gitlab.com/nextgis/ngwdocker/runivers:6.2.0
```
