"use client";
import Connect from "../components/Connect";
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { AuthContextProvider } from "../lib/AuthContext";

const Home = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to the Pantry App</h1>
            <div className={styles.auth}>
                <AuthContextProvider>
                    <Connect />
                </AuthContextProvider>
            </div>
            <Link href="/pantry" legacyBehavior>
                <a className={styles.link}>Go to Pantry</a>
            </Link>
        </div>
    );
};
export default Home;