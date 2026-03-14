import { useState } from "react"
import api from "../../api/axios"

function Sessionform({swapid}){

    const[date,setdate]=useState('')
    const[time,settime]=useState('')
    const[duration,setduration]=useState(60)


    function handlesubmit(e){
        e.preventDefault()
        api.post('session/',{
            swap_id:swapid,
            date:date,
            time:time,
            duration:duration

            
        })
        .then((res)=>{
            console.log('session is created')
            alert('session is created succes')
            
        })
.catch(err=>{
    console.log(err?.response?.data)
    alert('session is created fail')
})

    }

    return (
        <>
        <form onSubmit={handlesubmit}>
            <input type="date" value={date} onChange={(e)=>setdate(e.target.value)} placeholder="Date" required/>
            <input type="time" value={time} onChange={(e)=>settime(e.target.value)}placeholder='Time' required/>
            <input type="number" value={duration}  onChange={(e)=>setduration(e.target.value)} placeholder="Dutation" required />
            <button >Create Session</button>

        </form>
        
        </>
    )

}

export default Sessionform