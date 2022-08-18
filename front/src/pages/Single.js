import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const Single = ({ currentUser, socket }) => {
  const { id } = useParams();
  const [userItems, setUserItems] = useState([]);
  const [user, setUser] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("Select an item to send request")

  useEffect(() => {
    socket.on("updt", () => {
      setData()
    })
    setData();
    
  }, []);
  function setData() {
    
    const user = {
      id: id,
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    };

    fetch("http://localhost:4001/userItems", options)
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setUserItems(data.message);
      });
  }

  function addToCart(item) {
    if (currentUser === user.username) {
      setMessage("You can't request your own items")
      return ;
    }
    const itemInCart = cart.some((x) => x._id === item._id);
    if (!itemInCart) {
      setCart([...cart, item]);
    } else {
      const filteredCart = cart.filter((x) => x._id !== item._id);
      setCart([...filteredCart]);
    }
  }

  function sendCart () {
    const request = {
      owner: user.username,
      items: cart
    }
    
    socket.emit('sendCart', request)
    setMessage("Request sent")
    setCart([])
  }
  return (
    <div className="singleWrapper">
      <div className="topWrapper">
        <div>
          <img src={user.image} alt="" style={{ width: "200px" }} />
          <h2>{user.username} is giving away:</h2>
        </div>
        <div>
          <div>
            <h3>Your request:</h3>
          </div>
          <div className="smallWrap">
            {cart.length > 0 ? (
              cart.map((x, i) => {
                return (
                  <div key={i}>
                    <img src={x.img} alt="" style={{ width: "100px" }} />
                    <h4>{x.title}</h4>
                  </div>
                );
              })
            ) : (
              <div>
                <h4>{message}</h4>
              </div>
            )}
          </div>
        </div>
        <button className="sendBttn" disabled={cart.length > 0? false : true} onClick={sendCart} >Send Request</button>
      </div>
      <div className="usersWrapper">
        {userItems &&
          userItems.map((x, i) => {
            return (
              <div key={i} className="userWrap" onClick={() => addToCart(x)}>
                <img src={x.img} alt="" />
                <h2>{x.title}</h2>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Single;
