import react, {useState, useEffect} from 'react';
import { useTheme } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Slider from '@mui/material/Slider';
import { firestore } from '../config/Firebase';
import { getLoggedUser } from "../config/util";
import Adventure from "../assets/Adventure.svg";
import Explorer from "../assets/Explorer.svg";
import Tourist from "../assets/Tourist.svg";
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

export const DestinationPage = () => {
    const theme = useTheme();
    const [budget, setBudget] = useState(500);
    const user_id = getLoggedUser().uid;

    const countryArray = {
        "Afrique": [
            "Algérie",
            "Angola",
            "Bénin",
            "Botswana",
            "Burkina Faso",
            "Burundi",
            "Cameroun",
            "Cap-Vert",
            "République centrafricaine",
            "Tchad",
            "Comores",
            "République démocratique du Congo",
            "Djibouti",
            "Égypte",
            "Guinée équatoriale",
            "Érythrée",
            "Éthiopie",
            "Gabon",
            "Gambie",
            "Ghana",
            "Guinée",
            "Guinée-Bissau",
            "Côte d'Ivoire",
            "Kenya",
            "Lesotho",
            "Liberia",
            "Libye",
            "Madagascar",
            "Malawi",
            "Mali",
            "Mauritanie",
            "Maurice",
            "Maroc",
            "Mozambique",
            "Namibie",
            "Niger",
            "Nigeria",
            "République du Congo",
            "Rwanda",
            "Sao Tomé-et-Principe",
            "Sénégal",
            "Seychelles",
            "Sierra Leone",
            "Somalie",
            "Afrique du Sud",
            "Soudan",
            "Soudan du Sud",
            "Swaziland",
            "Tanzanie",
            "Togo",
            "Tunisie",
            "Ouganda",
            "Zambie",
            "Zimbabwe"
        ],
        "Amérique du Nord": [
            "Antigua-et-Barbuda",
            "Les Bahamas",
            "Barbade",
            "Belize",
            "Canada",
            "Costa Rica",
            "Cuba",
            "Dominique",
            "République dominicaine",
            "El Salvador",
            "Grenade",
            "Guatemala",
            "Haïti",
            "Honduras",
            "Jamaïque",
            "Mexique",
            "Nicaragua",
            "Panama",
            "Saint-Christophe-et-Niévès",
            "Sainte-Lucie",
            "Saint-Vincent-et-les-Grenadines",
            "Trinité-et-Tobago",
            "États-Unis"
        ],
        "Amérique du Sud": [
            "Argentine",
            "Bolivie",
            "Brésil",
            "Chili",
            "Colombie",
            "Équateur",
            "Guyana",
            "Paraguay",
            "Pérou",
            "Suriname",
            "Uruguay",
            "Venezuela"
        ],
        "Asie": [
            "Afghanistan",
            "Arabie Saoudite",
            "Bahreïn",
            "Bangladesh",
            "Bhoutan",
            "Birmanie (Myanmar)",
            "Brunei",
            "Cambodge",
            "Chine",
            "Corée du Nord",
            "Corée du Sud",
            "Émirats arabes unis",
            "Inde",
            "Indonésie",
            "Iran",
            "Irak",
            "Israël",
            "Japon",
            "Jordanie",
            "Kazakhstan",
            "Kirghizistan",
            "Koweït",
            "Laos",
            "Liban",
            "Malaisie",
            "Maldives",
            "Mongolie",
            "Népal",
            "Oman",
            "Ouzbékistan",
            "Pakistan",
            "Philippines",
            "Qatar",
            "Singapour",
            "Sri Lanka",
            "Syrie",
            "Tadjikistan",
            "Taïwan",
            "Thaïlande",
            "Timor-Leste (Timor oriental)",
            "Turkménistan",
            "Turquie",
            "Vietnam",
            "Yémen"
        ],
        "Europe": [
            "Albanie",
            "Allemagne",
            "Andorre",
            "Arménie",
            "Autriche",
            "Azerbaïdjan",
            "Biélorussie",
            "Belgique",
            "Bosnie-Herzégovine",
            "Bulgarie",
            "Croatie",
            "Chypre",
            "Danemark",
            "Espagne",
            "Estonie",
            "Finlande",
            "France",
            "Géorgie",
            "Grèce",
            "Hongrie",
            "Irlande",
            "Islande",
            "Italie",
            "Kazakhstan",
            "Lettonie",
            "Liechtenstein",
            "Lituanie",
            "Luxembourg",
            "Macédoine du Nord",
            "Malte",
            "Moldavie",
            "Monaco",
            "Monténégro",
            "Norvège",
            "Pays-Bas",
            "Pologne",
            "Portugal",
            "République tchèque",
            "Roumanie",
            "Royaume-Uni",
            "Russie",
            "Saint-Marin",
            "Serbie",
            "Slovaquie",
            "Slovénie",
            "Suède",
            "Suisse",
            "Turquie",
            "Ukraine",
            "Vatican"
        ],
        "Océanie": [
            "Australie",
            "Fidji",
            "Kiribati",
            "Îles Marshall",
            "Micronésie",
            "Nauru",
            "Nouvelle-Zélande",
            "Palaos",
            "Papouasie-Nouvelle-Guinée",
            "Salomon",
            "Samoa",
            "Tonga",
            "Tuvalu",
            "Vanuatu",
            "Îles Cook",
            "Niue",
            "Polynésie française",
            "Îles Pitcairn",
            "Wallis-et-Futuna",
            "Samoa américaines",
            "Guam",
            "Îles Mariannes du Nord",
            "Îles mineures éloignées des États-Unis",
            "Îles Cocos (Keeling)",
            "Île Christmas",
            "Îles Heard-et-MacDonald",
            "Îles Norfolk"
        ]
    };

    const sexArray = [
        "Homme",
        "Femme",
        "Autres",
        "Aucune importance"
    ];

    const ageArray = [
        "18-20",
        "21-24",
        "25-29",
        "30-35",
        "Aucune importance"
    ];

    const adeptArray = [
        "Adapte des voyages",
        "N'a pas beacoup voyagé",
        "Aucune importance"
    ];

    const [continent, setContinent] = useState(Object.keys(countryArray)[0]);
    const [country, setCountry] = useState(countryArray[continent][0]);
    const [sex, setSex] = useState(sexArray[0]);
    const [age, setAge] = useState(ageArray[0]);
    const [adept, setAdept] = useState(adeptArray[0]);
    const [selectedOrganisation, setSelectedOrganisation] = useState(null);
    const [selectedMindSet, setSelectedMindSet] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDocRef = doc(firestore, "users", user_id);
                const userDocSnapshot = await getDoc(userDocRef);
                
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data(); 
                    if (userData.destinationContinent) setContinent(userData.destinationContinent);
                    if (userData.destinationCountry) setCountry(userData.destinationCountry);
                    if (userData.destinationSex) setSex(userData.destinationSex);
                    if (userData.destinationAge) setAge(userData.destinationAge);
                    if (userData.destinationAdept) setAdept(userData.destinationAdept);
                    if (userData.destinationOrganisation) setSelectedOrganisation(userData.destinationOrganisation);
                    if (userData.destinationMindSet) setSelectedMindSet(userData.destinationMindSet);
                    if (userData.destinationBudget) setBudget(userData.destinationBudget);
                } else {
                    console.log("Le document utilisateur n'existe pas.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des données utilisateur :", error);
            }
        }

        fetchUserData();
    }, [user_id]);


    const handleContinentChange = (event) => {
        const selectedContinent = event.target.value;
        setContinent(selectedContinent);
        updateDoc(doc(firestore, "users", user_id), {
            destinationContinent: selectedContinent,
        });
        if (!countryArray[selectedContinent].includes(country)) {
            setCountry(countryArray[selectedContinent][0]);
            updateDoc(doc(firestore, "users", user_id), {
                destinationCountry: countryArray[selectedContinent][0],
            });
        }
    };

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
        updateDoc(doc(firestore, "users", user_id), {
            destinationCountry: event.target.value,
        });
    };

    const handleBeginDateChange = (event) => {
        updateDoc(doc(firestore, "users", user_id), {
            destinationBeginDate: event.target.value,
        });
    };
    
    const handleEndDateChange = (event) => {
        updateDoc(doc(firestore, "users", user_id), {
            destinationEndDate: event.target.value,
        });
    };

    const handleOrganisationClick = (index) => {
        setSelectedOrganisation(index);
        updateDoc(doc(firestore, "users", user_id), {
            destinationOrganisation: index,
        });
    };

    const handleMindSetClick = (index) => {
        setSelectedMindSet(index);
        updateDoc(doc(firestore, "users", user_id), {
            destinationMindSet: index,
        });
    };

    const handleBudgetChange = (event) => {
        setBudget(event.target.value)
        updateDoc(doc(firestore, "users", user_id), {
            destinationBudget: event.target.value,
        });
    }

    const handleSexChange = (event) => {
        setSex(event.target.value)
        updateDoc(doc(firestore, "users", user_id), {
            destinationBuddySex: event.target.value,
        });
    }

    const handleAgeChange = (event) => {
        setAge(event.target.value)
        updateDoc(doc(firestore, "users", user_id), {
            destinationBuddyAge: event.target.value,
        });
    }

    const handleAdpetChange = (event) => {
        setAdept(event.target.value)
        updateDoc(doc(firestore, "users", user_id), {
            destinationBuddyAdept: event.target.value,
        });
    }


    return(
        <div className="h-full flex flex-col items-center overflow-x-hidden overflow-y-auto px-6">
            <span className=" font-bold text-2xl" style={{ color: theme.palette.primary.main}}>Destinations</span>
            
            <div className='w-full flex flex-col'>
                <Select
                    IconComponent={() => (
                        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                    )}
                    value={continent}
                    onChange={handleContinentChange}
                    sx={{
                        background: theme.palette.InputText,
                        borderRadius: 10,
                        color: theme.palette.text.dropdown
                    }}
                    className='shadow-md px-4 my-6'
                >
                    {Object.keys(countryArray).map((name, index) => (
                        <MenuItem key={index} sx={{ background: theme.palette.InputText }} value={name}>{name}</MenuItem>
                    ))}
                </Select>

                <Select
                    IconComponent={() => (
                        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                    )}
                    value={country}
                    onChange={handleCountryChange}
                    sx={{
                        background: theme.palette.InputText,
                        borderRadius: 10,
                        color: theme.palette.text.dropdown
                    }}
                    className='shadow-md px-4'
                >
                    {countryArray[continent].map((name, index) => (
                        <MenuItem key={index} sx={{ background: theme.palette.InputText }} value={name}>{name}</MenuItem>
                    ))}
                </Select>

                <div className='flex flex-wrap text-center space-x-2 space-y-4 my-6 justify-center'>
                    <div className='flex items-center space-x-2 mt-4'>
                        <span>Du</span>
                        <div style={{ backgroundColor: theme.palette.InputText }}>
                            <input type='date' onChange={handleBeginDateChange} className=' shadow-md px-6 py-2 rounded-full' style={{ color: theme.palette.text.dropdown }} />
                        </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <span>au</span>
                        <div style={{ backgroundColor: theme.palette.InputText }}>
                            <input type='date' onChange={handleEndDateChange} className=' shadow-md px-6 py-2 rounded-full' style={{ color: theme.palette.text.dropdown }} />
                        </div>
                    </div>
                </div>
            </div>

            <span className=" font-bold text-xl my-8 text-center" style={{ color: theme.palette.primary.main}}>Comment voyez-vous l'organisation de votre voyage ?</span>
            
            <div className='flex flex-col gap-8 text-center'>
                <span onClick={() => handleOrganisationClick(0)} className={`border-2 rounded-xl py-2 px-10 shadow-md ${selectedOrganisation === 0 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}} >De façon spontané ! Let’s go, on verra la suite sur place</span>
                <span onClick={() => handleOrganisationClick(1)} className={`border-2 rounded-xl py-2 px-10 shadow-md ${selectedOrganisation === 1 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}} >Je suis très organisé, je pars avec un programme prévu à l’avance.</span>
                <span onClick={() => handleOrganisationClick(2)} className={`border-2 rounded-xl py-2 px-10 shadow-md ${selectedOrganisation === 2 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}} >Les 2 me conviennent, je peux m’adapter !</span>
            </div>

            <span className=" font-bold text-xl my-6 text-center" style={{ color: theme.palette.primary.main}}>Plutôt...</span>

            <div className='flex flex-col gap-8'>

                <div className='flex flex-row gap-8 w-full h-full item-center justify-center align-middle border-2 rounded-xl shadow-md p-4' style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}}>
                    <img src={Adventure} class="object-cover row-span-3 rounded-2xl"/>
                    <div className='flex flex-col space-y-2 mt-3 justify-between'>
                        <span className='text-md font-bold'>Aventurier</span>
                        <p className='col-span-2'>Pour ceux qui recherchent des expériences audacieuses et des défis inédits, qui aiment se challenger et découvrir de nouveaux lieux.</p>
                        <div onClick={() => handleMindSetClick(0)} className={`py-3 px-6 w-full text-center h-fit rounded-xl shadow-md ${selectedMindSet === 0 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.secondary.lightBlue, color: theme.palette.common.white}}>
                            <span className='text-center' style={{color: theme.palette.common.white}}>Sélectionner</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-8 w-full h-full item-center justify-center align-middle border-2 rounded-xl shadow-md p-4' style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}}>
                    <img src={Explorer} class="object-cover row-span-3 rounded-2xl"/>
                    <div className='flex flex-col space-y-2 mt-3 justify-between'>
                        <span className='text-md font-bold'>Explorateur</span>
                        <p className='col-span-2'>Passionné par la diversité culturelle,  pour des voyages axés sur la découverte de traditions locales, d'histoire fascinante et de la richesse culturelle du monde.</p>
                        <div onClick={() => handleMindSetClick(1)} className={`py-3 px-6 w-full text-center h-fit rounded-xl shadow-md ${selectedMindSet === 1 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.secondary.lightBlue, color: theme.palette.common.white}}>
                            <span className='text-center' style={{color: theme.palette.common.white}}>Sélectionner</span>

                        </div>
                    </div>
                </div>

                <div className='flex flex-row gap-8 w-full h-full item-center justify-center align-middle border-2 rounded-xl shadow-md p-4' style={{backgroundColor: theme.palette.InputText, borderColor: theme.palette.primary.main}}>

                    <img src={Tourist} class="object-cover row-span-3 rounded-2xl"/>
                    <div className='flex flex-col space-y-2 mt-3 justify-between'>
                        <span className='text-md font-bold'>Vacancier</span>
                        <p className='col-span-2'>Pour une escapade tranquille et apaisante, où le “Far Niente” est le slogan du séjour !.</p>
                        <div onClick={() => handleMindSetClick(2)} className={`py-3 px-6 w-full text-center h-fit rounded-xl shadow-md ${selectedMindSet === 2 ? 'opacity-50' : ''}`} style={{backgroundColor: theme.palette.secondary.lightBlue, color: theme.palette.common.white}}>

                            <span className='text-center' style={{color: theme.palette.common.white}}>Sélectionner</span>
                        </div>
                    </div>
                </div>
            </div>

            <span className=" font-bold text-xl my-12 text-center" style={{ color: theme.palette.primary.main}}>Mon budget pour le séjour est d'environ...</span>
            
            <div className='flex w-full justify-between px-6'>
                <div className='w-4 h-4 rounded-full mt-3.5' style={{ backgroundColor: theme.palette.primary.main}}></div>
                <Slider onChange={handleBudgetChange} min={0} max={1000} valueLabelDisplay="on" defaultValue={budget} track={false} sx={{'& .MuiSlider-thumb': {color:  theme.palette.chatBubble.left}}} />
                <div className='w-4 h-4 rounded-full mt-3.5' style={{ backgroundColor: theme.palette.primary.main}}></div>
            </div>
            <div className='flex w-full justify-between'>
                <span style={{ color: theme.palette.primary.main}}>Spontanée</span>
                <span style={{ color: theme.palette.primary.main}}>Organisée</span>
            </div>

            <span className=" font-bold text-xl my-6 text-center" style={{ color: theme.palette.primary.main}}>Prix</span>

            <div className='flex w-full justify-between mb-8'>
                <span className={`${budget < 300 ? 'font-bold' : ''}`}>0€ - 300€</span>
                <span className={`${budget > 300 && budget < 1000 ? 'font-bold' : ''}`}>300€ - 1000€</span>
                <span className={`${budget == 1000 ? 'font-bold' : ''}`}>+1000€</span>
            </div>
            
            <span className=" font-bold text-xl my-6 text-center" style={{ color: theme.palette.primary.main}}>Mon binôme de voyage parfait :</span>

            <div className='w-full flex flex-col'>
                <Select
                    IconComponent={() => (
                        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                    )}
                    value={sex}
                    onChange={handleSexChange}
                    sx={{
                        background: theme.palette.InputText,
                        borderRadius: 10,
                        color: theme.palette.text.dropdown
                    }}
                    className='shadow-md px-4 my-4'
                >
                    {sexArray.map((name, index) => (
                        <MenuItem key={index} sx={{ background: theme.palette.InputText }} value={name}>{name}</MenuItem>
                    ))}
                </Select>

                <Select
                    IconComponent={() => (
                        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                    )}
                    value={age}
                    onChange={handleAgeChange}
                    sx={{
                        background: theme.palette.InputText,
                        borderRadius: 10,
                        color: theme.palette.text.dropdown
                    }}
                    className='shadow-md px-4 my-4'
                >
                    {ageArray.map((name, index) => (
                        <MenuItem key={index} sx={{ background: theme.palette.InputText }} value={name}>{name} ans</MenuItem>
                    ))}
                </Select>
                <Select
                    IconComponent={() => (
                        <KeyboardArrowDownIcon sx={{ fontSize: 50, color: theme.palette.primary.main }} />
                    )}
                    value={adept}
                    onChange={handleAdpetChange}
                    sx={{
                        background: theme.palette.InputText,
                        borderRadius: 10,
                        color: theme.palette.text.dropdown
                    }}
                    className='shadow-md px-4 my-4'
                >
                    {adeptArray.map((name, index) => (
                        <MenuItem key={index} sx={{ background: theme.palette.InputText }} value={name}>{name}</MenuItem>
                    ))}
                </Select>
            </div>

        </div>
    );
}