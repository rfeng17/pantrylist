import React, { useState, useEffect } from "react";
import { UserAuth } from "../lib/AuthContext";
import styles from '../styles/Home.module.css';

const Connect = () => {
    const { user, googleSignIn, logOut } = UserAuth();
    const [loading, setLoading] = useState(true);

    const handleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await logOut();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <div>
            {loading ? null : !user ? (
                <div>
                    <button onClick={handleSignIn} className={styles.authButton}>
                        Sign In with Google
                    </button>
                </div>
            ) : (
                <div>
                    <button className={styles.authButton} onClick={handleSignOut}>
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Connect;