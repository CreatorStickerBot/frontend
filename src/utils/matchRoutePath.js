export function mathRoutePath (locationPath, routePath) {
  // Дополнитлеьня проверка на слеш в конце пути
  const locationArrPath = locationPath[locationPath.length - 1] === '/'
    ? locationPath.split('/').slice(1, -1)
    : locationPath.split('/').slice(1)
  const routeArrPath = routePath.split('/').slice(1)

  // проверяем ня количество элементов в пути
  if (locationArrPath.length === routeArrPath.length) {
    let err = false
    for (const i in routeArrPath) {
      const
        route = routeArrPath[i],
        local = locationArrPath[i]
      // сравниваем элементы
      if (local !== route) {
        // если элементы не равны, проверяем на параметры
        if (route.includes(':')) {
          // вытаскиваем сапаратор(-ы)
          const paramsSeparators = route.split(':').slice(1)
            .filter((r, i, arr) => i < arr.length - 1)
            .map(r => r.slice(-1))

          if (paramsSeparators.length > 0)
            // проверяем есть ли сепаратор(-ы) в итоговом пути
            for (const sep of paramsSeparators)
              if (!local.includes(sep)) err = true
        } else err = true
      }
    }
    return !err
  }
  return false
}
