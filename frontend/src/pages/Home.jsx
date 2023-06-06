import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags, getPostsSortedByDate, getPostsSortedByViews } from '../redux/slices/post';
import { formatDate } from '../helpers/functions';
// import { sortByDate, sortByViews } from '../redux/slices/post';

export const Home = () => {
  const dispatch = useDispatch()
  const {posts, tags} = useSelector(state => state.posts)
  const userData = useSelector(state => state.auth.data)
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const [currentTab, setCurrentTab] = React.useState(0);
  
  React.useEffect(() => {
    dispatch(fetchPosts())
    dispatch(fetchTags())
  }, [])

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const sortedPosts = currentTab === 0 ? getPostsSortedByDate(posts) : getPostsSortedByViews(posts);
  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={currentTab} 
        onChange={handleTabChange} 
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
        {(isPostsLoading ? [...Array(5)] : sortedPosts).map((obj, index) => (
            isPostsLoading ? (
              <Post key={index} isLoading={true}/>
            ) : (
            <Post
              key={obj._id}
              id={obj._id}
              title={obj.title}
              imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""}
              user={obj.user}
              createdAt={formatDate(obj.createdAt)}
              viewsCount={obj.viewsCount}
              commentsCount={3}
              tags={obj.tags}
              isEditable={userData?._id === obj.user._id}
            />
            )
          ))}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items.slice(-5)} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'User1',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Test comment',
              },
              {
                user: {
                  fullName: 'User2',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
