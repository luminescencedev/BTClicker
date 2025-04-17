import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Terminal = ({ setActiveComponent }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [suggestionIndex, setSuggestionIndex] = useState(-1);
    const { login, logout, user } = useContext(AuthContext);
    const terminalEndRef = useRef(null);

    const commands = [
        '/achievements',
        '/clear',
        '/clicker',
        '/delete',
        '/give',
        '/help',
        '/leaderboard',
        '/login',
        '/logout',
        '/market',
        '/register',
        '/status',
        '/upgrade',
    ];

    useEffect(() => {
        // Welcome message
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
                    output = 'Usage: /register [username] [password]';
                } else {
                    const username = args[1];
                    const password = args[2];

                    // Validation du mot de passe avec une expression régulière
                    const passwordRegex = /^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
                    if (!passwordRegex.test(password)) {
                        output = 'Password must be at least 8 characters long, contain at least one uppercase letter and one special character.';
                        break;
                    }

                    // Validation du nom d'utilisateur (suppression des caractères spéciaux)
                    const usernameRegex = /^[a-zA-Z0-9_]+$/; // uniquement des caractères alphanumériques et underscores
                    if (!usernameRegex.test(username)) {
                        output = 'Username can only contain letters, numbers, and underscores.';
                        break;
                    }

                    // Nettoyage des entrées pour éviter les risques côté serveur
                    const sanitizedUsername = username.replace(/[^a-zA-Z0-9_]/g, '');  // supprime les caractères spéciaux
                    const sanitizedPassword = password.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=~`{}\[\]:;"'<>,.?/\\|]/g, '');  // supprime les caractères non spéciaux autorisés

                    try {
                        const response = await fetch('http://localhost:3001/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: sanitizedUsername, password: sanitizedPassword }),
                        });

                        if (response.ok) {
                            output = `User "${sanitizedUsername}" successfully registered.`;
                        } else {
                            const errorData = await response.json();
                            output = `Registration error: ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Network error: ${error.message}`;
                    }
                }
                break;


            case '/login':
                if (args.length < 3) {
                    output = 'Usage: /login [username] [password]';
                } else {
                    try {
                        const response = await fetch('http://localhost:3001/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: args[1], password: args[2] }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            login(data.token, { username: args[1] });
                            console.log(data.token);
                            output = `Logged in as "${args[1]}".`;
                        } else {
                            const errorData = await response.json();
                            output = `Login error: ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Network error: ${error.message}`;
                    }
                }
                break;

            case '/logout':
                if (user) {
                    logout();
                    output = `Successfully logged out.`;
                    setActiveComponent("");
                } else {
                    output = 'No user is logged in.';
                }
                break;

            case '/help':
                output = `<pre>Available commands:
/achievements - View your achievements
/clear - Clear the terminal
/clicker - Activate the Clicker Tab
/delete [username] [password] - Delete your account
/help - Display this help message
/leaderboard - View the leaderboard
/login [username] [password] - Log in with your credentials
/logout - Log out of your account
/market - Activate the Market Tab
/register [username] [password] - Register a new account
/status - View your current status
/upgrade - Activate the Upgrade Tab</pre>`;
                break;

            case '/clicker':
                if (user) {
                    setActiveComponent("clicker"); // Activer le composant Clicker
                    output = `Clicker component activated for user "${user.username}".`;
                } else {
                    output = 'No user is logged in. Please log in to activate the Clicker component.';
                }
                break;

            case '/market':
                if (user) {
                    setActiveComponent("market"); // Activer le composant Market
                    output = `Market component activated for user "${user.username}".`;
                } else {
                    output = 'No user is logged in. Please log in to activate the Market component.';
                }
                break;

            case '/leaderboard':
                try {
                    const response = await fetch('http://localhost:3001/leaderboard', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (response.ok) {
                        const users = await response.json();
                        output = `<pre>Leaderboard:\n${users
                            .map((user, index) => `${index + 1}. ${user.username} - ${user.balance} BTC`)
                            .join('\n')}</pre>`;
                    } else {
                        const errorData = await response.json();
                        output = `Error fetching leaderboard: ${errorData.error}`;
                    }
                } catch (error) {
                    output = `Network error: ${error.message}`;
                }
                break;

            case '/achievements':
                output = `<pre>Achievements:
1. Achievement 1 - Description of achievement 1
2. Achievement 2 - Description of achievement 2
3. Achievement 3 - Description of achievement 3</pre>`;
                break;


            case '/give':
                if (!user) {
                    output = 'You must be logged in to use this command.';
                    break;
                }

                if (args.length !== 2 || isNaN(args[1]) || Number(args[1]) <= 0) {
                    output = 'Usage: /give [amount] — amount must be a positive number.';
                    break;
                }

                const amount = parseFloat(args[1]);
                const token = localStorage.getItem('token');

                if (!token) {
                    output = 'Authentication token not found. Please log in again.';
                    break;
                }

                try {
                    const response = await fetch('http://localhost:3001/give', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            username: user.username,
                            amount: amount,
                        }),
                    });

                    if (response.ok) {
                        output = `You have received ${amount} BTC. 💰`;
                    } else {
                        const errorData = await response.json();
                        output = `Error giving BTC: ${errorData.error}`;
                    }
                } catch (error) {
                    output = `Network error: ${error.message}`;
                }
                break;


            case '/upgrade':
                if (user) {
                    setActiveComponent("upgrade");
                    output = `Upgrade component activated for user "${user.username}".`;
                } else {
                    output = 'No user is logged in. Please log in to activate the Upgrade component.';
                }
                break;

            case '/delete':
                if (args.length < 3) {
                    output = 'Usage: /delete [username] [password]';
                } else {
                    const username = args[1];
                    const password = args[2];

                    try {
                        const response = await fetch(`http://localhost:3001/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const token = data.token;

                            console.log(user.username);

                            const deleteResponse = await fetch(`http://localhost:3001/users/${user.username}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            if (deleteResponse.ok) {
                                output = `User "${username}" has been successfully deleted.`;
                                logout();
                                setActiveComponent(""); // Reset active component after deletion
                                
                            } else {
                                const errorData = await deleteResponse.json();
                                output = `Error deleting user: ${errorData.error}`;
                            }
                        } else {
                            const errorData = await response.json();
                            output = `Authentication failed: ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Network error: ${error.message}`;
                    }
                }
                break;

            case '/status':
                if (user) {
                    try {
                        const response = await fetch(`http://localhost:3001/status/${user.username}`, {
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' },
                        });

                        if (response.ok) {
                            const progression = await response.json();

                            const market = progression.market || {};
                            const wallet = progression.wallet || {};
                            const achievements = progression.achievements || [];
                            const upgrades = progression.upgrades || [];

                            output = `<pre>Status for user "${user.username}":

                Market:
Trend: ${market.trend || 'N/A'}
Steps: ${market.steps || 0}

                Wallet:
Balance: ${wallet.balance || 0} BTC

                Achievements:
${achievements.map((ach, index) => `  ${index + 1}. ${ach.name} - ${ach.description}`).join('\n')}

                Upgrades:
${upgrades.map((upg) => `  ${upg.name}: Level ${upg.level}`).join('\n')}
                </pre>`;
                        } else {
                            const errorData = await response.json();
                            output = `Error fetching status: ${errorData.error}`;
                        }
                    } catch (error) {
                        output = `Network error: ${error.message}`;
                    }
                } else {
                    output = 'No user is logged in. Please log in to view your status.';
                }
                break;



            case '/clear':
                setHistoryIndex(-1);
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

            default:
                output = `Unknown command: ${command}. Type /help to see all commands.`;
        }

        setHistory([...history, { command, output }]);
        setHistoryIndex(-1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            handleCommand(input.trim());
            setInput('');
            setSuggestions([]);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        if (value.startsWith('/')) {
            const filteredCommands = commands.filter((cmd) =>
                cmd.startsWith(value)
            );
            setSuggestions(filteredCommands);
            setSuggestionIndex(-1);
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (suggestions.length > 0) {
            if (e.key === 'ArrowUp') {
                // Naviguer vers le haut dans les suggestions
                e.preventDefault();
                setSuggestionIndex((prevIndex) =>
                    prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
                );
            } else if (e.key === 'ArrowDown') {
                // Naviguer vers le bas dans les suggestions
                e.preventDefault();
                setSuggestionIndex((prevIndex) =>
                    prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                // Sélectionner la suggestion actuelle ou la première si aucune n'est sélectionnée
                e.preventDefault();
                const selectedSuggestion =
                    suggestionIndex >= 0
                        ? suggestions[suggestionIndex]
                        : suggestions[0];
                setInput(selectedSuggestion);
                setSuggestions([]);
            }
        } else {
            if (e.key === 'ArrowUp') {
                // Naviguer vers le haut dans l'historique
                if (historyIndex + 1 < history.length - 1) {
                    const newIndex = historyIndex + 1;
                    setHistoryIndex(newIndex);
                    const command = history[history.length - 1 - newIndex].command || '';
                    setInput(command);

                    // Positionner le curseur à la fin de l'entrée
                    setTimeout(() => {
                        const inputElement = document.querySelector('input[type="text"]');
                        if (inputElement) {
                            inputElement.setSelectionRange(command.length, command.length);
                        }
                    }, 0);
                }
            } else if (e.key === 'ArrowDown') {
                // Naviguer vers le bas dans l'historique
                if (historyIndex > 0) {
                    const newIndex = historyIndex - 1;
                    setHistoryIndex(newIndex);
                    const command = history[history.length - 1 - newIndex].command || '';
                    setInput(command);

                    // Positionner le curseur à la fin de l'entrée
                    setTimeout(() => {
                        const inputElement = document.querySelector('input[type="text"]');
                        if (inputElement) {
                            inputElement.setSelectionRange(command.length, command.length);
                        }
                    }, 0);
                } else {
                    setHistoryIndex(-1);
                    setInput('');
                }
            }
        }
    };

    useEffect(() => {
        if (terminalEndRef.current) {
            terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    return (
        <div className="bg-black text-white font-mono p-4 h-full w-full flex flex-col rounded-lg shadow-lg border border-gray-700 terminal">
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
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex items-center">
                    <span className="text-white mx-2">
                        {user ? `${user.username}>` : '>'}
                    </span>
                    <input
                        type="text"
                        className="flex-1 bg-black text-white p-2 focus:outline-none"
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter a command /..."
                    />
                </div>
                {suggestions.length > 0 && (
                    <div className="bg-zinc-950 text-white mt-2 p-2 rounded z-10">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className={`cursor-pointer p-1 ${index === suggestionIndex ? 'bg-zinc-900 rounded-sm' : 'hover:bg-zinc-900'}`}
                                onClick={() => {
                                    setInput(suggestion);
                                    setSuggestions([]);
                                }}
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </div>
    );
};

export default Terminal;