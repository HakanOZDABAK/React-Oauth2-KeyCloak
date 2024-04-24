import { useEffect, useState } from "react";
import "./App.css";
import Keycloak, { KeycloakInstance } from "keycloak-js";
import axios from "axios";

const keyCloakOptions = {
  url: "http://localhost:8180",
  realm: "oauth2-demo-realm",
  clientId: "oauth2-demo-pcke-client",
};
const handleToHomeAdmin = async(token:any)=>{
  console.log(await axios.get("http://localhost:8080/api/home/admin",
  {headers:{
    Accept:"application/json",
    Authorization: "Bearer " + token
  }}
)) 
}
const handleToHomeUser = async(token:any)=>{
  console.log(await axios.get("http://localhost:8080/api/home/user",
  {headers:{
    Accept:"application/json",
    Authorization: "Bearer " + token
  }}
)) 
}
function App() {
  const [keyCloak, setKeyCloak] = useState<Keycloak | null>(null);
  useEffect(() => {
    const initKeyCloak = async () => {
      const keyCloakInstance = new Keycloak(keyCloakOptions);

      try {
        await keyCloakInstance.init({ onLoad: "login-required"})
        setKeyCloak(keyCloakInstance)
        if (keyCloakInstance.authenticated) {
          console.log(keyCloakInstance);
        }
      } catch (error) {
        console.log(error);
      }
    };
    initKeyCloak()
  }, []);

  const handleLogOut = () => {if(keyCloak){keyCloak.logout()}};
  return <div>
    <button onClick={()=>handleToHomeUser(keyCloak?.token)}>Veriyi çağır</button>
    <button onClick={()=>handleToHomeAdmin(keyCloak?.token)}>ADMİN - Veriyi çağır</button>
    <button onClick={()=>handleLogOut()}>çıkış yap</button>
  </div>
}

export default App;
