import axios from 'axios';

const getSavedLinksListUrl = '/api/get-saved-links-list';
const shortenLinkUrl = '/api/shorten';
const redirectToLinkUrl = '/api/redirect/'
const deleteHistoryLink = '/api/delete-history-link/';

export const getShortenUrlsHistoryList = () => {
  return dispatch => {
    return dispatch({
      type: 'GET_SHORTEN_URLS_HISTORY_LIST',
      payload: axios.get(getSavedLinksListUrl)
        .then( (response) =>  {
            dispatch(setShortenUrlsHistoryList(response))      
         })
      })
  }
}

export const getShortUrl = (formData) => {
  return dispatch => {
    return dispatch({
      type: 'GET_SHORT_URL',
      formData,
      payload: axios.post(shortenLinkUrl, formData.userInput)
        .then( (response) =>  {
            dispatch(setShortLink(response))      
         })
      })
  }
}

export const redirectToUrl = (url) => {
  const encodedString = url.split('/').pop()
  return dispatch => {
    return dispatch({
      type: 'GET_SHORT_URL',
      encodedString,
      payload: axios.get(`${redirectToLinkUrl}${encodedString}`)
      
      })
  }
}

export const setShortLink = (shortLink) =>  {
  return dispatch => {
    return dispatch({
      type: 'SET_CURRENTLY_SHORTEN_LINK',
      shortLink,
      })
  }
}

export const setShortenUrlsHistoryList = (history) => {
  return dispatch => {
    return dispatch({
      type: 'SET_SHORTEN_URLS_HISTORY_LIST',
      history,
      })
  }
}

export const deleteLink = (url) => {
  const encodedString = url.split('/').pop()
  return dispatch => {
    return dispatch({
      type: 'DELETE_LINK',
      payload: axios.delete(`${deleteHistoryLink}${encodedString}`).then( (response) =>  {
          dispatch(setShortenUrlsHistoryList(response))      
      })
    })
  }
}