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
                    try {
                        const response = await fetch('http://localhost:3001/register', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username: args[1], password: args[2] }),
                        });

                        if (response.ok) {
                            output = `User "${args[1]}" successfully registered.`;
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
                output = `<pre>Leaderboard:
1. User1 - 1000 points
2. User2 - 900 points
3. User3 - 800 points</pre>`;

                break;

            case '/achievements':
                output = `<pre>Achievements:
1. Achievement 1 - Description of achievement 1
2. Achievement 2 - Description of achievement 2
3. Achievement 3 - Description of achievement 3</pre>`;
                break;

            case '/upgrade':
                if (user) {
                    setActiveComponent("upgrade"); // Activer le composant Upgrade
                    output = `Upgrade component activated for user "${user.username}".`;
                } else {
                    output = 'No user is logged in. Please log in to activate the Upgrade component.';
                }
                break;

                case '/status':
                    const token = localStorage.getItem('token');
                    console.log("Username:", user.username);
                
                    if (token) {
                        try {
                            const response = await fetch(`http://localhost:3001/wallet?username=${user.username}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                
                            const raw = await response.text(); // Lire brut pour éviter les erreurs de parsing
                            console.log("Raw response:", raw);
                
                            if (response.ok) {
                                let data;
                                try {
                                    data = JSON.parse(raw);
                                } catch (parseErr) {
                                    output = `Server sent invalid JSON.`;
                                    break;
                                }
                
                                output = `<pre>You are now connected on ${user.username} account.
                Your balance is: ${data.wallet?.balance ?? 'Unknown'} BTC</pre>`;
                            } else {
                                output = `Error fetching wallet: HTTP ${response.status}`;
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
            setSuggestionIndex(-1); // Réinitialiser l'index des suggestions
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
                                className={`cursor-pointer p-1 ${ index === suggestionIndex ? 'bg-zinc-900 rounded-sm' : 'hover:bg-zinc-900'}`}
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