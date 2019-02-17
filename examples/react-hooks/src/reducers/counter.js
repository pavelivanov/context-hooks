export const initialState = {
  count: 0,
}

export const increment = (state) => ({ count: state.count + 1 })

export const decrement = (state) => ({ count: state.count - 1 })
