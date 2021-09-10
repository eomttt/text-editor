/* eslint-disable react/jsx-props-no-spreading */
import classNames from 'classnames';
import React, { HTMLProps } from 'react';
import Styles from './Button.css';

export const Button = ({ type, className, ...props }: HTMLProps<HTMLButtonElement>) => (
  <button className={classNames([className, Styles.button])} type="button" {...props}>
    {props?.children}
  </button>
);
