const initialState = {
  token: localStorage.getItem("token") || null,
  user: null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default authReducer;
