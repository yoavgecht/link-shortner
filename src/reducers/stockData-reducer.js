const defaultState = {
  data: [],
  currentlyShorten: null,
  shortenLinksHistoryList: [],
  readyState: "loading"
};

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case "SAVE_STOCKDATA": {
      return {
        ...state,
        data: action.payload,
        readyState: "loading"
      };
    }

    case "FETCH_STOCKDATA_FULFILLED": {
      return {
        ...state,
        readyState: "success"
      };
    }

    case "DELETE_STOCKDATA": {
      return {
        ...state,
        data: action.payload
      };
    }

    case "SET_CURRENTLY_SHORTEN_LINK": {
      console.log(action.shortLink);
      return {
        ...state,
        currentlyShorten:  action.shortLink.data.shortUrl
      };
    }

    case "SET_SHORTEN_URLS_HISTORY_LIST": {
      console.log(action.history);
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
