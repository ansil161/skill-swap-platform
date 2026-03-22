import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/table.css";

const STATUS_CLASS = {
  accepted:  "badge--success",
  pending:   "badge--warning",
  rejected:  "badge--danger",
  completed: "badge--info",
};

export default function Swaps() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("admin/swaps/")
      .then(res => { setSwaps(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Swap Requests</h2>
          <p className="page-header__subtitle">{swaps.length} total swap requests</p>
        </div>
      </div>

      <div className="data-card">
        {loading ? (
          <div className="empty-state">Loading swaps…</div>
        ) : swaps.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔄</div>
            <p>No swap requests yet.</p>
          </div>
        ) : (
          <div className="item-list">
            {swaps.map(s => (
              <div className="item-row" key={s.id}>
                <div className="item-row__left">
                  <div className="item-row__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 5h10M10 2l3 3-3 3M13 11H3M6 8l-3 3 3 3"
                        stroke="var(--accent)" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="item-row__title">
                      {s.requester_name} → {s.provider_name}
                    </div>
                    <div className="item-row__sub">Swap #{s.id}</div>
                  </div>
                </div>
                <div className="item-row__right">
                  <span className={`badge ${STATUS_CLASS[s.status] ?? "badge--default"}`}>
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="data-card__footer">
          {swaps.length} swap requests total
        </div>
      </div>
    </div>
  );
}