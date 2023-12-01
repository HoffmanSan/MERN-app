// IMPORTS
import { useCallback } from "react";
import { useAuthContext } from "./useContextHooks/useAuthContext";
import axios from "axios"

export const useDataAPI = () => {
  
  // get user token for authentication
  const { user } = useAuthContext();
  const userToken = user ? user.token : "";

  // ---- GET ALL DOCUMENTS ---- \\
  const getData = useCallback(async (dataType: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}`,
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw new Error("Błąd pobierania danych: " + error.response.data.error)
    }
    
  }, [userToken])
  // --------------------------- \\

  // ---- GET SINGLE DOCUMENT ---- \\
  const getSingleDocument = useCallback(async (dataType: string, documentId: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}/${documentId}`,
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw new Error("Błąd pobierania dokumentu: " + error.response.data.error)
    }
  }, [userToken])
  // ----------------------------- \\

  // ---- CREATE NEW DOCUMENT ---- \\
  const createDocument = async (dataType: string, documentBody: object) => {

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}`,
        { ...documentBody },
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw new Error("Błąd tworzenia dokumentu: " + error.response.data.error)
    }
  }
  // ----------------------------- \\

  // ---- UPDATE DOCUMENT ---- \\
  const updateDocument = useCallback(async (dataType: string, documentBody: object, documentId: string) => {

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}/${documentId}`,
        { ...documentBody },
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw new Error("Błąd aktualizacji dokumentu: " + error.response.data.error)
    }
  }, [userToken])
  // --------------------------- \\

  // ---- DELETE DOCUMENT ---- \\
  const deleteDocument = async (dataType: string, documentId: string) => {
    
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}/${documentId}`,
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw Error("Błąd usuwania dokumentu: " + error.response.data.error)
    }
  }
  // ------------------------- \\


  return { getData, getSingleDocument, createDocument, deleteDocument, updateDocument }
}