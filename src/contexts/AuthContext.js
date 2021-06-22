import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../Firebase';

const AuthContext = createContext(); //create context

export const useAuth = () => useContext(AuthContext); //designate a function for existing context so we can call and get access to the 'value' inside AuthContext's value prop, which in this case is 'user'

export const AuthProvider = ({ children }) => {
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState(null);
	const history = useHistory();

	useEffect(() => {
		//grab the user from Firebase authentication
		auth.onAuthStateChanged((user) => {
			setUser(user);
			setLoading(false);
			if (user) {
				history.push('/chats'); //once finishing auth take me to the chat page, if user exists
			}
		});
	}, [user, history]);

	const value = { user };

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
