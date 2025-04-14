import React, { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Terminal = ({ setActiveComponent }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
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

            default:
                output = `Unknown command: ${command}. Type /help to see all commands.`;
        }

        setHistory([...history, { command, output }]);
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
        } else {
            setSuggestions([]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab' && suggestions.length > 0) {
            e.preventDefault(); 
            setInput(suggestions[0]); 
            setSuggestions([]); 
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
                        onKeyDown={handleKeyDown} // Add keydown handler
                        placeholder="Enter a command..."
                    />
                </div>
                {suggestions.length > 0 && (
                    <div className="bg-zinc-950 text-white mt-2 p-2 rounded z-10">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                className="cursor-pointer hover:bg-zinc-900 p-1"
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