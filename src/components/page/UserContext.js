// AppStateContext.js
import { createContext, useReducer, useContext } from "react";

// Define initial state
const initialState = {
  registrasi: {},
  login: {},
  reportMechant: {},
  donation: {},
  // tambahkan state lain jika diperlukan
};

// Create context
const AppStateContext = createContext();

// Define actions
const SET_REGISTRASI = "SET_REGISTRASI";
const SET_LOGIN = "SET_LOGIN";
const SET_REPORT_MERCHANT = "SET_REPORT_MERCHANT";
const SET_DONATION = "SET_DONATION";

// Create reducer
const appStateReducer = (state, action) => {
  switch (action.type) {
    case SET_REGISTRASI:
      return { ...state, registrasi: action.payload };
    case SET_LOGIN:
      return { ...state, login: action.payload };
    case SET_REPORT_MERCHANT:
      return { ...state, reportMechant: action.payload };
    case SET_DONATION:
      return { ...state, donation: action.payload };
    default:
      return state;
  }
};

// Create context provider
export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialState);
  // const [registrasi, setRegistrasi] = useState({});
  // const [login, setlogin] = useState({});
  // const [reportMechant, setreportMechant] = useState({});

  const setRegistrasi = (registrasi) => {
    dispatch({ type: SET_REGISTRASI, payload: registrasi });
  };

  const setLogin = (login) => {
    dispatch({ type: SET_LOGIN, payload: login });
  };

  const setReportMechant = (reportMechant) => {
    // Perbaiki penulisan setreportMechant menjadi setReportMechant
    dispatch({ type: SET_REPORT_MERCHANT, payload: reportMechant });
  };

  const setDonation = (donation) => {
    dispatch({ type: SET_DONATION, payload: donation });
  };

  return (
    // <AppStateContext.Provider value={{ registrasi, setRegistrasi, login, setlogin, reportMechant, setreportMechant }}>
    <AppStateContext.Provider
      value={{ state, setRegistrasi, setLogin, setReportMechant, setDonation }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

// Create custom hook to use the context
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};
