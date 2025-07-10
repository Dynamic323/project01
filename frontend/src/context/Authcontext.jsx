import {  createContext, useEffect, useState } from "react";

import {onAuthStateChanged} from "firebase/auth"
const AuthContext = createContext()

export const AuthProvider = ({children)=>{

    const [user, setUser] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(()=>{
        const unsuscribe = onAuthStateChanged(auth)
    })
}