import { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import { LoaderFullScreen } from '@components/LoaderFullScreen'
import { ErrorPage } from '@components/ErrorPage'
import { Layout } from '@components/Layout'

import { setUserProperties, Store } from '@store'
import { routes } from '@routes'
import { Api } from '@api'

import styles from './app.scss'

function renderRoute(key, renderRoutes, user) {
  const route = renderRoutes[key]
  const Component = route.component

  const routeRender = () => {
    return route.redirect
      ? <Redirect to={route.redirect} />
      : (route.protected && !user
        ? <Redirect to={routes.default.path} />
        : <Suspense fallback={<LoaderFullScreen />}>
          <Component />
        </Suspense>
      )
  }

  return <Route exact key={key} path={route.path} render={routeRender} />
}

function App() {
  const
    [user, setUser] = useState(),
    [loaded, setLoaded] = useState(false),
    [loadErr, setLoadErr] = useState(false)

  const setUserStore = (res) => {
    setUserProperties(res, setUser)
  }

  useEffect(() => {
    Api.verificationToken()
      .then(setUserStore)
      .catch(err => {
        if (err.code === 'ERR_NETWORK' || [404, 400].includes(err.response.status)) {
          setLoadErr('Сервер временно не доступен')
        }

        setUser()
      })
      .finally(() => setLoaded(true))
  }, [])

  return <Store.Provider value={{ user, setUser: setUserStore }}>
    <BrowserRouter>
      {loaded
        ? (!loadErr
          ? <Layout>
            <Switch>
              {Object.keys(routes).map(key => renderRoute(key, routes, user))}
              <Redirect to="/" />
            </Switch>
          </Layout>
          : <ErrorPage text={loadErr} />
        )
        : <LoaderFullScreen />
      }
    </BrowserRouter>
    <div className={styles.version}>version: {VERSION}</div>
  </Store.Provider>
}

export { App }
