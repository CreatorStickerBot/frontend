import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './index.scss'

export function LoadingText ({ className }) {
  return <div className={classNames(styles.container, className)} />
}

LoadingText.propTypes = {
  className: PropTypes.any
}
