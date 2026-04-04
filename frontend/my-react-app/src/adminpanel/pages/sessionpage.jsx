import { useEffect, useState } from "react";
import api from "../../api/axios";
import "../styles/table.css";

const STATUS_CLASS = {
  active:    "badge--success",
  scheduled: "badge--info",
  pending:   "badge--warning",
  cancelled: "badge--danger",
  completed: "badge--default",
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("admin/sessions/")
      .then(res => { setSessions(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Sessions</h2>
          <p className="page-header__subtitle">{sessions.length} total sessions</p>
        </div>
      </div>

      <div className="data-card">
        {loading ? (
          <div className="empty-state">Loading sessions…</div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">📹</div>
            <p>No sessions found.</p>
          </div>
        ) : (
          <div className="item-list">
            {sessions.map(s => (
              <div className="item-row" key={s.id}>
                <div className="item-row__left">
                  <div className="item-row__icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="1.5" y="2.5" width="13" height="10" rx="1.5"
                        stroke="var(--accent)" strokeWidth="1.5" />
                      <path d="M6 6.5l2.5 2L11 6"
                        stroke="var(--accent)" strokeWidth="1.5"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="item-row__title">
                      {s.mentor_name} teaching {s.learner_name}
                    </div>
                    <div className="item-row__sub">Session #{s.id}</div>
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
          {sessions.length} sessions total
        </div>
      </div>
    </div>
  );
}