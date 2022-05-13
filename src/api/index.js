import axios from 'axios'
import { decodeAccessToken } from '@utils/decodeAccessToken'

/**
 * @todo В первом мажоре перенести авторизацию
 */
class SingletonApi {
  constructor () {
    if (SingletonApi.instance) {
      return SingletonApi.instance
    }

    this._api = axios.create({
      baseURL: API_URL
    })

    SingletonApi.instance = this

    return this
  }

  // don`t use api
  _setToken () {
    this._api.defaults.headers['Authorization'] = `Bearer ${this.accessToken}`
  }

  // don`t use api
  verificationToken () {
    return new Promise((resolve, reject) => {
      if (!this.accessToken || !this.refreshToken) {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken && refreshToken) {
          this._authApiProcess(accessToken, refreshToken)
        } else {
          reject()
          return
        }
      }

      if (this.expiresAccessToken <= Date.now())
        this._updateToken()
          .then(resolve)
          .catch(reject)
      else
        this.checkLifeApi().then(() => {
          resolve(this.user)
        }).catch(reject)
    })
  }

  // use api
  _updateToken () {
    return new Promise((resolve, reject) => {
      this._api.post('/auth/refresh', { userId: this.user.id, refreshToken: this.refreshToken }).then(res => {
        const { accessToken, refreshToken } = res.data
        const user = this._authApiProcess(accessToken, refreshToken)
        resolve(user)
      }).catch(err => {
        reject(err)
      })
    })
  }

  // don`t use api
  _authApiProcess (accessToken, refreshToken) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken

    const payload = decodeAccessToken(this.accessToken)
    this.expiresAccessToken = payload.createdAt + payload.expires
    this._setToken()

    localStorage.setItem('accessToken', this.accessToken)
    localStorage.setItem('refreshToken', this.refreshToken)

    this.user = { id: payload.id, username: payload.username }
    return this.user
  }

  // use api
  checkLifeApi () {
    return new Promise((resolve, reject) => {
      this._api.get('/check-life').then(resolve).catch(reject)
    })
  }

  // use api
  auth (username, password) {
    return new Promise((resolve, reject) => {
      // alert(this._api.post)
      this._api.post('/auth', { username, password }).then(res => {
        const { accessToken, refreshToken } = res.data

        const user = this._authApiProcess(accessToken, refreshToken)

        resolve(user)
      }).catch(err => {
        if (err.response.status === 404) reject('Пользователь не найден')
        else if (err.response.status === 401) reject('Логин или пароль введен не верно')
        else if (err.response.status === 400) {
          if (err.response.data.error.includes('confirmed')) reject('Подтвердите регистрацию')
          reject(err)
        }
      })
    })
  }

  // use api
  registration (username, password, repeatPassword) {
    return new Promise((resolve, reject) => {
      this._api.post('/registration', {username, password, repeatPassword}).then(res => {
        const { id, username } = res.data

        resolve({id, username})
      }).catch(err => {
        if (err.response.status === 400) {
          if (err.response.data.error.includes('Username in use')) reject('Пользователь уже существует')
        }
        reject(err)
      })
    })
  }

  // use api
  confirmation (code, userId) {
    return new Promise((resolve, reject) => {
      this._api.post('/auth/confirmation', { code, userId })
        .then(resolve)
        .catch(err => {
          if (err.response.status === 404) reject('Пользователь не найден')
          if (err.response.status === 401) reject('Код введен неверно')
          reject(err)
        })
    })
  }

  // use api
  getStickerSets () {
    return new Promise((resolve, reject) => {
      this._api.get('/sticker-sets').then(res => {
        resolve(res.data)
      }).catch(reject)
    })
  }

  // use api
  getStickerSetById (id) {
    return new Promise((resolve, reject) => {
      this._api.get(`/sticker-sets/${id}`).then(res => {
        resolve(res.data)
      }).catch(err => {
        if (err.response.status === 404) reject(404)
        reject(err)
      })
    })
  }

  // use api
  getStickersBySetId (id) {
    return new Promise((resolve, reject) => {
      this._api.get(`/sticker-sets/${id}/stickers`).then(res => {
        resolve(res.data)
      }).catch(reject)
    })
  }

  // use api
  /**
   *
   * @param {FormData} form
   * @returns {Promise<unknown>}
   */
  uploadImage (form) {
    return new Promise((resolve, reject) => {
      this._api.post('/upload-image', form)
        .then(res => {
          resolve(res.data.file_id)
        }).catch(reject)
    })
  }

  // use api
  /**
   *
   * @param {string} stickerSetName
   * @param {{fileId: string, emojis: Array}[]} stickers
   * @returns {Promise<unknown>}
   */
  setStickerSet (stickerSetName, stickers) {
    return new Promise((resolve, reject) => {
      this._api.post('/sticker-sets', { stickerSetName, stickers }).then(res => {
        resolve(res.data)
      }).catch(err => {
        if (err.response.status === 400)
          reject('Проверьте заполненные поля')
        reject(err)
      })
    })
  }

  //use api
  addStickerToSet (stickerSetId, stickers) {
    return new Promise((resolve, reject) => {
      this._api.post(`/sticker-sets/${stickerSetId}/stickers`, { stickers })
        .then(resolve).catch(err => {
          if (err.response.status === 400)
            reject('Проверьте заполненные поля')
          if (err.response.status === 404)
            reject(404)
          reject(err)
        })
    })
  }

  //use api
  deleteStickerByFileId (stickerSetId, fileId) {
    return new Promise((resolve, reject) => {
      this._api.delete(`/sticker-sets/${stickerSetId}/stickers/${fileId}`)
        .then(resolve).catch(reject)
    })
  }
}

const Api = new SingletonApi()

export { Api }
