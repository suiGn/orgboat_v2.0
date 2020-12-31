import React, { useEffect, useState } from "react";
import blue_helm2 from "../Images/blue_helm2.png"
import Response from "./response";

function ResetPass (props){
    const [rstEmail,setMail] = useState('');
    const [submit,setSubmit] = useState(false);
    const [ok,setOk] =  useState(false);
    const [msg,setMesage] = useState('');
    const [msg2,setMsg2] = useState('');
    function handleChange(e){
        setMail(e.target.value);
    }
    useEffect(()=>{    
    },[])
    function handleSubmit(e){
            e.preventDefault();
            setSubmit(true);
            if(!rstEmail){
                return;
            }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rstEmail })
            }
            (async () => {
                const response = await fetch("/rstpwd" , requestOptions);
                const data = await response.json();
                setOk(data.ok);
                console.log(data.ok);
                if(data.ok){
                    setMesage('Please check your inbox to reset your password')
                    console.log(msg);
                    //return(<Response mgs="Please check your inbox to reset your password" msg2 ="Sent Successfully"/>)
                }else{
                    //return(<Response mgs="Please try again." msg2 ="Error"/>)
                }
            })();
    }
    return(
        <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <title>OrgBoat Reset Password</title>
        <div className="form-wrapper">
          {/* logo */}
          <div className="logo">
            <a href="/">  <img src={blue_helm2} width={55} height alt="Blue Helm" /> </a>
          </div>
          {/* ./ logo */}
          <h5>Reset password</h5>
          {/* form */}
          <form name="reset" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" className="form-control" name="rstEmail" placeholder="E-mail" required autofocus value={rstEmail} onChange={handleChange}/>
            </div>
            <button className="btn btn-primary btn-block">Submit</button>
            <hr />
            <p className="text-muted">Take a different action.</p>
            <a href="/signup" className="btn btn-sm btn-outline-light mr-1">Subscribe!</a>
            or
            <a href="/" className="btn btn-sm btn-outline-light ml-1">Login!</a>
          </form>
          {/* ./ form */}
        </div>
        {/* Bundle */}
        {/* App scripts */}
      </div>      
    )
}

export default ResetPass;