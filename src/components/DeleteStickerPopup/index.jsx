import PropTypes from 'prop-types'

import { Button, buttonColors } from '@components/Button'
import { StickerCard } from '@components/StickerCard'
import { Portal } from '@components/Portal'

import styles from './index.scss'

export function DeleteStickerPopup ({ stickers, onClose, onDelete }) {
  return <Portal>
    <div className={styles.popupContainer}>
      <div className={styles.content}>
        <div className={styles.close} onClick={onClose} />
        <div className={styles.title}>Удалить следующие стикеры?</div>
        <div className={styles.stickers}>
          {stickers.map(sticker => <StickerCard key={sticker.emoji} sticker={sticker} />)}
        </div>
        <div>
          <Button outline colorScheme={buttonColors.red} onClick={onDelete}>Удалить</Button>
        </div>
      </div>
    </div>
  </Portal>
}

DeleteStickerPopup.propTypes = {
  stickers: PropTypes.arrayOf(PropTypes.shape({
    image: PropTypes.object,
    emoji: PropTypes.string
  })),
  onClose: PropTypes.func,
  onDelete: PropTypes.func
}
