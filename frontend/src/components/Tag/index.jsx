import React from 'react';
import clsx from 'clsx';

import { useDispatch } from 'react-redux';
import styles from './Tag.module.scss';
import { TagSkeleton } from './Skeleton';

export const Tag = ({title,isLoading}) => {

  const dispatch = useDispatch()

  if (isLoading) {
    return <TagSkeleton />;
  }

  return (
    <div className={clsx(styles.root)}>
      <div className={styles.wrapper}>
        <div className={styles.indention}>
        {title}
        </div>
      </div>
    </div>
  );
};
