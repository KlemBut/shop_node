import { useEffect, useState } from "react";

const Notifications = ({socket, currentUser, notif, setNotif}) => {
    const [requestss, setRequests] = useState()
    checkNotif()
    useEffect(() => {
        socket.on("myRequests", (requests) => {
            const currentRequests = requests.filter(x => x.owner === currentUser)
            setRequests(currentRequests);
            setNotif(currentRequests.length)
            
        })
       
    }, [])
    function checkNotif () {
        socket.emit("notify", currentUser)
        
        socket.on("myRequests", (userRequests) => {
            const currentRequests = userRequests.filter(x => x.owner === currentUser)
            setRequests(currentRequests);
        })
    }
    function accept (rqst) {
        socket.emit("acceptRequest", rqst)
        
    }

    return (
       requestss? requestss.map((x, i ) => {
        return <div key={i}>
        <h3>Request by: {x.requestor}</h3>
        {x.items.map((y, india) => <div key={india}>
            <img src={y.img} alt="" style={{width:"100px"}} />
            <h5>{y.title}</h5>
        </div>)}
        <button onClick={() => accept(x, i)}>Accept</button>
        <button>Decline</button>
        </div>
    })
         : <h2>No requests yet</h2>
    )
}

export default Notifications