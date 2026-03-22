
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Navbar />
        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}