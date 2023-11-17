// IMPORTS
import { useCallback } from "react";
import { useAuthContext } from "./useContextHooks/useAuthContext";
import axios, { AxiosResponse } from "axios"

export const useDataAPI = () => {
  
  // get user token for authentication
  const { state } = useAuthContext();
  const userToken = state.user ? state.user.token : "";

  // ---- GET ALL DOCUMENTS ---- \\
  const getData = (dataType: string): Promise<AxiosResponse> => {
    return new Promise((resolve, reject) => {

      axios.get(
        `${process.env.REACT_APP_API_SERVER_URI}/api/${dataType}`,
        { headers: {'Authorization': `Bearer ${userToken}`} }
      )
      .then(response => resolve(response))
      .catch(error => reject(error))
    })
  }
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
      throw new Error("Błąd pobierania danych dokumentu: " + error.response.data.error)
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
      throw new Error("Błąd zapisywania dokumentu: " + error.response.data.error)
    }
  }
  // ----------------------------- \\

  // ---- UPDATE DOCUMENT ---- \\
  const updateDocument = async (dataType: string, documentBody: object, documentId: string) => {

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
      throw new Error("Błąd zapisywania dokumentu: " + error.response.data.error)
    }
  }
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