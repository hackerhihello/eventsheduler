'use client';

import { useState, useEffect } from "react";
import { fetchMentors } from "../../../api/mentor"; // Adjust the path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface Mentor {
  name: string;
  email: string;
  password: string;
  tech: string;
}

const DirectorySqlMentors = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const mentorsPerPage = 10;

  useEffect(() => {
    const fetchMentorsData = async () => {
      try {
        const data = await fetchMentors();
        setMentors(data);
      } catch (err) {
        setError('Failed to fetch mentors');
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsData();
  }, []);

  const togglePasswordVisibility = (email: string) => {
    setShowPasswords(prev => ({ ...prev, [email]: !prev[email] }));
  };

  const sqlMentors = mentors.filter(mentor => mentor.tech === "SQL");
  const indexOfLastMentor = currentPage * mentorsPerPage;
  const indexOfFirstMentor = indexOfLastMentor - mentorsPerPage;
  const currentMentors = sqlMentors.slice(indexOfFirstMentor, indexOfLastMentor);
  const totalPages = Math.ceil(sqlMentors.length / mentorsPerPage);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const backButtonStyle = `
    inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg
    hover:bg-blue-700 transition duration-300 ease-in-out
  `;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="mb-4">
        <Link href="/home" passHref>
          <button className={backButtonStyle}>← Back to Home</button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-center text-green-800">SQL Mentors</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Password</th>
                <th className="py-3 px-4 text-left">Tech</th>
              </tr>
            </thead>
            <tbody>
              {currentMentors.map(mentor => (
                <tr key={mentor.email} className="border-b border-gray-200 hover:bg-green-50 transition duration-150">
                  <td className="py-3 px-4">{mentor.name}</td>
                  <td className="py-3 px-4">{mentor.email}</td>
                  <td className="py-3 px-4 relative">
                    <span className="pr-10">
                      {showPasswords[mentor.email] ? mentor.password : '••••••••'}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(mentor.email)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    >
                      <FontAwesomeIcon
                        icon={showPasswords[mentor.email] ? faEye : faEyeSlash}
                        className="text-green-600 hover:text-green-800"
                      />
                    </button>
                  </td>
                  <td className="py-3 px-4">{mentor.tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstMentor + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastMentor, sqlMentors.length)}</span> of{' '}
                <span className="font-medium">{sqlMentors.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <FontAwesomeIcon icon={faChevronLeft} className="h-5 w-5" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i + 1
                        ? 'z-10 bg-green-50 border-green-500 text-green-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <FontAwesomeIcon icon={faChevronRight} className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectorySqlMentors;
