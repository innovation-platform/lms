// src/utils/storage.js
export const StorageService = {
    getToken: () => sessionStorage.getItem("token"),
    setToken: (token) => sessionStorage.setItem("token", token),
    clearAuth: () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("role");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("activeRole");
    },
    setUser: (user) => sessionStorage.setItem("user", JSON.stringify(user)),
    getUser: () => JSON.parse(sessionStorage.getItem("user")),
  };
  