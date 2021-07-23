import React from 'react';
import api from '../../services/api';
import './styles.css'

import alertify from 'alertifyjs';

function DevItem({ dev }) {

    async function handleDelete(dev) {
        alertify.confirm('Confirmar exclusão', `Tem certeza que quer excluir ${dev.name}?`,
            async () => {
                await api.delete('/devs/' + dev._id);
                window.location.reload();
            }, () => {
                alertify.error('Exclusão cancelada');
            });
    }

    async function handleName(dev, atr) {
        alertify.prompt('Editar Nome', 'Entre com o novo atributo', `${atr}`,
            async (evt, value) => {
                const params = {
                    name: value
                }
                api.put('/devs/' + dev._id, params);
                window.location.reload();
            }, () => {
                alertify.error('Edição cancelada')
            });
    }

    async function handleTecno(dev, atr) {
        alertify.prompt('Editar Tecnologias', 'Entre com o novo atributo', `${atr}`,
            async (evt, value) => {
                const params = {
                    tecno: value
                }
                api.put('/devs/' + dev._id, params);
                window.location.reload();
            }, () => {
                alertify.error('Edição cancelada')
            });
    }

    async function handleBio(dev, atr) {
        alertify.prompt('Editar Bio', 'Entre com o novo atributo', `${atr}`,
            async (evt, value) => {
                const params = {
                    bio: value
                }
                api.put('/devs/' + dev._id, params);
                window.location.reload();
            }, () => {
                alertify.error('Edição cancelada')
            });
    }

    return (
        <li className="dev-item">
            <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                    <div className="button-list">
                        <button onClick={() => handleDelete(dev)} id="delete">Excluir</button>
                    </div>
                    <strong onClick={() => handleName(dev, dev.name)}>{dev.name}</strong>
                    <span onClick={() => handleTecno(dev, dev.tecno)}>{dev.tecno.join(', ')}</span>
                </div>
            </header>
            <p onClick={() => handleBio(dev, dev.bio)}>{dev.bio}</p>
            <a target="window" href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
        </li>
    );
}

export default DevItem;