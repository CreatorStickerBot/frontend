import { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { DeleteStickerPopup } from '@components/DeleteStickerPopup'
import { LoaderFullScreen } from '@components/LoaderFullScreen'
import { StickerCard } from '@components/StickerCard'
import { LoadingText } from '@components/LoadingText'
import { Checkbox } from '@components/Checkbox'
import { Button } from '@components/Button'

import { routes } from '@routes'
import { Api } from '@api'

import styles from '../index.scss'
import stylesUpdate from './index.scss'
import stylesCreate from '../create/index.scss'

function StickerSetUpdate () {
  const history = useHistory()
  const { stickerSetId } = useParams()
  const
    [ selectedIndexStickers, setSelectedSticker ] = useState([]),
    [ showDeletePopup, setShowDeletePopup ] = useState(false),
    [ stickerSet, setStickerSet ] = useState({}),
    [ loading, setLoading ] = useState(true),
    [ saving, setSaving ] = useState('')

  function selectSticker (index) {
    if (selectedIndexStickers.includes(index)) {
      const stickers = [...selectedIndexStickers]
      stickers.splice(stickers.indexOf(index), 1)
      setSelectedSticker(stickers)
    } else {
      setSelectedSticker([...selectedIndexStickers, index])
    }
  }

  function selectAllStickers (event) {
    if (event.target.checked)
      setSelectedSticker(stickerSet.stickers.map((_, i) => i))
    else
      setSelectedSticker([])
  }

  function deleteSelectedSticker () {
    setShowDeletePopup(!showDeletePopup)
    setSaving('Удаление в процессе...')

    const awaitingDelete = selectedIndexStickers.map(async index => {
      return await Api.deleteStickerByFileId(stickerSetId, stickerSet.stickers[index].image.fileId)
    })

    Promise.all(awaitingDelete).then(() => {
      setSelectedSticker([])
      setSaving('Удаление успешно завершено')
      updateStickers()
    }).catch(err => {
      alert(err)
      setSaving('')
    })

  }

  function updateStickers () {
    Api.getStickerSetById(stickerSetId).then(async resStickerSet => {
      setStickerSet(resStickerSet)
      const stickers = await Api.getStickersBySetId(stickerSetId)

      setStickerSet(Object.assign(resStickerSet, { stickers }))
      setLoading(false)
      setSaving('')

    }).catch(err => {
      if (err === 404) {
        alert('Такого набора не существует')
        history.push(routes.stickerSet.path)
      } else {
        alert(err.response.message)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    updateStickers()
  }, [])

  return <>
    <div className={styles.container}>
      <div className={styles.header}>{stickerSet.title ? `Редактирование набора ${stickerSet.title}` : <LoadingText />}</div>
      <div className={styles.content}>
        <div className={styles.actionsRow}>
          <div className={stylesUpdate.deleteAction}>
            <label className={stylesUpdate.selectAllLabel}>
              <div className={stylesUpdate.selectAllText}>Выбрать все</div>
              <Checkbox onChange={selectAllStickers} />
            </label>
            {selectedIndexStickers.length > 0 && <Button outline onClick={() => setShowDeletePopup(!showDeletePopup)}>Удалить</Button>}
          </div>
          <Button to={routes.stickerSetUpdateAdd.path.replace(':stickerSetId', stickerSetId)}>Добавить стикеры</Button>
        </div>
        <div className={stylesCreate.rowHeaderCards}>
          <div>{(stickerSet.stickers && stickerSet.stickers.length) || 0} / 120</div>
        </div>
        <div className={stylesUpdate.containerCards}>
          {stickerSet.stickers && stickerSet.stickers.map((sticker, i) => <label className={stylesUpdate.labelStickerCard} key={i.toString()}>
            <StickerCard large sticker={sticker} />
            <input type="checkbox" hidden onChange={() => selectSticker(i)} checked={selectedIndexStickers.includes(i)} />
            <div className={stylesUpdate.labelStickerCardCheckbox} />
          </label>)}
        </div>
      </div>
    </div>
    {saving && (
      <div className={stylesCreate.savingContainer} data-text={saving} />
    )}
    {showDeletePopup && <DeleteStickerPopup
      stickers={stickerSet.stickers && stickerSet.stickers.filter((_, i) => selectedIndexStickers.includes(i))}
      onClose={() => setShowDeletePopup(!showDeletePopup)}
      onDelete={deleteSelectedSticker}
    />}
    {loading && <LoaderFullScreen />}
  </>
}

export default StickerSetUpdate
