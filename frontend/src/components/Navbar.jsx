// import { useState } from "react";
// import { Link } from "react-router-dom";

// export default function NavBar() {
//   const [open, setOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex-shrink-0 flex items-center">
//             <Link to="/" className="text-xl font-bold text-indigo-600">
//               MasterSound
//             </Link>
//           </div>
//           {/* Hamburger for mobile */}
//           <div className="flex items-center sm:hidden">
//             <button
//               onClick={() => setOpen(!open)}
//               className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
//             >
//               <svg
//                 className="h-6 w-6"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 {open ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 8h16M4 16h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//           {/* Links */}
//           <div
//             className={`sm:flex sm:items-center ${open ? "block" : "hidden"}`}
//           >
//             <Link
//               to="/"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
//             >
//               Home
//             </Link>
//             <Link
//               to="/shop"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
//             >
//               Shop
//             </Link>
//             <Link
//               to="/ewarranty"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
//             >
//               E-Warranty
//             </Link>
//             <Link
//               to="/contact"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
//             >
//               Contact
//             </Link>
//             <Link
//               to="/admin/login"
//               className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50"
//             >
//               Admin
//             </Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
import { useState } from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    // Main navigation container with dark background and Inter font
    <nav className="bg-gray-950 shadow-lg relative z-20 font-inter antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition-colors duration-300"
            >
              MasterSound
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 px-3 py-2 rounded-md font-medium"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 px-3 py-2 rounded-md font-medium"
            >
              Shop
            </Link>
            <Link
              to="/ewarranty"
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 px-3 py-2 rounded-md font-medium"
            >
              E-Warranty
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-orange-400 transition-colors duration-300 px-3 py-2 rounded-md font-medium"
            >
              Contact
            </Link>
            <Link
              to="/admin/login"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-full shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Admin
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 transition-colors duration-300"
              aria-controls="mobile-menu"
              aria-expanded={open ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden ${open ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 rounded-b-lg shadow-xl">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            Shop
          </Link>
          <Link
            to="/ewarranty"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            E-Warranty
          </Link>
          <Link
            to="/contact"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-orange-400 transition-colors duration-300"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <Link
            to="/admin/login"
            className="block px-3 py-2 rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-300 mt-2"
            onClick={() => setOpen(false)}
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Tailwind CSS custom font import (if not already global) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }
      `}</style>
    </nav>
  );
}
