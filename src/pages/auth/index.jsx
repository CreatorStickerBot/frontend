import { useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { Button } from '@components/Button'
import { Link } from '@components/Link'

import { Api } from '@api'
import { Store } from '@store'
import { routes } from '@routes'

import styles from './index.scss'

export default function auth () {
  const { user, setUser } = useContext(Store)

  if (user) {
    return <Redirect to={routes.stickerSet.path} />
  }

  function submitForm (event) {
    event.preventDefault()

    const form = event.target
    const {
      username: { value: username },
      password: { value: password }
    } = form

    if (username && password) {
      Api.auth(username, password)
        .then(setUser)
        .catch(alert)
    }
  }

  return <div className={styles.container}>
    <form className={styles.form} onSubmit={submitForm}>
      <h1>Вход</h1>
      <div className={styles.inputBlock}>
        <div className={styles.inputContainer}>
          <input name="username" className={styles.input} placeholder="Username" required />
        </div>
        <div className={styles.inputContainer}>
          <input name="password" className={styles.input} placeholder="Password" type="password" required />
        </div>
      </div>
      <div className={styles.actionsBlock}>
        <div className={styles.links}>
          <Link to={routes.registration.path}>Еще нет аккаунта?</Link>
          {/*<Link to="#">Забыли пароль?</Link>*/}
        </div>
        <Button>Войти</Button>
      </div>
    </form>
  </div>
}
