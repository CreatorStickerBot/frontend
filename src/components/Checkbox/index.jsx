import styles from './index.scss'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export function Checkbox ({ className, ...props }) {
  return <label className={classNames(className, styles.label)}>
    <input type="checkbox" hidden {...props} />
    <div className={styles.fakeCheckbox} />
  </label>
}

Checkbox.propTypes = {
  className: PropTypes.string
}
