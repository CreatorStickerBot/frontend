export function decodeAccessToken (token) {
  const tokenSplits = token.split('.')

  return tokenSplits.slice(0, 2).map(part => {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const stringedPart = decodeURIComponent(atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(stringedPart)
  })[1]
}
