#！/bin/sh
cd ./webapp
rm -rf ./node_modules
yarn install 
npm run build   --max-old-space-size=600