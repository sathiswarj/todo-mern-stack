import React, { useState, useEffect } from 'react'
import './Todo.css'
import {format} from 'date-fns';

const Todos = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [todo, setTodo] = useState([])
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [editId, setEditId] = useState("-1")
    const apiURL = "http://localhost:8000"

    const handleSubmit = () => {
        setError("")
        if (title.trim() !== "" || description.trim() !== '') {
            fetch(apiURL + "/todo", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {

                if (res.ok) {
                    setTodo([...todo, { title, description }])
                    setMessage("Added successfully")
                    setTitle("")
                    setDescription("")
                }
                else {
                    setError("Unable to create todo list")
                }
            }).catch((err) => {
                console.log({ message: err.message })
            })
        }
    }

    const handleUpdate = () => {
        setError("")
        //check inputs
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(apiURL + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            }).then((res) => {
                if (res.ok) {
                    //update item to list
                    const updatedTodos = todo.map((item) => {
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    })

                    setTodo(updatedTodos)
                    setEditTitle("");
                    setEditDescription("")
                    setEditId(-1)

                } else {
                    //set error
                    setError("Unable to create Todo item")
                }
            }).catch(() => {
                setError("Unable to create Todo item")
            })
        }
    }


    const getItem = () => {
        fetch(apiURL + "/todo")
            .then((res) => res.json())
            .then((res) => {
                setTodo(res)
            })
    }
    const handleEdit = (list) => {
        setEditId(list._id)
        setEditTitle(list.title)
        setEditDescription(list.description)
    }
    const handleEditCancel = () => {
        setEditId(-1)
    }

    const handleDelete = (id) => {
        if (window.confirm('are you sure want to delete?')) {
            fetch(apiURL + "/todos" + id, {
                method: "DELETE"
            })
                .then(() => {
                    const updatedTodos = todo.filter((list) => list._id !== id)
                    setTodo(updatedTodos)
                })
        }
    }

    useEffect(() => {
        getItem()
    }, [])
    return (
        <div className='container-fluid'>
        <div className='container-head'>
            <h1 style={{ backgroundColor: "green", color: "white", padding: "10px" }}>Todo</h1>
        </div>
        {message && <p>{message}</p>}
        <div className='row'>
            <div className='form-group'>
                <input
                    type="text"
                    className='form-control'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
                <textarea
                    className='form-control'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                    col="10"

                />
                <button
                    className='btn btn-success'
                    onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
        {error && <p>{error}</p>}
        <div className='row mt-3' style={{ marginTop: "8px" }}>
            <ul className="list-group">
                {todo.map((list) => (
                    <div className="col-md-4 mb-3" key={list.id}>
                        <div className="card">
                            <div className="card-body">
                                <li className="list-group-item">
                                    {editId === -1 || editId !== list._id ? (
                                        <>
                                            <div className="card-content">
                                                <span className="card-title"><h2>{list.title}</h2></span>
                                                <span className="card-description"><h5 style={{ marginBottom: "6px" }}>{list.description}</h5></span>
                                               <div className='updated-date'> <span className="card-date"><h5 style={{ marginBottom: "6px" }}>Posted in : {format(list.updatedAt,'MMMM do, yyyy')}</h5></span>
                                               </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className='form-group'>
                                                <input
                                                    type="text"
                                                    className='form-control div-input'
                                                    value={editTitle}
                                                    onChange={(e) => setEditTitle(e.target.value)}
                                                    placeholder="Edit title"
                                                />
                                                <textarea
                                                    className='form-control div-input'
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    placeholder="Enter description"
                                                    row="4"

                                                />
                                            </div>
                                        </>
                                    )}
                                    <div className="actions">
                                        {editId === -1 || editId !== list._id ? (
                                            <button
                                                className="btn btn-warning action"
                                                onClick={() => handleEdit(list)}
                                            >
                                                Edit
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-warning action"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                        )}
                                        {editId === -1 || editId !== list._id ? (
                                            <button
                                                className='btn btn-danger action'
                                                onClick={() => handleDelete(list._id)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <button
                                                className='btn btn-danger action'
                                                onClick={handleEditCancel}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </li>
                            </div>
                        </div>
                    </div>
                ))}
            </ul>
        </div>
    </div>
    )
}

export default Todos