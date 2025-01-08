import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [campus, setCampus] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isListening, setIsListening] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email, telefone, campus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar usuário');
      }

      alert('Usuário cadastrado com sucesso!');
      navigate('/login');
    } catch (error) {
      alert(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const processVoiceCommand = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    const regex = {
      username: /nome\s*de\s*usuário\s*(é|:|é\s)?\s*([\w\s]+)/,
      password: /senha\s*(é|:|é\s)?\s*([\w!@#$%^&*]+)/,
      email: /email\s*(é|:|é\s)?\s*([\w._%+-]+@[a-z0-9.-]+\.[a-z]{2,})/,
      telefone: /telefone\s*(é|:|é\s)?\s*((\(\d{2}\)\s*\d{4,5}-\d{4})|(\d{10,11}))/,
      campus: /campus\s*(é|:|é\s)?\s*([\w\s]+)/,
    };

    if (regex.username.test(normalizedCommand)) {
      const value = normalizedCommand.match(regex.username)[2].trim();
      setUsername(value);
      alert(`Nome de usuário preenchido: ${value}`);
    }

    if (regex.password.test(normalizedCommand)) {
      const value = normalizedCommand.match(regex.password)[2].trim();
      setPassword(value);
      alert(`Senha preenchida: ${value}`);
    }

    if (regex.email.test(normalizedCommand)) {
      const value = normalizedCommand.match(regex.email)[2].trim();
      setEmail(value);
      alert(`Email preenchido: ${value}`);
    }

    if (regex.telefone.test(normalizedCommand)) {
      const value = normalizedCommand.match(regex.telefone)[2].replace(/\D/g, '');
      const formattedPhone = value.replace(/^\(?(\d{2})\)?\s?(\d{4,5})(\d{4})$/, '($1) $2-$3');
      setTelefone(formattedPhone);
      alert(`Telefone preenchido: ${formattedPhone}`);
    }

    if (regex.campus.test(normalizedCommand)) {
      const campuses = [
        'ifc campus araquari',
        'ifc campus avançado abelardo luz',
        'ifc campus avançado brusque',
        'ifc campus blumenau',
        'ifc campus brusque',
        'ifc campus camboriú',
        'ifc campus concórdia',
        'ifc campus fraiburgo',
        'ifc campus ibirama',
        'ifc campus luzerna',
        'ifc campus rio do sul',
        'ifc campus santa rosa do sul',
        'ifc campus são bento do sul',
        'ifc campus são francisco do sul',
        'ifc campus sombrio',
        'ifc campus videira',
      ];

      const value = normalizedCommand.match(regex.campus)[2].trim();
      const matchedCampus = campuses.find((c) => value.includes(c.toLowerCase()));
      if (matchedCampus) {
        setCampus(matchedCampus);
        alert(`Campus selecionado: ${matchedCampus}`);
      } else {
        alert('Campus não reconhecido.');
      }
    }

    if (normalizedCommand.includes('cadastrar') || normalizedCommand.includes('enviar')) {
      document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processVoiceCommand(transcript);
    };

    recognition.start();
  };

  return (
    <div className={styles.cadastro}>
      <h2>Cadastro</h2>
      <button onClick={handleVoiceInput} className={styles.voiceButton}>
        {isListening ? 'Ouvindo...' : 'Usar comando de voz'}
      </button>
      <form onSubmit={handleSubmit}>
        <div className={styles.campo}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            placeholder="Digite seu nome de usuário"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
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
          <label htmlFor="campus">Campus:</label>
          <select
            id="campus"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
            required
          >
            <option value="">Selecione um campus</option>
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

        <div className={styles.submitButton}>
          <button type="submit">Cadastrar</button>
        </div>
      </form>

      <div className={styles.loginRedirect}>
        <p>Já tem uma conta? <Link to="/login">login</Link></p>
      </div>
    </div>
  );
};

export default Cadastro;
