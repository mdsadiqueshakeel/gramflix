import React from 'react';
import LoginPage from '@/components/LoginPage'
import AuthGuard from '@/components/AuthGuard'

function Login() {
    return ( 
        <AuthGuard>
            <LoginPage />
        </AuthGuard>
    );
}

export default Login;