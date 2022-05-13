import { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {CreateStickerPopup} from '@components/CreateStickerPopup'

import styles from './index.scss'

export function StickerCard ({ creation, sticker, addSticker, large }) {
  const [ show, setShow ] = useState(false)
  const image = sticker
    ? (typeof sticker.image.file === 'string'
      ? sticker.image.file
      : URL.createObjectURL(sticker.image.file))
    : null

  const emoji = sticker
    ? ('emoji' in sticker
      ? sticker.emoji
      : sticker.emojis.join(''))
    : null

  function handleSaveSticker (sticker) {
    setShow(false)
    addSticker(sticker)
  }

  return <div
    className={classNames(styles.container, creation && styles.creation, large && styles.large)}
    onClick={() => creation && !show ? setShow(true) : {}}
  >
    {sticker
      ? <>
        <img className={styles.image} src={image} alt={emoji} />
        <div className={styles.emojis}>{emoji}</div>
      </>
      : <div className={styles.iconCreation} />
    }
    {creation && show && <CreateStickerPopup save={handleSaveSticker} onClose={() => setShow(false)} />}
  </div>
}

StickerCard.defaultProps = {
  large: false,
}

StickerCard.propTypes = {
  large: PropTypes.bool,
  creation: PropTypes.bool,
  sticker: PropTypes.shape({
    image: PropTypes.object,
    emojis: PropTypes.array,
    emoji: PropTypes.string
  }),
  addSticker: PropTypes.func
}
