#！/bin/sh
yarn install
id=`netstat -nlp | grep :4001 | awk '{print $7}' | awk -F"/" '{ print $1 }'`
kill -9 $id
yarn install
npm start 
