import React, { useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
    const [todo, setTodo] = React.useState([]);
    const [title, setTitle] = React.useState('');
    const [reload, setReload] = React.useState(false);
    const [checkiIems, setCheckItems] = React.useState([]);
    const today = new Date();

    const [currentDate, setCurrentDate] = React.useState(today);

    const todoList = async (date) => {
        try {
            const response = await axios.get('http://localhost:3001/todo', {
                params: { date: date },
            });
            setTodo(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    const yesterday = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() - 1);
            todoList(newDate);
            return newDate;
        });
    };

    const tomorrow = () => {
        setCurrentDate((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + 1);
            if (newDate > today) return prev;
            todoList(newDate);
            return newDate;
        });
    };

    const handleCheckItems = (checked, id) => {
        if (checked) {
            setCheckItems([...checkiIems, id]);
        } else {
            setCheckItems(checkiIems.filter((item) => item !== id));
        }
    };

    const handleTodoAdd = async () => {
        if (!title) {
            alert('내용을 입력해 주세요');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/todo', { title });
            setTitle('');
            setReload((prev) => !prev);
        } catch (e) {
            alert(e.response.data.message);
            console.error(e);
        }
    };

    const handleSuccessTodo = async () => {
        try {
            const response = await axios.put('http://localhost:3001/todo', { id: checkiIems });
            setCheckItems([]);
            setReload((prev) => !prev);
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteTodo = async () => {
        try {
            const response = await axios.delete('http://localhost:3001/todo', {
                params: { id: checkiIems.join(',') },
            });
            setCheckItems([]);
            setReload((prev) => !prev);
        } catch (e) {
            console.error(e);
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleTodoAdd();
        }
    };

    useEffect(() => {
        todoList();
        setReload(false);
    }, [reload]);

    return (
        <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <button onClick={yesterday}>전날</button>
                <h3>{currentDate.toLocaleDateString().slice(0, 11)}</h3>
                <button
                    onClick={tomorrow}
                    disabled={
                        currentDate.toLocaleDateString().slice(0, 11) === today.toLocaleDateString().slice(0, 11)
                            ? true
                            : false
                    }
                >
                    다음날
                </button>
            </div>
            <div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={
                        currentDate.toLocaleDateString().slice(0, 11) !== today.toLocaleDateString().slice(0, 11)
                            ? true
                            : false
                    }
                    onKeyDown={handleEnter}
                />
                <button onClick={handleTodoAdd}>추가</button>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: 'auto',
                    padding: '10px',
                    justifyContent: 'center',
                    width: '800px',
                }}
            >
                <ol
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {todo.map((todo) => (
                        <div
                            key={todo.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                height: '50px',
                                width: '100%',
                                margin: '10px',
                            }}
                        >
                            <li
                                style={{
                                    justifySelf: 'center',
                                    alignSelf: 'center',
                                    textAlign: 'left',
                                    textDecoration: todo.completed ? 'line-through' : 'none',
                                    textDecorationColor: todo.completed ? 'royalblue' : 'none',
                                    width: '70%',
                                    paddingLeft: '8px',
                                }}
                            >
                                {todo.title}
                            </li>
                            <input
                                type="checkbox"
                                style={{ width: '15px', height: '15px' }}
                                onChange={(e) => handleCheckItems(e.target.checked, todo.id)}
                                checked={checkiIems.includes(todo.id)}
                            />
                        </div>
                    ))}
                </ol>
            </div>
            <div>
                <button onClick={handleSuccessTodo}>완료</button>
                <button onClick={handleDeleteTodo}>삭제</button>
            </div>
        </div>
    );
}

export default App;
