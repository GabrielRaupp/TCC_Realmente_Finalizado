import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Contas.module.css';

function Contas() {
  const [data, setData] = useState({ users: [], horarios: [] });
  const [loading, setLoading] = useState(true);
  const [visibleHorarios, setVisibleHorarios] = useState({}); 

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

  const toggleHorarios = (userId) => {
    setVisibleHorarios(prevState => ({
      ...prevState,
      [userId]: !prevState[userId] 
    }));
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className={styles.contas_container}>
      
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
                {/* Botão para alternar a visibilidade dos horários */}
                <button onClick={() => toggleHorarios(user._id)}>
                  {visibleHorarios[user._id] ? 'Ocultar horários' : 'Mostrar horários'}
                </button>

                {visibleHorarios[user._id] && (
                  <div>
                    <h3>Horários:</h3>
                    <ul>
                      {data.horarios.filter(horario => horario.user._id === user._id).map(horario => (
                        <li key={horario._id}>
                          <p><span>Nome:</span> {horario.name}</p>
                          <p><span>Categoria:</span> {horario.category}</p>
                          <p><span>Usuário:</span> {horario.user.username}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Contas;
