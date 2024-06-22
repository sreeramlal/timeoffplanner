import React, { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

const Todo = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ task: '', deadlines: [] });
    const [editMode, setEditMode] = useState(null);
    const [editTodo, setEditTodo] = useState({ task: '', deadlines: [] });

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://localhost:3001/getTodoList');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const handleChange = (e) => {
        setNewTodo({
            ...newTodo,
            [e.target.name]: e.target.value
        });
    };

    const handleEditChange = (e) => {
        setEditTodo({
            ...editTodo,
            [e.target.name]: e.target.value
        });
    };

    const handleDateChange = (dates) => {
        setNewTodo({
            ...newTodo,
            deadlines: dates.map(date => date.format())
        });
    };

    const handleEditDateChange = (dates) => {
        setEditTodo({
            ...editTodo,
            deadlines: dates.map(date => date.format())
        });
    };

    const addTodo = async () => {
        try {
            const response = await axios.post('http://localhost:3001/addTodoList', newTodo);
            setTodos([...todos, response.data]);
            setNewTodo({ task: '', deadlines: [] });
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const updateTodo = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/updateTodoList/${id}`, editTodo);
            setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
            setEditMode(null);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/deleteTodoList/${id}`);
            setTodos(todos.filter(todo => todo._id !== id));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="p-4 mb-5">
                        <h2>TimeOff</h2>
                        <div className="mb-3">
                            <input
                                type="text"
                                name="task"
                                value={newTodo.task}
                                onChange={handleChange}
                                placeholder="Purpose of TimeOff"
                                className="form-control mb-2"
                            />
                            <div>
                            <DatePicker
                                value={newTodo.deadlines.map(date => new DateObject({ date, format: "MM/DD/YYYY" }))}
                                onChange={handleDateChange}
                                multiple
                                format="MM/DD/YYYY"
                                plugins={[<DatePanel />]}
                                className="mb-3 date-picker"
                                placeholder='Date'
                                open={true}  // This will keep the calendar opened by default
                            /> </div><br />
                            <button onClick={addTodo} className="btn btn-info w-20 button">Add Todo</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center scrollable-list-1">
                <div className="col-md-8">
                    <div className="p-4">
                        <table className="table table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Purpose</th>
                                    <th>Days</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {todos.map(todo => (
                                    <tr key={todo._id}>
                                        <td>
                                            {editMode === todo._id ? (
                                                <input
                                                    type="text"
                                                    name="task"
                                                    value={editTodo.task}
                                                    onChange={handleEditChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                todo.task
                                            )}
                                        </td>
                                        <td>
    {editMode === todo._id ? (
        <DatePicker
            value={editTodo.deadlines.map(date => new DateObject({ date, format: "MM/DD/YYYY" }))}
            onChange={handleEditDateChange}
            multiple
            format="MM/DD/YYYY"
            plugins={[<DatePanel />]}
            className="form-control"
            open={true}  // This will keep the calendar opened by default
        />
    ) : (
        <ul className="scrollable-list">
            {todo.deadlines.map((deadline, index) => (
                <li key={index}>{deadline}</li>
            ))}
        </ul>
    )}
</td>
                                        <td>
                                            {editMode === todo._id ? (
                                                <>
                                                    <button onClick={() => updateTodo(todo._id)} className="btn btn-success mr-2">Save</button>
                                                    <button onClick={() => setEditMode(null)} className="btn btn-secondary">Cancel</button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => { setEditMode(todo._id); setEditTodo(todo); }} className="btn btn-warning mr-2">Edit</button>
                                                    <button onClick={() => deleteTodo(todo._id)} className="btn btn-danger m-3">Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Todo;
