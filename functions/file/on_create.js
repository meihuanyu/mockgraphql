
import md5 from 'md5'
import db from '../../config/database'
import fs from 'fs'
import shortid from 'shortid'

module.exports =async function(params,tableName,root){
    const _file = await params.file
    const { createReadStream, filename, mimetype, capacitor } = _file
    const stream = createReadStream()
    const { id, path } = await storeFS({ stream, filename })
    
    return {id, path,filename,capacitor.bytesWritten}
}
const UPLOAD_DIR = './uploads'

const storeFS = ({ stream, filename }) => {
    const id = shortid.generate()
    const path = `${UPLOAD_DIR}/${id}-${filename}`
    return new Promise((resolve, reject) =>
      stream
        .on('error', error => {
          if (stream.truncated)
            // Delete the truncated file
            fs.unlinkSync(path)
          reject(error)
        })
        .pipe(fs.createWriteStream(path))
        .on('error', error => reject(error))
        .on('finish', () => resolve({ id, path }))
    )
  }