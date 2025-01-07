import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom'; 
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
    if (command.includes('meu nome de usuário é')) {
      setUsername(command.replace('meu nome de usuário é', '').trim());
    } else if (command.includes('minha senha é')) {
      setPassword(command.replace('minha senha é', '').trim());
    } else if (command.includes('meu email é')) {
      const emailCommand = command.replace('meu email é', '').trim();
      if (/\S+@\S+\.\S+/.test(emailCommand)) {
        setEmail(emailCommand);
      } else {
        alert('E-mail inválido.');
      }
    } else if (command.includes('meu telefone é')) {
      const phoneCommand = command.replace('meu telefone é', '').trim();
      if (/^\(\d{2}\) \d{5}-\d{4}$/.test(phoneCommand)) {
        setTelefone(phoneCommand);
      } else {
        alert('Telefone inválido.');
      }
    } else if (command.includes('meu campus é')) {
      setCampus(command.replace('meu campus é', '').trim());
    } else if (command === 'submeter') {
      document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
    } else {
      alert('Comando não reconhecido.');
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
      const transcript = event.results[0][0].transcript.toLowerCase();
      processVoiceCommand(transcript);
    };

    recognition.start();
  };

  return (
    <div className={styles.cadastro}>
      <h2>Cadastro</h2>
      <button
        onClick={handleVoiceInput}
        className={styles.voiceButton}
      >
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

        <Link to="/login" className={styles.option}>Já tenho conta</Link>

        <button className={styles.btnSubmit} type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
