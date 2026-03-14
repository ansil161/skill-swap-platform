
import { useEffect, useState } from "react";
import api from "../../api/axios";
import '../styles/sessionlist.css'

function SessionList() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(null); 

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = () => {
        setLoading(true);
        api.get('session/')
            .then((res) => {
                setSessions(res.data);
            })
            .catch(err => {
                console.log(err?.response?.data);
                alert('Failed to load sessions');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const updateStatus = (id, newStatus) => {
        setUpdateLoading(id); 
        
        api.patch(`session_update/${id}/`, {
            status: newStatus
        })
        .then((res) => {
           
            setSessions(sessions.map(session => 
                session.id === id ? { ...session, status: newStatus } : session
            ));
            alert('Status updated successfully!');
        })
        .catch(err => {
            console.log(err?.response?.data);
            alert('Failed to update status');
        })
        .finally(() => {
            setUpdateLoading(null);
        });
    };

    const getStatusColor = (status) => {
        switch(status?.toLowerCase()) {
            case 'completed': return 'status-completed';
            case 'cancelled': return 'status-cancelled';
            case 'pending': return 'status-pending';
            case 'scheduled': return 'status-scheduled';
            default: return 'status-default';
        }
    };

    if (loading) {
        return <div className="loading">Loading sessions...</div>;
    }

    return (
        <div className="session-list-container">
            <h2 className="page-title">My Sessions</h2>
            
            {sessions.length === 0 ? (
                <p className="no-sessions">No sessions found</p>
            ) : (
                <div className="sessions-grid">
                    {sessions.map((session, index) => (
                        <div key={session.id || index} className="session-card">
                            <div className="session-header">
                                <h3>Session #{session.id}</h3>
                                <span className={`status-badge ${getStatusColor(session.status)}`}>
                                    {session.status}
                                </span>
                            </div>
                            
                            <div className="session-details">
                                <div className="detail-row">
                                    <span className="label">Mentor:</span>
                                    <span className="value">{session.mentor}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Learner:</span>
                                    <span className="value">{session.learner}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Date:</span>
                                    <span className="value">{session.date}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Time:</span>
                                    <span className="value">{session.time}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Duration:</span>
                                    <span className="value">{session.duration} mins</span>
                                </div>
                            </div>
                            
                            <div className="update-section">
                                <label htmlFor={`status-${session.id}`}>Update Status:</label>
                                <select 
                                    id={`status-${session.id}`}
                                    value={session.status} 
                                    onChange={(e) => updateStatus(session.id, e.target.value)}
                                    disabled={updateLoading === session.id}
                                    className="status-dropdown"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SessionList;