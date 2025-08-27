"use client";
import React from 'react';
import ProfilePage from '@/components/ProfilePage';
import ProtectedRoute from '@/components/ProtectedRoute';


function Profile() {
    return (
        <ProtectedRoute>
            <ProfilePage />
        </ProtectedRoute>
    );
}

export default Profile;
