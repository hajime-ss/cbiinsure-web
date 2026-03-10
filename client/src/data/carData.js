export const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear()) - i);

// Top 10 Car Brands in Thailand
export const carDatabase = {
    "Toyota": {
        "Yaris": ["1.2 Entry", "1.2 Sport", "1.2 Premium"],
        "Vios": ["1.5 Mid", "1.5 High", "1.5 GR Sport"],
        "Corolla Altis": ["1.6 G", "1.8 Sport", "HEV Premium"],
        "Camry": ["2.0 G", "2.5 Premium", "HEV Premium Luxury"],
        "Hilux Revo": ["Smart Cab 2.4", "Double Cab 2.4", "Rocco 2.8"],
        "Fortuner": ["2.4 G", "2.4 V", "2.8 Legender"],
        "Corolla Cross": ["1.8 Sport", "HEV Premium", "HEV GR Sport"],
    },
    "Honda": {
        "City": ["1.0 Turbo S", "1.0 Turbo SV", "1.0 Turbo RS", "e:HEV RS"],
        "Civic": ["1.5 Turbo EL", "1.5 Turbo EL+", "e:HEV RS"],
        "Accord": ["1.5 Turbo EL", "e:HEV EL+", "e:HEV Tech"],
        "HR-V": ["e:HEV E", "e:HEV EL", "e:HEV RS"],
        "CR-V": ["2.4 S", "2.4 ES", "1.6 DT-EL AWD", "e:HEV RS"],
        "Jazz": ["1.5 S", "1.5 V", "1.5 RS"],
    },
    "Isuzu": {
        "D-Max": ["1.9 Ddi S", "1.9 Ddi Z", "3.0 Ddi V-Cross", "Spacecab", "Cab4"],
        "MU-X": ["1.9 Active", "1.9 Elegant", "3.0 Ultimate"],
    },
    "Mitsubishi": {
        "Mirage": ["1.2 GLX", "1.2 GLS", "1.2 GLS-LTD"],
        "Attrage": ["1.2 GLX", "1.2 GLS", "1.2 GLS-LTD"],
        "Triton": ["Single Cab 2.4", "Mega Cab 2.4", "Double Cab Plus 2.4"],
        "Pajero Sport": ["2.4 GT", "2.4 GT-Premium", "2.4 Elite Edition"],
        "Xpander": ["1.5 GLS-LTD", "1.5 GT", "1.5 Cross"],
    },
    "Nissan": {
        "Almera": ["1.0 Turbo E", "1.0 Turbo V", "1.0 Turbo VL"],
        "March": ["1.2 S", "1.2 E", "1.2 V"],
        "Navara": ["King Cab 2.5", "Double Cab 2.5", "PRO-2X", "PRO-4X"],
        "Kicks": ["e-POWER V", "e-POWER VL", "e-POWER Autech"],
        "Terra": ["2.3 E", "2.3 VL", "2.3 VL 4WD"],
    },
    "Mazda": {
        "Mazda2": ["1.3 E", "1.3 C", "1.3 S", "1.5 XDL"],
        "Mazda3": ["2.0 C", "2.0 S", "2.0 SP"],
        "CX-3": ["2.0 Base", "2.0 Core", "2.0 Proactive"],
        "CX-30": ["2.0 C", "2.0 S", "2.0 SP"],
        "CX-5": ["2.0 S", "2.0 SP", "2.2 XDL"],
    },
    "Ford": {
        "Ranger": ["XL 2.0", "XLT 2.0", "Wildtrak 2.0", "Raptor 3.0 V6"],
        "Everest": ["2.0 Trend", "2.0 Sport", "2.0 Titanium+"],
    },
    "MG": {
        "MG3": ["1.5 C", "1.5 D", "1.5 X"],
        "MG5": ["1.5 C", "1.5 D", "1.5 X"],
        "MG ZS": ["1.5 C+", "1.5 D", "1.5 X+"],
        "MG HS": ["1.5 C", "1.5 D", "PHEV X"],
    },
    "Suzuki": {
        "Swift": ["1.2 GL", "1.2 GLX"],
        "Celerio": ["1.0 GA", "1.0 GL", "1.0 GX"],
        "Ciaz": ["1.2 GL", "1.2 GLX", "1.2 RS"],
        "Ertiga": ["1.5 GL", "1.5 GX"],
    },
    "Chevrolet": {
        "Colorado": ["X-Cab 2.5", "C-Cab 2.5", "High Country 2.5"],
        "Trailblazer": ["2.5 LT", "2.5 LTZ", "2.5 Z71"],
        "Captiva": ["1.5 LS", "1.5 LT", "1.5 Premier"],
    }
};

export const getBrands = () => Object.keys(carDatabase);
export const getModels = (brand) => brand && carDatabase[brand] ? Object.keys(carDatabase[brand]) : [];
export const getSubmodels = (brand, model) => brand && model && carDatabase[brand]?.[model] ? carDatabase[brand][model] : [];
