import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Main = () => {
  const [users, setUsers] = useState();
  const nav = useNavigate();
  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    };
    fetch("http://localhost:4001/userdb", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setUsers(data);
      });
  }, []);
  function toUser(id) {
    nav(`/single/${id}`);
  }

  return (
    <div className="usersWrapper">
      {users &&
        users.message.map((x, i) => {
          return (
            <div key={i} onClick={() => toUser(x._id)} className="userWrap">
              <img src={x.image} alt="" style={{ width: "200px" }} />
              <h2>{x.username}</h2>
            </div>
          );
        })}
    </div>
  );
};

export default Main;
