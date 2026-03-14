
import { useState } from "react"
import api from "../../api/axios"
import "./Sessionform.css" 

function Sessionform({ swapid }) {
    const [date, setdate] = useState('')
    const [time, settime] = useState('')
    const [duration, setduration] = useState(60)
    const [loading, setLoading] = useState(false)

    function handlesubmit(e) {
        e.preventDefault()
        setLoading(true) 

        api.post('session/', {
            swap_id: swapid,
            date: date,
            time: time,
            duration: duration
        })
            .then((res) => {
                console.log('session is created')
                alert('Session created successfully!')
          
                setdate('')
                settime('')
            })
            .catch(err => {
                console.log(err?.response?.data)
                alert('Failed to create session')
            })
            .finally(() => {
                setLoading(false) 
            })
    }

    return (
        <div className="session-container">
            <div className="session-card">
                <h2 className="session-title">Book a Session</h2>
                <form onSubmit={handlesubmit} className="session-form">
                    
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input 
                            id="date"
                            type="date" 
                            value={date} 
                            onChange={(e) => setdate(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="time">Time</label>
                        <input 
                            id="time"
                            type="time" 
                            value={time} 
                            onChange={(e) => settime(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="duration">Duration (minutes)</label>
                        <input 
                            id="duration"
                            type="number" 
                            min="15" 
                            step="15"
                            value={duration} 
                            onChange={(e) => setduration(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Booking..." : "Confirm Session"}
                    </button>

                </form>
            </div>
        </div>
    )
}

export default Sessionform