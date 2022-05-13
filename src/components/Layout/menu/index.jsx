import { useContext } from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'

import { LoadingText } from '@components/LoadingText'

import { menuRoutes, routes, routesName } from '@routes'
import { Store } from '@store'

import styles from './index.scss'

function matchPath (routePath, locationPaths) {
  const routePaths = routePath.split('/')
  return locationPaths[1] === routePaths[1]
}

export function Menu () {
  const { user } = useContext(Store)
  const location = useLocation()
  const localPaths = location.pathname.split('/')

  return <div className={styles.container}>
    <div className={styles.content}>
      <div className={styles.user}>
        {user && user.photo
          ? <div className={styles.userPhoto} style={{ backgroundImage: `url("${user.photo}")` }} />
          : <div className={styles.userPhoto}><LoadingText/></div>
        }
        <div className={styles.userName}>{user && user.username ? user.username : <LoadingText/>}</div>
      </div>
      <div className={styles.routes}>
        {menuRoutes.map(key => (
          <Link key={key} className={classNames(styles.route, matchPath(routes[key].path, localPaths) && styles.active)} to={routes[key].path}>
            <div className={styles.dot} />
            {routesName[key]}
          </Link>
        ))}
      </div>
    </div>
  </div>
}
