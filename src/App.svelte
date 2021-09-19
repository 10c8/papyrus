<script>
  import firebase from 'firebase/app';
  import 'firebase/firestore';
  import { FirebaseApp } from 'sveltefire';
  import { Router } from 'svelte-router-spa';

  import './tailwind.css';
  import { routes } from './routes';

  const firebaseConfig = {
    apiKey: 'AIzaSyBRTTQP-9pupqzjFdCbLZicrMOajuD6kWY',
    authDomain: 'papyrus-c397c.firebaseapp.com',
    projectId: 'papyrus-c397c',
    storageBucket: 'papyrus-c397c.appspot.com',
    messagingSenderId: '98511121484',
    appId: '1:98511121484:web:44066f1038bdf9bc8c58e9'
  };

  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }
</script>

<FirebaseApp {firebase}>
  <Router {routes} />
</FirebaseApp>
