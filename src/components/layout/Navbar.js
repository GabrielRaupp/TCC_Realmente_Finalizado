import { Link, useNavigate } from "react-router-dom";
import Container from "./Container";
import styles from "./Navbar.module.css";
import logo from "../../img/costs_logo.png";
import { useEffect, useState } from 'react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 
  const [isProfessor, setIsProfessor] = useState(false);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('userRole');  // Supondo que o papel do usuário esteja armazenado como 'userRole'

    console.log('LoggedIn:', loggedInStatus); // Adicionando log para depuração
    console.log('User Role:', loggedInUser); // Verificando o papel do usuário

    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
      if (loggedInUser === "Professores") {
        setIsProfessor(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userRole');  // Remover o papel ao deslogar
    setIsLoggedIn(false);
    setIsProfessor(false);  // Resetar o estado do professor
    window.location.href = '/login'; 
  };

  const handlePerfilClick = () => {
    navigate('/perfil'); 
  };

  return (
    <div className={styles.navbar}>
      <Container>
        <Link to="/">
          <img src={logo} alt="Costs" />
        </Link>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.item}>
            <Link to="/horarios">Agenda</Link>
          </li>
          <li className={styles.item}>
            <Link to="/contact">Contato</Link>
          </li>
          {!isLoggedIn && (
            <li className={styles.item}>
              <Link to="/singup">Minha conta</Link>
            </li>
          )}
          {isLoggedIn && (
            <li className={styles.item}>
              <div className={styles.usericon} onClick={handleLogout}> 
                <Link to="/login">Deslogar</Link>
              </div>
            </li>
          )}
          {isLoggedIn && (
            <li className={styles.item}>
              <Link to="/perfil">
                <div className={styles.usericon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </Link>
            </li>
          )}
          {isProfessor && (
            <li className={styles.item}>
              <Link to="/contas">Contas</Link>
            </li>
          )}
        </ul>
      </Container>
    </div>
  );
}

export default Navbar;
