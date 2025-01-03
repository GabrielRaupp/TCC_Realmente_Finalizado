import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [telefone, setTelefone] = useState('');
  const [userType, setUserType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !email || (userType === 'Estudante' && !campus)) {
      setErrorMessage('Todos os campos obrigatórios devem ser preenchidos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, telefone, campus, userType }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário');
      }

      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.cadastro}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.campo}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            placeholder="Digite seu nome de usuário"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="password">Senha:</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <span
              className={styles.passwordToggleIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? '👁️' : '🙈'}
            </span>
          </div>
        </div>

        <div className={styles.campo}>
          <label htmlFor="telefone">Número de Telefone:</label>
          <InputMask
            mask="(99) 99999-9999"
            value={telefone}
            onChange={(event) => setTelefone(event.target.value)}
          >
            {() => <input type="text" id="telefone" placeholder="Digite seu telefone" />}
          </InputMask>
        </div>

        <div className={styles.campo}>
          <label htmlFor="userType">Tipo de Conta:</label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            required
          >
            <option value="">Selecione o tipo de conta</option>
            <option value="Usuario">Usuário</option>
            <option value="Estudante">Estudante</option>
          </select>
        </div>

        {userType === 'Estudante' && (
          <div className={styles.campo}>
            <label htmlFor="campus">Campus:</label>
            <select
              id="campus"
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              required
              >
             <option value="IFC Campus Araquari">IFC Campus Araquari</option>
            <option value="IFC Campus Avançado Abelardo Luz">IFC Campus Avançado Abelardo Luz</option>
            <option value="IFC Campus Avançado Brusque">IFC Campus Avançado Brusque</option>
            <option value="IFC Campus Blumenau">IFC Campus Blumenau</option>
            <option value="IFC Campus Brusque">IFC Campus Brusque</option>
            <option value="IFC Campus Camboriú">IFC Campus Camboriú</option>
            <option value="IFC Campus Concórdia">IFC Campus Concórdia</option>
            <option value="IFC Campus Fraiburgo">IFC Campus Fraiburgo</option>
            <option value="IFC Campus Ibirama">IFC Campus Ibirama</option>
            <option value="IFC Campus Luzerna">IFC Campus Luzerna</option>
            <option value="IFC Campus Rio do Sul">IFC Campus Rio do Sul</option>
            <option value="IFC Campus Santa Rosa do Sul">IFC Campus Santa Rosa do Sul</option>
            <option value="IFC Campus São Bento do Sul">IFC Campus São Bento do Sul</option>
            <option value="IFC Campus São Francisco do Sul">IFC Campus São Francisco do Sul</option>
            <option value="IFC Campus Sombrio">IFC Campus Sombrio</option>
            <option value="IFC Campus Videira">IFC Campus Videira</option>
          </select>
        </div>
        )}

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <Link to="/login" className={styles.option}>Já tenho conta</Link>

        <button className={styles.btnSubmit} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
