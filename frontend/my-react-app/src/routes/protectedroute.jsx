

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

export default function RoleProtectedRoute({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    api.get("auth/user/me/")
      .then((res) => {
        setAuth(true);
        setRole(res.data.role);
        console.log('hai the role',res.data.role)
      })
      .catch(() => {
        setAuth(false);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!auth) return <Navigate to="/login" />;

  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauth" />; 
  }

  return children;
}