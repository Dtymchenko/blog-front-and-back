import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import axios from "../../helpers/axios";

const getPosts = (state) => state?.items || [];

export const getPostsSortedByDate = createSelector(getPosts, (posts) =>
  [...posts].sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt))
);

export const getPostsSortedByViews = createSelector(getPosts, (posts) =>
  [...posts].sort((a, b) => b?.viewsCount - a?.viewsCount)
);

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchRemovePost = createAsyncThunk(
  "posts/fetchRemovePost",
  async (id) => await axios.delete(`/posts/${id}`)
);

export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // sortByDate(state) {
    //   state.posts.items.sort(
    //     (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    //   );
    // },
    // sortByViews(state) {
    //   state.posts.items.sort((a, b) => b.viewsCount - a.viewsCount);
    // },
  },
  extraReducers: {
    // Getting posts
    [fetchPosts.pending]: (state) => {
      state.posts.items = [];
      state.posts.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.posts.items = action.payload.reverse();

      state.posts.status = "loaded";
    },
    [fetchPosts.rejected]: (state) => {
      state.posts.items = [];
      state.posts.status = "error";
    },
    // Getting tags
    [fetchTags.pending]: (state) => {
      state.tags.items = [];
      state.tags.status = "loading";
    },
    [fetchTags.fulfilled]: (state, action) => {
      state.tags.items = action.payload;

      state.tags.status = "loaded";
    },
    [fetchTags.rejected]: (state) => {
      state.tags.items = [];
      state.tags.status = "error";
    },
    // Removing post
    [fetchRemovePost.pending]: (state) => {
      state.posts.status = "loading";
    },
    [fetchRemovePost.fulfilled]: (state, action) => {
      state.posts.items = state.posts.items.filter(
        (obj) => obj._id !== action.meta.arg
      );
      state.posts.status = "loaded";
    },
    [fetchRemovePost.rejected]: (state) => {
      state.posts.status = "error";
    },
  },
});

// export const { sortByDate, sortByViews } = postsSlice.actions;

export const postsReducer = postsSlice.reducer;
