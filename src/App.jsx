import { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [users, setUsers] = useState([]); // Corrected naming convention

    // useEffect to fetch data
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((data) => setUsers(data));
    }, []);

    // State to manage new user input
    const [input, setInput] = useState({
        name: "",
        website: "",
        email: ""
    });

    // Function to handle new data input
    const handleData = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    // Function to push new data
    function pushData() {
        const name = input.name.trim();
        const website = input.website.trim();
        const email = input.email.trim();

        if (name && website && email) {
            fetch("https://jsonplaceholder.typicode.com/users", {
                method: 'POST',
                body: JSON.stringify({ name, website, email }),
                headers: {
                    "Content-Type": "application/json;charset=UTF-8"
                }
            })
            .then((response) => response.json())
            .then((data) => {
                setUsers([...users, data]);
                setInput({ name: "", website: "", email: "" }); // Reset the input fields
            })
            .catch((error) => console.error("Error adding user:", error));
        } else {
            alert("Please fill in all fields.");
        }
    }

    // Function to update user state on the spot
    function onTheSpot(id, key, value) {
        setUsers((users) =>
            users.map(user => {
                return user.id === id ? { ...user, [key]: value } : user;
            })
        );
    }

    // Function to handle update
    function handleUpdate(id) {
        const user = users.find((user) => user.id === id);
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { // Corrected URL
            method: 'PUT',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        })
        .then((response) => response.json())
        .then((data) => {
            setUsers(users.map(u => (u.id === id ? data : u))); // Update specific user
        })
        .catch((error) => console.error("Error updating user:", error));
    }

    // Function to handle delete
    function handleDelete(id) {
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`, { // Corrected URL
            method: 'DELETE'
        })
        .then(() => {
            setUsers(users.filter(user => user.id !== id)); // Remove user from state
        })
        .catch((error) => console.error("Error deleting user:", error));
    }

    return (
        <div className='container mx-auto p-5 bg-slate-700 font-roboto'>
            <table className='table-auto w-full border-collapse'>
                <thead className='bg-gray-200 text-gray-700'>
                    <tr>
                        <th className='border border-gray-300 p-2'>ID</th>
                        <th className='border border-gray-300 p-2'>Name</th>
                        <th className='border border-gray-300 p-2'>Email</th>
                        <th className='border border-gray-300 p-2'>Website</th>
                        <th className='border border-gray-300 p-2'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user =>
                        <tr className='bg-white text-center' key={user.id}>
                            <td className='border border-gray-300 p-2'>{user.id}</td>
                            <td className='border border-gray-300 p-2'>{user.name}</td>
                            <td className='border border-gray-300 p-2'>
                                <input type="email" name="email" className='border p-1 rounded' value={user.email} onChange={(e) => onTheSpot(user.id, 'email', e.target.value)} />
                            </td>
                            <td className='border border-gray-300 p-2'>
                                <input type="text" name="website" className='border p-1 rounded' value={user.website} onChange={(e) => onTheSpot(user.id, 'website', e.target.value)} />
                            </td>
                            <td className='border border-gray-300 p-2 flex justify-center gap-2'>
                                <button className='bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700' onClick={() => handleUpdate(user.id)}>Update</button>
                                <button className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700' onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    )}
                </tbody>
                <tfoot className='bg-gray-700'>
                    <tr>
                        <td className='border border-gray-300 p-2'></td>
                        <td className='border border-gray-300 p-2'>
                            <input type="text" name="name" className='border p-1 rounded w-full text-center' placeholder='Enter the name' onChange={handleData} value={input.name} autoComplete='off' />
                        </td>
                        <td className='border border-gray-300 p-2'>
                            <input type="email" name="email" className='border p-1 rounded w-full text-center' placeholder='Enter the email' onChange={handleData} value={input.email} autoComplete='off' />
                        </td>
                        <td className='border border-gray-300 p-2'>
                            <input type="text" name="website" className='border p-1 rounded w-full text-center' placeholder='Enter the website' onChange={handleData} value={input.website} autoComplete='off' />
                        </td>
                        <td className='border border-gray-300 p-2 flex justify-center'>
                            <button onClick={pushData} className='bg-green-500 text-white px-4 py-1 rounded hover:bg-green-700'>Add User</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}

export default App;
