import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'

import { Menu } from '@components/Layout/menu'

import { mathRoutePath } from '@utils/matchRoutePath'
import { routes } from '@routes'

import styles from './index.scss'

export function Layout ({ children }) {
  const location = useLocation()

  const route = Object.keys(routes)
    .filter(key => mathRoutePath(location.pathname, routes[key].path))
    .map(k => routes[k]).pop()

  return route && route.layout ? <div className={styles.container}>
    <Menu />
    <div className={styles.content}>{children}</div>
  </div> : children
}

Layout.propTypes = {
  children: PropTypes.any
}
