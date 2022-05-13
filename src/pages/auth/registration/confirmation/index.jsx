import { useContext } from 'react'
import { Redirect, useHistory, useParams } from 'react-router-dom'

import { Button } from '@components/Button'

import { Api } from '@api'
import { Store } from '@store'
import { routes } from '@routes'

import styles from '../../index.scss'

export default function Confirmation () {
  const { id, username } = useParams()
  const { user } = useContext(Store)
  const history = useHistory()

  if (user) {
    return <Redirect to={routes.stickerSet.path} />
  }

  function submitCode (event) {
    event.preventDefault()

    if (!event.target.code.value) return

    Api.confirmation(event.target.code.value, id)
      .then(() => {
        alert('Подтверждение прошло успешно.\nПоздравляем с регистрацией!')
        history.push(routes.auth.path)
      })
      .catch(alert)
  }

  function listenCode (event) {
    const code = event.target

    code.value = code.value.replace(/\D/gi, '')
    if (code.value.length > 6)
      code.value = code.value.slice(0, 6)

    if (code.value.length === 6)
      document.forms['confirmation'].button.disabled = false
  }

  return <div className={styles.container}>
    <form className={styles.form} onSubmit={submitCode} name="confirmation">
      <h1>Подтверждение</h1>
      <h3>
        Напишите пожалуйста нашем боту
        <a href="https://t.me/creator_stickers_bot" target="_blank"> @creator_stickers_bot</a> с своего аккаунта
        <a href={`https://t.me/${username}`} target="_blank"> @{username}</a>,
        и он отправит Вам код подтверждения
      </h3>
      <div className={styles.inputBlock}>
        <div className={styles.inputContainer}>
          <input name="code" className={styles.input} placeholder="Введите код" onInput={listenCode} />
        </div>
      </div>
      <div className={styles.actionsBlock}>
        <Button name="button" disabled>Подтвердить</Button>
      </div>
    </form>
  </div>
}
