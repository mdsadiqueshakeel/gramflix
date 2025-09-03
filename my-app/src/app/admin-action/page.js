// 'use client';

// export const dynamic = 'force-dynamic';


// import { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function AdminActionPage() {
//     const [message, setMessage] = useState('Processing your request...');
//     const [status, setStatus] = useState('processing'); // processing, success, error
//     const searchParams = useSearchParams();
//     const router = useRouter();

//     useEffect(() => {
//         const type = searchParams.get('type');
//         const action = searchParams.get('action');
//         const id = searchParams.get('id');

//         if (!type || !action || !id) {
//             setMessage('Invalid request parameters.');
//             setStatus('error');
//             return;
//         }

//         const backendUrl = `${API_URL}/api/admin/${type}/${action}/${id}`;

//         fetch(backendUrl, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },  
//         })
//         .then(response => {
//             if (response.ok) {
//                 return response.json();
//             } else {
//                 throw new Error(`Already Approved`);
//             }
//         })
//         .then(data => {
//             setMessage(`Request ${action}ed successfully!`);
//             setStatus('success');
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             if (error.response && error.response.status === 409) {
//               setMessage('This request has already been processed.');
//             } else {
//               setMessage(`Failed to ${action} request: ${error.message}`);
//             }
//             setStatus('error');
//         });
//     }, [searchParams]);

//     // Function to close the window/tab
//     const closeWindow = () => {
//         // Check if the window was opened by a script or if it's a popup
//         if (window.opener) {
//             window.close(); // This will work for windows opened with window.open()
//         } else {
//             // For regular tabs, we can try to close but it may not work in all browsers
//             // due to security restrictions
//             if (confirm('Do you want to close this window?')) {
//                 window.close();
//             }
//         }
//     };

//     // Determine icon based on status
//     const renderIcon = () => {
//         switch(status) {
//             case 'success':
//                 return (
//                     <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/20 flex items-center justify-center">
//                         <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
//                         </svg>
//                     </div>
//                 );
//             case 'error':
//                 return (
//                     <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
//                         <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                         </svg>
//                     </div>
//                 );
//             default:
//                 return (
//                     <div className="w-20 h-20 mx-auto mb-6">
//                         <div className="relative w-full h-full">
//                             {/* Outer spinning ring */}
//                             <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            
//                             {/* Inner circle with gradient */}
//                             <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
//                                 <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
//                             </div>
//                         </div>
//                     </div>
//                 );
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
//             <div className="bg-gradient-to-b from-slate-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-slate-700 relative overflow-hidden">
//                 {/* Decorative elements */}
//                 <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-600/10 rounded-full"></div>
//                 <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-800/10 rounded-full"></div>
                
//                 <div className="relative z-10">
//                     <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
//                         Admin Action
//                     </h1>
//                     <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>
                    
//                     {renderIcon()}
                    
//                     <div className={`p-4 rounded-lg mb-6 ${
//                         status === 'processing' ? 'bg-slate-800/50' : 
//                         status === 'success' ? 'bg-green-900/20' : 'bg-red-900/20'
//                     }`}>
//                         <p className={`text-lg font-medium ${
//                             status === 'processing' ? 'text-blue-200' : 
//                             status === 'success' ? 'text-green-300' : 'text-red-300'
//                         }`}>
//                             {message}
//                         </p>
//                     </div>
                    
//                     {status !== 'processing' && (
//                         <button 
//                             onClick={closeWindow}
//                             className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
//                         >
//                             Close Tab
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function AdminActionPageInner() {
  const [message, setMessage] = useState('Processing your request...');
  const [status, setStatus] = useState('processing'); // processing, success, error
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const type = searchParams.get('type');
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!type || !action || !id) {
      setMessage('Invalid request parameters.');
      setStatus('error');
      return;
    }

    const backendUrl = `${API_URL}/api/admin/${type}/${action}/${id}`;

    fetch(backendUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Already Approved`);
        }
      })
      .then(() => {
        setMessage(`Request ${action}ed successfully!`);
        setStatus('success');
      })
      .catch((error) => {
        console.error('Error:', error);
        if (error.response && error.response.status === 409) {
          setMessage('This request has already been processed.');
        } else {
          setMessage(`Failed to ${action} request: ${error.message}`);
        }
        setStatus('error');
      });
  }, [searchParams]);

  const closeWindow = () => {
    if (window.opener) {
      window.close();
    } else {
      if (confirm('Do you want to close this window?')) {
        window.close();
      }
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'success':
        return (
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-900/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="bg-gradient-to-b from-slate-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-slate-700 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-600/10 rounded-full"></div>
        <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-blue-800/10 rounded-full"></div>

        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
            Admin Action
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 mx-auto mb-6 rounded-full"></div>

          {renderIcon()}

          <div
            className={`p-4 rounded-lg mb-6 ${
              status === 'processing'
                ? 'bg-slate-800/50'
                : status === 'success'
                ? 'bg-green-900/20'
                : 'bg-red-900/20'
            }`}
          >
            <p
              className={`text-lg font-medium ${
                status === 'processing'
                  ? 'text-blue-200'
                  : status === 'success'
                  ? 'text-green-300'
                  : 'text-red-300'
              }`}
            >
              {message}
            </p>
          </div>

          {status !== 'processing' && (
            <button
              onClick={closeWindow}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              Close Tab
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminActionPage() {
  return (
    <Suspense fallback={<p className="text-blue-300">Loading...</p>}>
      <AdminActionPageInner />
    </Suspense>
  );
}