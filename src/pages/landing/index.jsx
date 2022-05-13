import styles from './index.scss'
import { Link } from 'react-router-dom'
import {routes} from '@routes'

function Landing () {
  return <div className={styles.container}>
    <h1 className={styles.header}>
      Здравствуйте!
      <br /><br />
      Сейчас проходит закрытое тестирование концепции
      <br /><br />
      Если Вы участник закрытого тестирования, перейдите <Link to={routes.auth.path}>сюда</Link> пожалуйста.
    </h1>
  </div>
}

export default Landing
