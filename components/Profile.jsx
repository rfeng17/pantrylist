"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "../lib/AuthContext";
import Spinner from "./Spinner";

const Profile = () => {
    const { user } = UserAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            await new Promise((resolve) => setTimeout(resolve, 50));
            setLoading(false);
        };
        checkAuthentication();
    }, [user]);

    return (
        <div className="p-4">
            {loading ? (
                <Spinner />
            ) : user ? (
                <div>
                    Welcome, {user.displayName}
                </div>
            ) : (
                <div>You must be logged in to save - protected route.</div>
            )}
        </div>
    );
};

export default Profile;