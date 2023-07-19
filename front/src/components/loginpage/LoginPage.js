import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logo } from "../../assents/img/exportImages";
import {
    requestDataUser,
    useRequestDataUser,
  } from "../../hooks/useRequestDataUser";
import { goToHomePage, goToSignupPage } from "../../routes/coordinator";
import { onChangeForm } from "../../utils/onChangeForm";




export const LoginPage = () =>{
    const navigate = useNavigate();

    const [loadingData, loading, error, setError, errorMessage] =
    useRequestDataUser();

  const [data, setData] = useState({});

  const [showPassword, setShowPassword] = useState("password");

  const [form, setForm] = useState({ email: "", password: "" });

  const registeringUser = async (e) => {
    e.preventDefault();

    setData(await loadingData("login", form));
  };

// error &&
//     toast.error(errorMessage.response.data, {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     }) &&
//     setError(false);

useEffect(() => {
    if (data?.token) {
      localStorage.setItem("token", data.token);

      goToHomePage(navigate);
    }
  }, [data]);

return (
<div>
    <div Align = "Center" >
        <img w="84px" h="84.02px" top="133px" left="167px"  src={logo} alt="Logo"/>

        <h2 w="152px" h="47px" top="22px" left="134px"
        Fonts=" IBM Plex Sans" Size=" 36px" color="#373737"
       >LabEddit</h2>l

        <p>O projeto de rede social Labenu</p>
    </div>

    <div Align = "Center">
    <form type="submit">
        <div>
        <input

            id="email"
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={(event) => {
              setForm(onChangeForm(event, form));
            }}
            required
             />
           
        </div>
        <div >
            <input
              id="password"
              name="password"
              type={showPassword}
              placeholder="Senha"
              value={form.password}
              onChange={(event) => setForm(onChangeForm(event, form))}
              required
              
            />

<div>
            {!loading ? (
              <button
                type="submit"
               
                onClick={(e) => registeringUser(e)}
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
               
                disabled
              >
                <div  />
              </button>
            )}
          </div>
          <hr />
          <div>
            <button
              onClick={() => goToSignupPage(navigate)}
              
            >
              Crie uma conta!
            </button>
          </div>
          </div>
    </form>
    </div>

    
</div>
)
}