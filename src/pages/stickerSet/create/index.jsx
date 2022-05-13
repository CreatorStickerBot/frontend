import { useState } from 'react'
import { useHistory } from 'react-router-dom'

import { Button } from '@components/Button'
import { StickerCard } from '@components/StickerCard'

import { Api } from '@api'
import { routes } from '@routes'

import stylesCreate from './index.scss'
import styles from '../index.scss'

function StickerSetCreate () {
  const history = useHistory()
  const
    [title, setTitle] = useState(),
    [saving, setSaving] = useState(''),
    [stickers, setStickers] = useState([])

  function addSticker (sticker) {
    setStickers([...stickers, sticker])
  }

  function handleChangeTitle (event) {
    setTitle(event.target.value)
  }

  function save () {
    setSaving('Загружено изображений 0 из ' + stickers.length)
    const objCountLoadedImage = { val: 0 }
    let countLoadedImage = new Proxy(objCountLoadedImage, {
      set (target, key, value) {
        setSaving(`Загружено изображений ${value} из ${stickers.length}`)
        target[key] = value
        return true
      }
    })

    const awaitingSticker = stickers.map(async sticker => {
      const form = new FormData()
      form.append('pngSticker', sticker.image.file)
      const fileId = await Api.uploadImage(form)
      countLoadedImage.val += 1

      return {...sticker, fileId}
    })

    Promise.all(awaitingSticker).then(loadedStickers => {
      setSaving('Сохранение набора...')
      Api.setStickerSet(title, loadedStickers.map(s => ({fileId: s.fileId, emojis: s.emojis})))
        .then(res => {
          setSaving('Набор успешно сохранен. Через 10 секунд вы перейдете на страницу наборов')
          setTimeout(() => history.push(routes.stickerSet.path), 10000)
          window.open(res.url, '_blank')
        })
        .catch(alert)
    }).catch(alert)
  }

  return <>
    <div className={styles.container}>
      <div className={styles.header}>Создание нового набора</div>
      <div className={styles.content}>
        <div className={styles.actionsRow}>
          <div>
            <label htmlFor="stickerset-name-input" className={stylesCreate.labelInput}>Название:</label>
            <input id="stickerset-name-input" onChange={handleChangeTitle} className={stylesCreate.input} placeholder="Введите название" />
          </div>
          <Button disabled={!title || stickers.length < 1} onClick={save}>Сохранить</Button>
        </div>
        <div className={stylesCreate.rowHeaderCards}>
          <div>Для создание набора, нужно добавить минимум 1 стикер</div>
          <div>{stickers.length || 0} / 120</div>
        </div>
        <div className={stylesCreate.containerCards}>
          {stickers.map((sticker, i) => <StickerCard sticker={sticker} key={i.toString()} />)}
          <StickerCard creation addSticker={addSticker} />
        </div>
      </div>
    </div>
    {saving && (
      <div className={stylesCreate.savingContainer} data-text={saving} />
    )}
  </>
}

export default StickerSetCreate
