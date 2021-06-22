import firebase from 'firebase/app';
import 'firebase/auth';

//just the config pasted from project settings config, make it a function and export
export const auth = firebase
	.initializeApp({
		apiKey: 'AIzaSyAotRnVt2wW80oXGZbdituI8SqqKoKys8w',
		authDomain: 'ezchat-f3733.firebaseapp.com',
		projectId: 'ezchat-f3733',
		storageBucket: 'ezchat-f3733.appspot.com',
		messagingSenderId: '109677636473',
		appId: '1:109677636473:web:944b93494c05b03cbd1da8',
	})
	.auth();
