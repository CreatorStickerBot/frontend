import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { LoaderFullScreen } from '@components/LoaderFullScreen'
import { LoadingText } from '@components/LoadingText'
import { StickerCard } from '@components/StickerCard'
import { Button } from '@components/Button'

import { Api } from '@api'
import { routes } from '@routes'

import styles from '../../index.scss'
import stylesCreate from '../../create/index.scss'

function StickerSetUpdateAdd () {
  const history = useHistory()
  const { stickerSetId } = useParams()
  const
    [ stickerSet, setStickerSet ] = useState({}),
    [ loading, setLoading ] = useState(true),
    [stickers, setStickers] = useState([]),
    [saving, setSaving] = useState('')

  useEffect(() => {
    Api.getStickerSetById(stickerSetId).then(async resStickerSet => {
      setStickerSet(resStickerSet)
      setLoading(false)

    }).catch(err => {
      if (err === 404) {
        alert('Такого набора не существует')
        history.push(routes.stickerSet.path)
      } else
        alert(err.response.message)
    })
  }, [])

  /**
   * @param {{ image: {file:File}, emojis: array }} sticker
   */
  function addSticker (sticker) {
    setStickers([...stickers, sticker])
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
      Api.addStickerToSet(stickerSetId, loadedStickers.map(s => ({fileId: s.fileId, emojis: s.emojis})))
        .then(() => {
          setSaving('Набор успешно сохранен. Через 10 секунд вы перейдете на страницу набора')
          setTimeout(() => history.push(routes.stickerSetUpdate.path.replace(':stickerSetId', stickerSetId)), 10000)
        }).catch(err => {
          if (err === 404) {
            history.push(routes.stickerSetUpdate.path.replace(':stickerSetId', stickerSetId))
          } else {
            alert(err)
            setSaving('')
          }
        })
    }).catch(alert)
  }

  return <>
    <div className={styles.container}>
      <div className={styles.header}>{stickerSet.title ? `Добавить стикеры в набор ${stickerSet.title}` : <LoadingText />}</div>
      <div className={styles.content}>
        <div className={styles.actionsRow}>
          <div />
          <Button disabled={stickers.length < 1} onClick={save}>Сохранить</Button>
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
    {loading && <LoaderFullScreen />}
  </>
}

export default StickerSetUpdateAdd
