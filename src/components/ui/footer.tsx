import React from 'react';

const footer = () => {
    const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION;
    return (
        <footer className="w-full text-center py-4 text-gray-500 bg-red-50/40">
            <span className="text-sm">&#169; Dikembangkan oleh Tim IT RSU UMM 2024 | App v{APP_VERSION}</span>
        </footer>
    );
};

export default footer;
