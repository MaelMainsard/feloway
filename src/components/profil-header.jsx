import React, { useState, useEffect } from 'react';
import { Avatar, IconButton, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '../config/Firebase';
import { getLoggedUser } from '../config/util';
import { FormikProvider, Form, Field, useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const ProfilHeader = () => {
  const db = getFirestore(app);
  const storage = getStorage(app);
  const user = getLoggedUser();

  const theme = useTheme();

  const [userinfos, setUserinfos] = useState({
    image: '',
    location: '',
    preference: '',
    firstName: '',
    lastName: '',
    birthday: '',
    description: ''
  });

  const [editMode, setEditMode] = useState(false); // État pour suivre le mode d'édition
  const [image, setImage] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dateBirthday, setDateBirthday] = useState(null);
  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserinfos(userData);
          const userAvatar = userData.avatar; // Récupération de l'avatar depuis les données de l'utilisateur
          setImage(userAvatar); // Mettre à jour l'état de l'avatar
          setDateBirthday(userData.birthday ? dayjs(userData.birthday, 'DD/MM/YYYY') : null); // Définir dateBirthday
          formik.setValues({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            birthday: userData.birthday || '',
            location: userData.location || '',
            preference: userData.preference || '',
            description: userData.description || '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [db, user.uid]);

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

  const calculateAge = (birthday) => {
    const birthDate = dayjs(birthday, 'DD/MM/YYYY');
    const today = dayjs();
    
    let age = today.diff(birthDate, 'year');
    
    const birthDateThisYear = birthDate.set('year', today.year());
    if (today.isBefore(birthDateThisYear)) {
        age--;
    }
    return age;
};


  const DatepickerField = ({
      field, 
      form, 
    }) => (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}
          sx={{ paddingTop: '0px', border: 'none', borderWidth:'0px' }}>
          <DatePicker
          value={dateBirthday}
          format="DD/MM/YYYY"
          onChange={(newValue) => setDateBirthday(newValue)}
          sx={{
            '& input': {
              color: 'white', // Couleur du texte en blanc
              padding: '0px', // Ajoutez le padding souhaité ici
              border: 'none', // Supprime la bordure
              outline: 'none', // Supprime également l'effet d'ombre
              paddingTop: '0px', // Ajoutez le padding souhaité ici
              width: '80px', // Largeur de l'élément
              borderWidth: '0px', // Largeur de la bordure
            },
          }}      
         />
        </DemoContainer>
      </LocalizationProvider>
    );

  const initialValues = {
    firstName: userinfos.firstName || '',
    lastName: userinfos.lastName || '',
    birthday: userinfos.birthday || '',
    location: userinfos.location || '',
    preference: userinfos.preference || '',
    description: userinfos.description || '',
  };
  
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Firstname is required'),
    lastName: Yup.string().required('LastName is required'),
    location: Yup.string().required('Location is required'),
    description: Yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema : validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          firstName: values.firstName,
          lastName: values.lastName,
          birthday: dateBirthday ? dateBirthday.format('DD/MM/YYYY') : values.birthday,
          location: values.location,
          description: values.description
        });

        setUserinfos({
          ...userinfos,
          firstName: values.firstName,
          lastName: values.lastName,
          birthday: dateBirthday ? dateBirthday.format('DD/MM/YYYY') : values.birthday,
          location: values.location,
          description: values.description
        });
        setEditMode(false);
      } catch (error) {
        console.error('Error updating user data:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Fonction pour activer le mode d'édition
  const handleEditClick = () => {
    setEditMode(true);
  };

  // Fonction pour désactiver le mode d'édition
  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <>
      <div className={'rounded-b-2xl shadow-md p-1 w-full'} style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: theme.palette.secondary.main, color: theme.palette.text.primary }}>
        {!editMode && (
          <>
            <div className='p-3' style={{ display: 'flex', alignItems: 'center' }}>
              {image ? (
                <Avatar alt="User Avatar" src={image} sx={{ width: '100px', height: '100px', borderRadius: '50%' }} />
              ) : (
                <Avatar alt="User Avatar" sx={{ width: '100px', height: '100px', margin: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #CCCCCC' }}>
                  <PersonIcon style={{ width: '70%', height: '70%', margin: '15%' }} />
              </Avatar>              
              )}
              <div style={{ marginLeft: '20px' }}>
                {/* Affichage des informations utilisateur */}
                <p className="text-white font-bree font-bold">{userinfos.firstName} {userinfos.lastName}</p>
                <p className="text-white font-bree ">{calculateAge(userinfos.birthday)} ans</p>
                <p className="text-white font-bree">{userinfos.location}</p>
                <p className="text-white text-xs mt-1 font-montserrat font-light italic">"{userinfos.description}"</p>
                {/* Ajoutez d'autres informations de profil selon vos besoins */}
              </div>
            </div>
            <IconButton style={{ alignSelf: 'flex-start' }} onClick={handleEditClick}>
              <EditIcon className='text-white' />
            </IconButton>
          </>
        )}

        {editMode && (
          <>
            <div className='text-center' style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <IconButton style={{ alignSelf: 'flex-end' }} onClick={handleCancelEdit}>
                <EditIcon className='text-white' />
              </IconButton>

              <div style={{ width: '100px', height: '100px' }}>
                {image ? (
                  <Avatar alt="User Avatar" src={image} sx={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                ) : (
                  <Avatar alt="User Avatar" sx={{ width: '100px', height: '100px', margin: 'auto', backgroundColor: '#FFFFFF', border: '1px solid #CCCCCC' }}>
                    <PersonIcon style={{ width: '70%', height: '70%', margin: '15%' }} />
                </Avatar>              
                )}              
              </div>
                
              <label htmlFor="upload-file" className="pt-3 text-white" style={{ fontSize: '12px' }}>
                <Button 
                  aria-label="edit" 
                  className="pt-3" 
                  color="inherit" 
                  component="span" 
                  sx={{  
                    p: '4px', 
                    fontSize: '14px', 
                    fontFamily: 'Bree, serif', 
                    textTransform: 'none',  
                  }}
                >
                  Modifier mon avatar
                </Button>
                <input
                  id="upload-file"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </label>

              <FormikProvider value={formik}>
               <Form autoComplete="off" noValidate style={{ display: 'flex', flexDirection: 'column' }}>
                <div className='p-3' style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="lastName" className='text-white' style={{ textAlign: 'right', marginBottom: '5px',  fontFamily: 'bree' }}>Nom :</label>
                    <label htmlFor="firstName" className='text-white' style={{ textAlign: 'right', marginBottom: '5px',  fontFamily: 'bree' }}>Prénom :</label>
                    <label htmlFor="birthday" className='text-white' style={{ textAlign: 'right', marginBottom: '5px',  fontFamily: 'bree' }}>Date de naissance :</label>
                    <label htmlFor="location" className='text-white' style={{ textAlign: 'right', marginBottom: '5px',  fontFamily: 'bree' }}>Ville :</label>
                    <label htmlFor="description" className='text-white' style={{ textAlign: 'right', marginBottom: '5px',  fontFamily: 'bree' }}>Description :</label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Field type="text" id="lastName" name="lastName" style={{ marginBottom: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', color: '#ffffff',  fontFamily: 'bree' }} />
                    <Field type="text" id="firstName" name="firstName" style={{ marginBottom: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', color: '#ffffff',  fontFamily: 'bree' }} />
                    <Field id="birthday" name="birthday" component={DatepickerField} style={{ marginBottom: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', color: '#ffffff',  fontFamily: 'bree' }}/>
                    <Field type="text" id="location" name="location" style={{ marginBottom: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', color: '#ffffff',  fontFamily: 'bree' }} />
                    <Field type="text" id="description" name="description" style={{ marginBottom: '5px', backgroundColor: 'rgba(0, 0, 0, 0)', color: '#ffffff',  fontFamily: 'bree' }} />
                  </div>
                </div>
                <div style={{  marginBottom:'20px' }}>
                  <button type="submit" backgroundColor="primary" className="text-white bg-primary font-bree font-bold">Enregistrer</button>
                </div>
              </Form>

              </FormikProvider>

            </div>
          </>
        )}

      </div>
    </>
  );
};

export default ProfilHeader;
