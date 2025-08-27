"use client";
import React from 'react';
import WithdrawPage from '@/components/WithdrawPage';
import ProtectedRoute from '@/components/ProtectedRoute';

function Withdraw() {
    return (
        <ProtectedRoute>
            <WithdrawPage />
        </ProtectedRoute>
    );
}

export default Withdraw;