import React from "react";
import Skeleton from "@mui/material/Skeleton";

import styles from "./Tag.module.scss";

export const TagSkeleton = () => {
  return (
    <div className={styles.skeleton}>
        <Skeleton
          className={styles.content}
          variant="rectangular"
          width="25%"
          height={20}
          />
        <Skeleton
          className={styles.content}
          variant="rectangular"
          width="20%"
          height={20}
          />
          <Skeleton
          className={styles.content}
          variant="rectangular"
          width="15%"
          height={20}
          />
          <Skeleton
          className={styles.content}
          variant="rectangular"
          width="40%"
          height={20}
          />
    </div>
  );
};
