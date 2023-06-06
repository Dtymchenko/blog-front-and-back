import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import Grid from '@mui/material/Grid';

import { Tag } from '../components/Tag';
import { fetchTags } from '../redux/slices/post';

export const Tags = () => {
  const dispatch = useDispatch()
  const {tags} = useSelector(state => state.posts)
  const isTagsLoading = tags.status === "loading";

  React.useEffect(() => {
    dispatch(fetchTags())
  }, [])

  

  return (
    <>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isTagsLoading ? [...Array(10)] : tags.items).map((obj, index) => (
            isTagsLoading ? (
              <Tag key={index} isLoading={true}/>
            ) : (
            <Tag
              key={index}
              title={obj}
            />
            )
          ))}
        </Grid>
        
      </Grid>
    </>
  );
};
