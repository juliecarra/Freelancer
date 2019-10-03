import axios from "axios";

import {
  ADD_POST,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_POSTS,
  GET_POST,
  POST_LOADING,
  DELETE_POST
} from "./types";

// Add Post
export const addPost = postData => async dispatch => {
  dispatch(clearErrors());
  try {
    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/posts",
      postData
    );
    dispatch({
      type: ADD_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Get Posts
export const getPosts = () => async dispatch => {
  dispatch(setPostLoading());

  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + "/api/posts"
    );

    dispatch({
      type: GET_POSTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_POSTS,
      payload: null
    });
  }
};

// Get Post
export const getPost = id => async dispatch => {
  dispatch(setPostLoading());

  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/posts/${id}`
    );

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_POST,
      payload: null
    });
  }
};

// Delete Post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(process.env.REACT_APP_SERVER_URL + `/api/posts/${id}`);
    dispatch({
      type: DELETE_POST,
      payload: id
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add Like
export const addLike = id => async dispatch => {
  try {
    await axios.post(
      process.env.REACT_APP_SERVER_URL + `/api/posts/like/${id}`
    );
    dispatch(getPosts());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Remove Like
export const removeLike = id => async dispatch => {
  try {
    await axios.post(
      process.env.REACT_APP_SERVER_URL + `/api/posts/unlike/${id}`
    );
    dispatch(getPosts());
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add Comment
export const addComment = (postId, commentData) => async dispatch => {
  dispatch(clearErrors());
  try {
    const res = await axios.post(
      process.env.REACT_APP_SERVER_URL + `/api/posts/comment/${postId}`,
      commentData
    );
    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    const res = await axios.delete(
      process.env.REACT_APP_SERVER_URL +
        `/api/posts/comment/${postId}/${commentId}`
    );

    dispatch({
      type: GET_POST,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
