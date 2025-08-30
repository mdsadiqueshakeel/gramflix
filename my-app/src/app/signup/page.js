import React from 'react';
import SignUpPage from '@/components/SignUpPage';
import AuthGuard from '@/components/AuthGuard';

function SignUp() {
    return ( 
        <AuthGuard>
            <SignUpPage />
        </AuthGuard>
    );
}

export default SignUp;