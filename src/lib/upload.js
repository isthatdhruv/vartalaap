import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
// import { auth } from "../config/firebase";
// const user=auth.currentUser;
// import { resolvePath } from "react-router-dom";
const upload = async (file) => {
  const storage = getStorage();
    const fileExtension = file.name.split('.').pop().toLowerCase();
    let contentType = "image/jpeg";
    if (fileExtension === 'png') {
      contentType = 'image/png';
    } else if (fileExtension === 'jpg') {
      contentType = 'image/jpg';
    } 

    
    
    // const fileName = `${Date.now()}.${user.displayName}.${fileExtension}`;
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: contentType,
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "images/"+file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  return new Promise((resolve, reject) => {
    uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
              
          }
        },
        (error) => {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              reject(new Error("User doesn't have permission to access the object"));
              break;
            case "storage/canceled":
              // User canceled the upload
              reject(new Error("User canceled the upload"));
              break;
    
            // ...
    
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              reject(new Error("Unknown error occurred"));
              break;
          }
          reject(error);
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
};
  // Listen for state changes, errors, and completion of the upload.
  
export default upload;