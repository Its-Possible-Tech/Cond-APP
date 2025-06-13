import React from 'react';
import { StatusBar } from 'expo-status-bar';
import EnhancedWebView from './components/EnhancedWebView';

const WEB_URL = process.env.EXPO_PUBLIC_ENVIRONMENT === 'dev'
    ? 'http://192.168.1.138:3001'  // Local Next.js (for testing)
    : 'https://cond-vercel.vercel.app';  // Deployed Next.js

export default function App() {
    return (
        <>
            <StatusBar style="dark" />
            <EnhancedWebView url={WEB_URL} />
        </>
    );
}