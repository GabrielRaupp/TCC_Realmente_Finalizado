import React, { useState } from 'react';
import styles from './deletarConta.module.css';

const DeletarConta = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    
    if (!email) {
      setMessage('Por favor, forneça um e-mail.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/deletarConta', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Envia o email no corpo da requisição
      });

      const data = await response.json();
      setMessage(data.message || 'Erro ao excluir a conta');
    } catch (error) {
      console.error('Erro ao excluir a conta:', error);
      setMessage('Erro ao excluir a conta. Tente novamente.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Excluir Conta</h2>
      <p>Para excluir sua conta, forneça o e-mail associado a ela.</p>
      <form onSubmit={handleDeleteAccount} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>E-mail:</label>
          <input
            type="email"
            id="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Excluir Minha Conta</button>
      </form>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default DeletarConta;
