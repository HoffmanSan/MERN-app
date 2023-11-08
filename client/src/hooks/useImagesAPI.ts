// IMPORTS
import { useAuthContext } from "./useContextHooks/useAuthContext";
import axios from "axios";

export const useImagesAPI = () => {
  
   // get user token for authentication
  const { state } = useAuthContext();
  const userAuth = state.user;

  // ---- CONVERT IMAGE TO BASE64 STRING ---- \\
  const convertImageToBase64String = (file: File): any => {
    return new Promise((resolve) => {

      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
  
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
    });
  };
  // ---------------------------------------- \\

  // ---- UPLOAD IMAGE ---- \\
  const uploadImage = async (base64String: string, imageSource: string, cloudinaryFolderId: string) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER_URI}/api/images`,
        { image: base64String, folder: `/${imageSource}/${cloudinaryFolderId}` },
        { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
      )
      return response.data
    }
    catch (error: any) {
      console.log(error)
      throw new Error("Błąd zapisywania obrazów: " + error.message)
    } 
  }
  // ----------------------- \\

  // ---- DELETE IMAGES ---- \\
  const deleteImages = async (imageSource: string, cloudinaryFolderId: string) => {

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_SERVER_URI}/api/images/${imageSource}/${cloudinaryFolderId}`,
        { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
      )
    }
    catch (error: any) {
      console.log(error)
      throw Error("Błąd usuwania obrazów: " + error.message)
    }
  }
  // ----------------------- \\

  return { convertImageToBase64String, uploadImage, deleteImages }
}