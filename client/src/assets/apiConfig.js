// assets/apiConfig.js
export const authHeaders = () => {
  const userInfo = localStorage.getItem("userInfo");
  let token = null;

  if (userInfo) {
    try {
      token = JSON.parse(userInfo).token;
    } catch (error) {
      console.error("Invalid userInfo in localStorage");
    }
  }

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};
