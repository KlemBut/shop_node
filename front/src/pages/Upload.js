import { useRef, useState } from "react";

const Upload = () => {
    const [errMssg, setErrMsg] = useState("")
    const imgRef = useRef()
    const titleRef = useRef()
    function uploadItem () {
      const item = {
      img: imgRef.current.value,
      title: titleRef.current.value
    };
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(item),
    };
    fetch("http://localhost:4001/upload", options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setErrMsg(data.message)
        if (data.success){
        imgRef.current.value = ""
        titleRef.current.value = ""
        setErrMsg("Item uploaded")
        }
      });
    }
    return(
        <div className="inputWrapper">

        <div className="inputs">
            <input type="text" placeholder="Image URL" ref={imgRef} />
            <input type="text" placeholder="Title" ref={titleRef}/>
            <p>{errMssg}</p>
            <button onClick={uploadItem}>Upload</button>
        </div>
        </div>
    )
}

export default Upload