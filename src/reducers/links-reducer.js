const defaultState = {
  data: [],
  currentlyShorten: null,
  shortenLinksHistoryList: [],
  readyState: "loading"
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case "SET_CURRENTLY_SHORTEN_LINK": {
      return {
        ...state,
        currentlyShorten:  action.shortLink.data.shortUrl
      };
    }

    case "SET_SHORTEN_URLS_HISTORY_LIST": {
      return {
        ...state,
        shortenLinksHistoryList: [...action.history.data]
      };
    }

    case "SET_DATA": {
      return {
        ...state,
        data: [action.stockData]
      };
    }

    default:
      return state;
  }
};
