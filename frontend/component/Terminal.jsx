import React, { useState } from 'react';

const Terminal = () => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState({});
    const [currentUser, setCurrentUser] = useState(null);

    const handleCommand = (command) => {
        let output = '';
        const args = command.split(' ');

        switch (args[0]) {
            case '/register':
                if (args.length < 3) {
                    output = 'Usage: /register <username> <password>';
                } else if (users[args[1]]) {
                    output = `L'utilisateur "${args[1]}" existe déjà.`;
                } else {
                    setUsers({ ...users, [args[1]]: args[2] });
                    output = `Utilisateur "${args[1]}" enregistré avec succès.`;
                }
                break;

            case '/login':
                if (args.length < 3) {
                    output = 'Usage: /login <username> <password>';
                } else if (!users[args[1]]) {
                    output = `L'utilisateur "${args[1]}" n'existe pas.`;
                } else if (users[args[1]] !== args[2]) {
                    output = 'Mot de passe incorrect.';
                } else {
                    setCurrentUser(args[1]);
                    output = `Connecté en tant que "${args[1]}".`;
                }
                break;

            case '/logout':
                if (currentUser) {
                    output = `Déconnexion de "${currentUser}".`;
                    setCurrentUser(null);
                } else {
                    output = 'Aucun utilisateur connecté.';
                }
                break;

            case '/help':
                output = 'Commandes disponibles: /register, /login, /logout, /help, /clear, /exit';
                break;

            case '/clear':
                setHistory([]);
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

    return (
        <div className="bg-black text-white font-mono p-4 h-full w-full flex flex-col rounded-lg shadow-lg border border-gray-700">
            <div className="flex-1 text-[10px] overflow-y-auto mb-2">
                {history.map((entry, index) => (
                    <div key={index}>
                        <p>
                            <span className="text-white">&gt; {entry.command}</span>
                        </p>
                        <p>{entry.output}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-white mr-1">
                    {currentUser ? `${currentUser}>` : '>'}
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