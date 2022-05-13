import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { LoaderFullScreen } from '@components/LoaderFullScreen'
import { Button } from '@components/Button'

import { routes } from '@routes'
import { Api } from '@api'

import styles from './index.scss'

function StickerSet () {
  const
    [sets, setSets] = useState([]),
    [loading, setLoading] = useState(true)

  useEffect(() => {
    Api.getStickerSets()
      .then(resSets => {
        const awaitingStickerSets = resSets.map(async set => {
          const stickers = await Api.getStickersBySetId(set._id).catch(alert)
          return Object.assign(set, { stickers })
        })

        Promise.all(awaitingStickerSets).then(finallySets => {
          setSets(finallySets)
          setLoading(false)
        }).catch(alert)
      })
      .catch(alert)
  }, [])

  return <div className={styles.container}>
    <h1 className={styles.header}>Наборы</h1>
    <div className={styles.content}>
      <div className={styles.actionsRow}>
        <Button to={routes.stickerSetCreate.path}>Создать набор</Button>
      </div>
      {loading
        ? <LoaderFullScreen />
        : sets && sets.map(set => (
          <div className={styles.row} key={set._id.toString()}>
            <div className={styles.rowTitle}>
              <div className={styles.title}>{set.title}</div>
              <Link to={routes.stickerSetUpdate.path.replace(':stickerSetId', set._id)} className={styles.editIcon} />
            </div>
            <div className={styles.rowImages}>
              {set.stickers.map(sticker => <div key={sticker.image.fileId} className={styles.image}>
                <img alt={sticker.image.fileId} src={sticker.image.file} />
                <div className={styles.emoji}>{sticker.emoji}</div>
              </div>)}
            </div>
          </div>))
      }
    </div>
  </div>
}

export default StickerSet
