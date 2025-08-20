const API_BASE = "https://mrcc-hr-backend.onrender.com/api";

export const login = async (credentials) => {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};
