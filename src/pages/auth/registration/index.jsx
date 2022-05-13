import { useContext, useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import classNames from 'classnames'

import { Link } from '@components/Link'
import { Button } from '@components/Button'

import { Store } from '@store'
import { Api } from '@api'
import { routes } from '@routes'

import styles from '../index.scss'

export default function registration () {
  const history = useHistory()
  const { user } = useContext(Store)
  const { errorRepeatPassword, setErrorRepeatPassword } = useState(false)

  if (user) {
    return <Redirect to={routes.stickerSet.path} />
  }

  function submitForm (event) {
    event.preventDefault()
    const form = event.target
    const {
      username: { value: username },
      password: { value: password },
      repeatPassword: { value: repeatPassword }
    } = form

    if (username && password && repeatPassword) {
      if (password !== repeatPassword) {
        setErrorRepeatPassword(true)
        setTimeout(() => setErrorRepeatPassword(false), 5000)
        return false
      }

      Api.registration(username, password, repeatPassword)
        .then(res => {
          history.push(routes.confirmation.path.replace(':id', res.id).replace(':username', res.username))
        })
        .catch((e) => alert(JSON.stringify(e)))
    }
  }

  return <div className={styles.container}>
    <form className={styles.form} onSubmit={submitForm}>
      <h1>Регистрация</h1>
      <div className={styles.inputBlock}>
        <div className={styles.inputContainer}>
          <h4>Введите Ваш @username без <code>@</code> из Telegram</h4>
          <input name="username" className={styles.input} placeholder="Username" required />
        </div>
        <div className={styles.inputContainer}>
          <h4>Придумайте пароль</h4>
          <input name="password" className={styles.input} placeholder="Password" type="password" required />
        </div>
        <div className={styles.inputContainer}>
          <h4>Повторите пароль</h4>
          <input name="repeatPassword" className={styles.input} placeholder="Repeat password" type="password" required />
          {errorRepeatPassword && <div className={styles.inputError}>Пароли не совпадаются</div>}
        </div>
      </div>
      <div className={styles.actionsBlock}>
        <div className={classNames(styles.links, styles.center)}>
          <Link to={routes.auth.path}>Уже есть аккаунт?</Link>
        </div>
        <Button>Зарегистрироваться</Button>
      </div>
    </form>
  </div>
}
