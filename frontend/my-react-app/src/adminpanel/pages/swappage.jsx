// admin/pages/Swaps.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Swaps() {
  const [swaps, setSwaps] = useState([]);

  useEffect(() => {
    api.get("admin/swaps/")
      .then(res => setSwaps(res.data));
  }, []);

  return (
    <div>
      <h2>Swap Requests</h2>

      {swaps.map(s => (
        <div key={s.id} style={{ marginBottom: "10px" }}>
          {s.requester_name} → {s.provider_name} ({s.status})
        </div>
      ))}
    </div>
  );
}