import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const { login, logout, user } = useContext(AuthContext); // Utilisation du contexte d'authentification
    const terminalEndRef = useRef(null);

    useEffect(() => {
        // Message de bienvenue
        setHistory([
            {
                command: '',
                output: `<pre>$$$$$$$\\ $$$$$$$$\\  $$$$$$\\  $$\\       $$$$$$\\  $$$$$$\\  $$\\   $$\\ $$$$$$$$\\ $$$$$$$\\  
$$  __$$\\\\__$$  __|$$  __$$\\ $$ |      \\_$$  _|$$  __$$\\ $$ | $$  |$$  _____|$$  __$$\\ 
$$ |  $$ |  $$ |   $$ /  \\__|$$ |        $$ |  $$ /  \\__|$$ |$$  / $$ |      $$ |  $$ |
$$$$$$$\\ |  $$ |   $$ |      $$ |        $$ |  $$ |      $$$$$  /  $$$$$\\    $$$$$$$  |
$$  __$$\\   $$ |   $$ |      $$ |        $$ |  $$ |      $$  $$<   $$  __|   $$  __$$< 
$$ |  $$ |  $$ |   $$ |  $$\\ $$ |        $$ |  $$ |  $$\\ $$ |\\$$\\  $$ |      $$ |  $$ |
$$$$$$$  |  $$ |   \\$$$$$$  |$$$$$$$$\\ $$$$$$\\ \\$$$$$$  |$$ | \\$$\\ $$$$$$$$\\ $$ |  $$ |
\\_______/   \\__|    \\______/ \\________|\\______| \\______/ \\__|  \\__|\\________|\\__|  \\__|</pre><br>`,
            }
        ]);
    }, []);

    const handleCommand = async (command) => {
        let output = '';
        const args = command.split(' ');

        switch (args[0]) {
            case '/register':
                if (args.length < 3) {
                    output = 'Usage: /register username assword>';
                } else {
                    try {
                        const response = await fetch('http://localhost:3001/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: args[1], password: args[2] }),
                        });

                        if (response.ok) {
                            output = `Utilisateur "${args[1]}" enregistré avec succès.`;
                        } else {
                            const errorData = await response.json();
                            output = `Erreur lors de l'enregistrement : ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Erreur réseau : ${error.message}`;
                    }
                }
                break;

            case '/login':
                if (args.length < 3) {
                    output = 'Usage: /login username password';
                } else {
                    try {
                        const response = await fetch('http://localhost:3001/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: args[1], password: args[2] }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            login(data.token, { username: args[1] }); // Utilisation du contexte pour gérer la session
                            output = `Connecté en tant que "${args[1]}".`;
                        } else {
                            const errorData = await response.json();
                            output = `Erreur de connexion : ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Erreur réseau : ${error.message}`;
                    }
                }
                break;

            case '/logout':
                if (user) {
                    logout(); // Déconnexion via le contexte
                    output = `Déconnexion réussie.`;
                } else {
                    output = 'Aucun utilisateur connecté.';
                }
                break;

            case '/help':
                output = 'Commandes disponibles: /register, /login, /logout, /help, /clear, /exit';
                break;

            case '/clear':
                setHistory([
            {
                command: '',
                output: `<pre>$$$$$$$\\ $$$$$$$$\\  $$$$$$\\  $$\\       $$$$$$\\  $$$$$$\\  $$\\   $$\\ $$$$$$$$\\ $$$$$$$\\  
$$  __$$\\\\__$$  __|$$  __$$\\ $$ |      \\_$$  _|$$  __$$\\ $$ | $$  |$$  _____|$$  __$$\\ 
$$ |  $$ |  $$ |   $$ /  \\__|$$ |        $$ |  $$ /  \\__|$$ |$$  / $$ |      $$ |  $$ |
$$$$$$$\\ |  $$ |   $$ |      $$ |        $$ |  $$ |      $$$$$  /  $$$$$\\    $$$$$$$  |
$$  __$$\\   $$ |   $$ |      $$ |        $$ |  $$ |      $$  $$<   $$  __|   $$  __$$< 
$$ |  $$ |  $$ |   $$ |  $$\\ $$ |        $$ |  $$ |  $$\\ $$ |\\$$\\  $$ |      $$ |  $$ |
$$$$$$$  |  $$ |   \\$$$$$$  |$$$$$$$$\\ $$$$$$\\ \\$$$$$$  |$$ | \\$$\\ $$$$$$$$\\ $$ |  $$ |
\\_______/   \\__|    \\______/ \\________|\\______| \\______/ \\__|  \\__|\\________|\\__|  \\__|</pre><br>`,
            }
        ]);
                return;

            case '/exit':
                output = 'Fermeture du terminal...';
                break;

            default:
                output = `Commande inconnue: ${command}`;
        }

        setHistory([...history, { command, output }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input.trim());
            setInput('');
        }
    };

    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    return (
        <div className="bg-black text-white font-mono p-4 h-full w-full flex flex-col rounded-lg shadow-lg border border-gray-700">
            <div className="flex-1 text-[10px] overflow-y-auto mb-2">
                {history.map((entry, index) => (
                    <div key={index}>
                        {entry.command && (
                            <p>
                                <span className="text-white">&gt; {entry.command}</span>
                            </p>
                        )}
                        <p dangerouslySetInnerHTML={{ __html: entry.output }} />
                    </div>
                ))}
                <div ref={terminalEndRef} />
            </div>
            <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-white mx-2">
                    {user ? `${user.username}>` : '>'}
                </span>
                <input
                    type="text"
                    className="flex-1 bg-black text-white p-2 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Entrez une commande..."
                />
            </form>
        </div>
    );
};

export default Terminal;