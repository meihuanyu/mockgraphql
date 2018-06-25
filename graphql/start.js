import schema from './graphqlQuery';
import { querySchme } from '../controllers/structure'

const xx=new schema()
const _schema=xx.startSchema(querySchme)
export default _schema
