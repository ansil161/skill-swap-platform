import { useEffect, useState } from "react";
import api from "../../api/axios";

import UserDashboard from "./dashboard";
import RecruiterDashboard from "./recruiiterdash";
import AdminDashboard from "../../../adminpanel/pages/dashboard";

export default function DashboardRouter() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    api.get("user/profile/")
      .then(res => setRole(res.data.role))
      .catch(() => setRole("guest"));
  }, []);

  if (!role) return <div>Loading...</div>;

  if (role === "user") return <UserDashboard />;
  if (role === "recruiter") return <RecruiterDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <div>Unauthorized</div>;
}