import { Container } from "@mui/material";
import {BottomNavBar} from "../components/BottomNavBar"
import {TopNavBar} from "../components/TopNavBar"
import { useState, useEffect } from "react";
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { getLoggedUser } from '../config/util';
import Carousel from '../components/Carousel';
import Badge from '@mui/material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import { getFirestore, collection, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from '../config/Firebase';
import ProfilHeader from "../components/profil-header";

//////////////////////////////////////

const ProfilBody = () => {

  const db = getFirestore(app);
  const storage = getStorage(app);
  let user = getLoggedUser();

  
  const [image, setImage] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Récupération de l'avatar de l'utilisateur depuis Firestore lors du chargement initial
    const fetchUserAvatar = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const userAvatar = userData.avatar; // Récupération de l'avatar depuis les données de l'utilisateur
        setImage(userAvatar); // Mettre à jour l'état de l'avatar
      }
    };
  
    fetchUserAvatar();
  }, [db]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return; // Vérification si un fichier est sélectionné
  
    const storageRef = ref(storage, `images/${file.name}`);
    setUploading(true);
  
    try {
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
  
      // Ajouter l'URL de l'image à Firestore
      await updateDoc(doc(db, "users", user.uid), {
        avatar: imageUrl,
      });
  
      setImage(imageUrl);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
      // Gérer l'erreur d'upload
    }
  };

  return (
    <div className="h-full flex flex-col items-center overflow-x-hidden overflow-y-auto w-full">
      <ProfilHeader/>


      
      {/* <Container
        component="main"
        maxWidth="100%"
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}>
          
        

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1>Profil</h1>
          <IconButton aria-label="delete"  >
            <Link to="/settings" style={{ color: "inherit", textDecoration: "none" }} >
              <SettingsIcon style={{ color: "inherit" }} />
            </Link>
          </IconButton>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {image ? (
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              badgeContent={              
                <label htmlFor="upload-file">
                  <IconButton aria-label="edit" component="span" sx={{ p: '4px' }}>
                    <EditIcon />
                  </IconButton>
                  <input
                    id="upload-file"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                  />
                </label>
              }
              sx={{ width: '50%', height: 'auto', margin: 'auto' }}
            >
              <Avatar alt="User Avatar" src={image} sx={{ width: '100%', height: 'auto', borderRadius: '50%' }}/>
            </Badge>
          ) : (
            <Avatar alt="User Avatar" sx={{ width: '150px', height: '150px', margin: 'auto' }}>
              <PersonIcon style={{ width: '100%', height: '100%' }} />
            </Avatar>
          )}
        </div>
        <Carousel/>
          <div style={{ marginTop: "auto", display: "flex", width: "100%" }}>
          </div>
        <Carousel />
      </Container> */}
    </div>
  );
};

export default ProfilBody;