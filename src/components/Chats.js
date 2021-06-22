import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../Firebase';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Chats = () => {
	const history = useHistory();
	const { user } = useAuth();
	const [loading, setLoading] = useState(true);

	console.log(user);
	const handleLogout = async () => {
		await auth.signOut(); //sign out and redirect to /
		history.push('/');
	};

	useEffect(() => {
		//if no user redirect to /
		if (!user || user === null) {
			history.push('/');
			return;
		}

		//get image
		const getFile = async (url) => {
			const response = await fetch(url);
			const data = await response.blob();
			return new File([data], 'userPhoto.jpg', { type: 'image/jpeg' });
		};

		//if we have chatengine profile, get the info from the user
		axios
			.get('https://api.chatengine.io/users/me', {
				headers: {
					'project-id': process.env.REACT_APP_CHAT_ENGINE_ID,
					'user-name': user.email,
					'user-secret': user.uid,
				},
			})
			.then(() => {
				setLoading(false);
			})
			.catch(() => {
				//if no user profile, create one
				let formdata = new FormData();
				formdata.append('email', user.email);
				formdata.append('username', user.email);
				formdata.append('secret', user.uid);

				getFile(user.photoURL).then((avatar) => {
					formdata.append('avatar', avatar, avatar.name);
					//make a post request to add user
					axios
						.post('https://api.chatengine.io/users/', formdata, {
							headers: {
								'private-key': process.env.REACT_APP_CHAT_ENGINE_KEY,
							},
						})
						.then(() => setLoading(false))
						.catch((e) => console.log(e));
				});
			});
	}, [user, history]);

	if (!user || loading) {
		return 'loading..';
	}

	return (
		<div className='chats-page'>
			<div className='nav-bar'>
				<div className='logo-tab'>EzChat</div>
				<div onClick={handleLogout} className='logout-tab'>
					Logout
				</div>
			</div>
			<ChatEngine
				height='calc(100vh - 66px)'
				projectID={process.env.REACT_APP_CHAT_ENGINE_ID} //from chatengine.io personal account.
				userName={user.email}
				userSecret={user.uid}
			/>
		</div>
	);
};
export default Chats;
