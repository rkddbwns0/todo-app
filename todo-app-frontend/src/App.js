import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [todo, setTodo] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [reload, setReload] = React.useState(false);

    const handleTodoAdd = async () => {
        if (!title) {
            alert('내용을 입력해 주세요');
            return;
        }

        try {
            const response = axios.post('http://localhost:3001/todo', { title });
            setTitle('');
            setReload((prev) => !prev);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const todoList = async () => {
            try {
                const response = await axios.get('http://localhost:3001/todo');
                setTodo(response.data);
            } catch (e) {
                console.error(e);
            }
        };
        todoList();
    }, [reload]);

    return (
        <div className="App">
            <div>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <button onClick={handleTodoAdd}>추가</button>
            </div>

            <ul>
                {todo.map((todo) => (
                    <div>
                        <li key={todo.id}>{todo.title}</li>
                        <input type="checkbox" />
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default App;
