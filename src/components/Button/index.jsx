import { Link } from 'react-router-dom'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import styles from './index.scss'

const DefaultButton = ({...props}) => <button {...props} />

export const buttonColors = {
  black: 'black',
  red: 'red'
}

const stylesColor = {
  [buttonColors.black]: {
    '--text': '#FFF',
    '--background': '#000',
    '--shadow-color': 'rgba(0, 0, 0, 0.2)',
    '--text-outline': '#000',
  },
  [buttonColors.red]: {
    '--text': '#FFF',
    '--background': '#E21A1A',
    '--shadow-color': 'rgba(226, 26, 26, 0.2)',
    '--outline-text': '#E21A1A'
  }
}

export function Button ({ children, to, className, outline, colorScheme, ...props }) {
  const Component = to ? Link : DefaultButton

  const properties = Object.assign(props, {
    className: classNames(styles.button, className, outline && styles.outline),
    style: stylesColor[colorScheme],
    ...(to ? { to } : {}),
    children,
  })

  return <Component {...properties} />
}

Button.defaultProps = {
  outline: false,
  colorScheme: buttonColors.black
}

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  to: PropTypes.string,
  outline: PropTypes.bool,
  colorScheme: PropTypes.oneOf(Object.keys(buttonColors))
}
