import { useState } from 'react'
import PropTypes from 'prop-types'

import styles from './index.scss'

export function ImageInput ({ onChange }) {
  const [ image, setImage ] = useState()

  function changeImage (event) {
    const file = event.target.files[0]
    setImage(file)
    onChange(file)
  }

  return <label className={styles.container}>
    <div className={styles.label}>Изображение:</div>
    <div className={styles.imageInput}>
      {image ? <div>{image.name}</div> : <div className={styles.placeholder}>Выберите изображение</div>}
      <input type="file" accept="image/png" hidden onChange={changeImage} />
    </div>
  </label>
}

ImageInput.propTypes = {
  onChange: PropTypes.func
}
