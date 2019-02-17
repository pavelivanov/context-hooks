export const initialState = {
  isFetching: false,
  items: [],
}

export const setFetchingStatus = (state, status) => ({ ...state, isFetching: status })

export const setProducts = (state, items) => ({ ...state, items, isFetching: false })
