import axios from "axios";

import {
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";

// Get current profile
export const getCurrentProfile = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + "/api/profile"
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: {}
    });
  }
};

// Get profile by handle
export const getProfileByHandle = handle => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + `/api/profile/handle/${handle}`
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILE,
      payload: null
    });
  }
};

// Create Profile
export const createProfile = (profileData, history) => async dispatch => {
  try {
    await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/profile",
      profileData,
      { withCredentials: false }
    );

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add experience
export const addExperience = (expData, history) => async dispatch => {
  try {
    await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/profile/experience",
      expData
    );

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Add education
export const addEducation = (eduData, history) => async dispatch => {
  try {
    await axios.post(
      process.env.REACT_APP_SERVER_URL + "/api/profile/education",
      eduData
    );

    history.push("/dashboard");
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Delete Experience
export const deleteExperience = id => async dispatch => {
  try {
    const res = await axios.delete(
      process.env.REACT_APP_SERVER_URL + `/api/profile/experience/${id}`
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Delete Education
export const deleteEducation = id => async dispatch => {
  try {
    const res = await axios.delete(
      process.env.REACT_APP_SERVER_URL + `/api/profile/education/${id}`
    );

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    });
  }
};

// Get all profiles
export const getProfiles = () => async dispatch => {
  dispatch(setProfileLoading());

  try {
    const res = await axios.get(
      process.env.REACT_APP_SERVER_URL + "/api/profile/all"
    );

    dispatch({
      type: GET_PROFILES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GET_PROFILES,
      payload: null
    });
  }
};

// Delete account & profile
export const deleteAccount = () => async dispatch => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    try {
      await axios.delete(process.env.REACT_APP_SERVER_URL + "/api/profile");

      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      });
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};
