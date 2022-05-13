import { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import emojiList from '@assets/emojis.json'

import styles from './index.scss'

const maxSelectCount = 4

export function EmojiInput ({ onChange }) {
  const
    [ showList, setShowList ] = useState(false),
    [ selectedEmojis, setSelectedEmojis ] = useState([])

  function toggleShowList () {
    setShowList(!showList)
  }

  function selectEmoji (emoji) {
    const updateEmojis = [...selectedEmojis]
    if (updateEmojis.includes(emoji)) {
      updateEmojis.splice(updateEmojis.indexOf(emoji), 1)
    } else if (updateEmojis.length < maxSelectCount) {
      updateEmojis.push(emoji)
    }
    setSelectedEmojis(updateEmojis)
    onChange(updateEmojis)
  }

  function leaveFromList () {
    toggleShowList()
  }

  return <div className={styles.container}>
    <label className={styles.label}>Смайлы: </label>
    <div className={classNames(styles.emojisList, showList && styles.active)} onMouseLeave={leaveFromList}>
      <div className={styles.listContent}>
        {emojiList
          .slice(0, 100)
          .map((emoji, i) =>
            <div key={i}
              className={classNames(styles.emoji, selectedEmojis.includes(emoji) && styles.selectedEmoji)}
              onClick={() => selectEmoji(emoji)}
            >{emoji}</div>
          )
        }
      </div>
    </div>
    <div className={styles.emojisInput} onClick={toggleShowList}>
      {selectedEmojis.length > 0
        ? <div className={styles.emojis}>{selectedEmojis.join('')}</div>
        : <div className={styles.placeholder}>Выберите смайлы</div>}
      <span>{selectedEmojis.length}/{maxSelectCount}</span>
    </div>
  </div>
}

EmojiInput.propTypes = {
  onChange: PropTypes.func
}
