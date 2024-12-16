import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Contas.module.css';

function Contas() {
  const [data, setData] = useState({ users: [], horarios: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/contas', { withCredentials: true })
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar dados:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.contas_container}>
      <h1>Contas</h1>
      
      <div>
        <h2>Usuários:</h2>
        <div className={styles.contas_card}>
          <ul>
            {data.users.map(user => (
              <li key={user._id}>
                <p><span>Nome:</span> {user.username}</p>
                <p><span>Email:</span> {user.email}</p>
                <p><span>Campus:</span> {user.campus}</p>
                <p><span>Data de criação:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2>Horários:</h2>
        <div className={styles.contas_card}>
          <ul>
            {data.horarios.map(horario => (
              <li key={horario._id}>
                <p><span>Nome:</span> {horario.name}</p>
                <p><span>Categoria:</span> {horario.category}</p>
                <p><span>Usuário:</span> {horario.user.username}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contas;
