import { useState } from 'react'
import PropTypes from 'prop-types'

import { ImageInput } from '@components/CreateStickerPopup/ImageInput'
import { EmojiInput } from '@components/CreateStickerPopup/EmojiInput'
import { Portal } from '@components/Portal'
import { Button } from '@components/Button'

import styles from './index.scss'

export function CreateStickerPopup ({ onClose, save }) {
  const
    [emojis, setEmoji] = useState([]),
    [image, setImage] = useState()

  return <Portal className={styles.popupContainer}>
    <div className={styles.content}>
      <div className={styles.title}>Создать стикер</div>
      <div className={styles.row}>
        <EmojiInput onChange={setEmoji} />
      </div>
      <div className={styles.row}>
        <ImageInput onChange={setImage} />
      </div>
      <div className={styles.row}>
        <Button onClick={() => save({ image: { file: image }, emojis })} disabled={emojis.length < 1 || !image}>Сохранить</Button>
      </div>

      <button className={styles.close} onClick={onClose} />
    </div>
  </Portal>
}

CreateStickerPopup.propTypes = {
  save: PropTypes.func,
  onClose: PropTypes.func
}

