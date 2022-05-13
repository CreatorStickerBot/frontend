import { Link as RouterLink } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import styles from './index.scss'

export function Link ({ to, children, className }) {
  return <RouterLink to={to} className={classNames(styles.link, className)} >{children}</RouterLink>
}

Link.propTypes = {
  to: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string
}
