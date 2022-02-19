import React from 'react';
import styles from './styles/Button.module.css';

interface IButton {
  className?: string;
  label: string;
  color: 'red' | 'blue' | 'green';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

const Button: React.FC<IButton> = ({ className, children, label, color, onClick, disabled }) => {
  let colorStyles = styles.blue;
  if (color === 'red') colorStyles = styles.red;
  if (color === 'green') colorStyles = styles.green;

  return (
    <button
      className={`${styles.Button} ${className} ${colorStyles}`}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  className: '',
  label: 'Button',
  disabled: false
};

export default Button;
