import React, { useState, useEffect } from 'react';
import styles from './Home.module.css';
import savings from '../../img/savings.svg';

import LinkButton from '../layout/LinkButton';

function Home({ isAuthenticated, onAddHorario, onRegisterUser }) {
  const [isListening, setIsListening] = useState(false);
  const [command, setCommand] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Seu navegador não suporta a API de reconhecimento de voz.');
    }
  }, []);

  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setCommand(transcript);
      executeCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Erro de reconhecimento: ', event.error);
      setMessage('Erro ao reconhecer o comando.');
    };

    recognition.start();
  };

  const executeCommand = (transcript) => {
    const intent = interpretCommand(transcript);

    switch (intent) {
      case 'adicionar_horario':
        if (!isAuthenticated) {
          setMessage('Você precisa estar logado para adicionar horários.');
          return;
        }
        setMessage('Por favor, forneça os detalhes do horário.');
        onAddHorario({
          name: 'Aula de Matemática',
          horarios: new Date().toISOString(),
          category: 'Prova',
          avisoAntecedencia: '30',
        });
        break;
      case 'registrar_usuario':
        setMessage('Por favor, diga o nome de usuário.');
        onRegisterUser({
          username: 'NOVO_USUARIO',
          password: 'SENHA123',
        });
        break;
      case 'bem_vindo':
        setMessage('OLÁ! BEM-VINDO AO INTELAGEND!');
        break;
      case 'ajuda':
        setMessage('VOCÊ PODE ADICIONAR HORÁRIOS OU REGISTRAR UMA CONTA.');
        break;
      default:
        setMessage('Comando não reconhecido.');
        break;
    }
  };

  const interpretCommand = (transcript) => {
    const normalizedTranscript = transcript.trim();
    console.log(normalizedTranscript);  // Add logging for debugging

    const intents = [
      { keywords: ['adicionar', 'horário', 'criar evento'], intent: 'adicionar_horario' },
      { keywords: ['registrar', 'criar conta', 'cadastrar usuário'], intent: 'registrar_usuario' },
      { keywords: ['bem-vindo', 'olá', 'oi'], intent: 'bem_vindo' },
      { keywords: ['ajuda', 'instruções', 'como usar'], intent: 'ajuda' },
    ];

    for (const { keywords, intent } of intents) {
      if (keywords.some((keyword) => normalizedTranscript.toLowerCase().includes(keyword.toLowerCase()))) {
        return intent;
      }
    }

    // Special character and case handling
    const specialCharacterPattern = /[^a-zA-Z0-9\s]/;
    const allCapsPattern = /^[A-Z\s]+$/;

    if (specialCharacterPattern.test(normalizedTranscript)) {
      setMessage('Comando contém caracteres especiais.');
    } else if (allCapsPattern.test(normalizedTranscript)) {
      setMessage('Comando reconhecido com todas as letras maiúsculas.');
    }

    return 'unknown';
  };

  return (
    <section className={styles.home_container}>
      <h1>
        Bem-vindo ao <span>IntelAgend</span>
      </h1>
      <p>Crie sua conta para começar a usufruir do nosso sistema!</p>
      <LinkButton className={styles.create} to="/Cadastro" text="Criar conta " />
      <img src={savings} alt="Savings" />

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={startListening}
          disabled={isListening}
          className={styles.voice_button}
        >
          {isListening ? 'Ouvindo...' : 'Clique para falar'}
        </button>
        <p>Comando reconhecido: <b>{command}</b></p>
        <p>Status: {message}</p>
      </div>
    </section>
  );
}

export default Home;
