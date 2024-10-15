'use client'
import { useEffect, createContext, useContext, useState} from "react";

type User = {
  name: string
  email: string
  password: string
  tech: string
  mentor: string
}

type Mentor = {
  name: string
  email: string
  password: string
  tech: string
}

type UserMentorContextType = {
  users: User[]
  mentors: Mentor[]
  addUser: (user: User) => void
  addMentor: (mentor: Mentor) => void
}

const UserMentorContext = createContext<UserMentorContextType | undefined>(undefined)

export const UserMentorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])

  useEffect(() => {
    const storedUsers = localStorage.getItem('users')
    const storedMentors = localStorage.getItem('mentors')
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers))
    }
    
    if (storedMentors) {
      setMentors(JSON.parse(storedMentors))
    }
  }, [])

  const addUser = (user: User) => {
    const newUsers = [...users, user]
    setUsers(newUsers)
    localStorage.setItem('users', JSON.stringify(newUsers))
  }

  const addMentor = (mentor: Mentor) => {
    const newMentors = [...mentors, mentor]
    setMentors(newMentors)
    localStorage.setItem('mentors', JSON.stringify(newMentors))
  }

  return (
    <UserMentorContext.Provider value={{ users, mentors, addUser, addMentor }}>
      {children}
    </UserMentorContext.Provider>
  )
}

export const useUserMentor = () => {
  const context = useContext(UserMentorContext)
  if (context === undefined) {
    throw new Error('useUserMentor must be used within a UserMentorProvider')
  }
  return context
}