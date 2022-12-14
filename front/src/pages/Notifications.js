import { useEffect, useState } from "react";

const Notifications = ({ socket, currentUser, requestss, setRequests}) => {
  useEffect(() => {
    checkNotif();
  console.log(requestss);
  }, []);
  function checkNotif() {
    socket.emit("notify", currentUser);

    socket.on("myRequests", (userRequests) => {
      const currentRequests = userRequests.filter(
        (x) => x.owner === currentUser
      );
      setRequests(currentRequests);
    });
  }
  function accept(rqst) {
    socket.emit("acceptRequest", rqst);
    setTimeout(() => {
      checkNotif();
    }, "2000");
  }
  function decline(rqst) {
    socket.emit("declineRequest", rqst);
    checkNotif();
  }

  return requestss? (
    requestss.map((x, i) => {
      return (
        <div key={i} className="notifWrap">
        <div>

          <h3>Request by: {x.requestor}</h3>
          {x.items.map((y, india) => (
            <div key={india}>
              <img src={y.img} alt="" style={{ width: "200px" }} />
              <h5>{y.title}</h5>
            </div>
          ))}
        </div>
          <div className="buttonWrap">
            <button onClick={() => accept(x)}>Accept</button>
            <button onClick={() => decline(x)}>Decline</button>
          </div>
        </div>
      );
    })
  ) : (
    <h2>No requests yet</h2>
  );
};

export default Notifications;
