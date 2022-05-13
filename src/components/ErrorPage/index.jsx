import PropTypes from 'prop-types'

import styles from './index.scss'

export function ErrorPage ({ text }) {
  return <div data-text={text} className={styles.container} />
}

ErrorPage.propTypes = {
  text: PropTypes.string
}
