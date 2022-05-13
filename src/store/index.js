import { createContext } from 'react'

import PhotoIcon from '@assets/icons/defaultPhoto.svg'

export function setUserProperties (user, setFn) {
  const defaultObj = defaultStore.user

  if ('id' in user) defaultObj.id = user.id
  if ('username' in user) defaultObj.username = user.username
  if ('photo' in user) defaultObj.photo = user.photo

  setFn(defaultObj)
}

export const defaultStore = {
  user: {
    id: '',
    username: '',
    photo: PhotoIcon
  },
  setUser () {},
}

export const Store = createContext(defaultStore)
