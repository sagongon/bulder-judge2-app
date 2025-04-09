import React, { useEffect, useState } from 'react';

// הגדרת ה-Scopes
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";  

const App = () => {
  const [authLoaded, setAuthLoaded] = useState(false);  // לניהול מצב ההתחברות
  const [signedIn, setSignedIn] = useState(false);  // לניהול מצב ההתחברות של המשתמש
  const [error, setError] = useState(null);  // לניהול שגיאות

  // פונקציה שמטעינה את הספרייה של GAPI
  const loadGAPI = () => {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load('client:auth2', initClient); // שמנו את gapi בתוך window
    };
    document.body.appendChild(script);
  };

  // פונקציה שמאתחלת את ה-client של Google API
  const initClient = () => {
    window.gapi.client.init({
      apiKey: 'AIzaSyClTpVfeT55lBht-mZMLBIZLoOU_heZfl0',  // ה-API Key שלך
      clientId: '708983298183-t18fdo74epqe3kbi0upok84vj4i5cjal.apps.googleusercontent.com',  // ה-Client ID שלך
      scope: SCOPES,  // ה-Scopes שהגדרת
    }).then(() => {
      setAuthLoaded(true);  // אנחנו יודעים שהכל התנהל בהצלחה אם הגענו לכאן
      const authInstance = window.gapi.auth2.getAuthInstance();
      setSignedIn(authInstance.isSignedIn.get());  // בדוק אם המשתמש מחובר
    }).catch((error) => {
      setError(error);  // עדכון שגיאה אם יש
      console.log("שגיאה בהתחברות ל-Google API:", error);
    });
  };

  // טוענים את ה-client של Google ומבצעים את האתחול
  useEffect(() => {
    loadGAPI();  // טוען את הספרייה של Google API
  }, []);

  // התחברות עם OAuth2
  const signIn = () => {
    window.gapi.auth2.getAuthInstance().signIn().then(() => {
      setSignedIn(true);  // משתמש התחבר בהצלחה
      console.log("התחברת בהצלחה!");
    }).catch((error) => {
      setError(error);  // עדכון שגיאה אם יש
      console.log("שגיאה בהתחברות ל-Google:", error);
    });
  };

  // יציאה מהחשבון של Google
  const signOut = () => {
    window.gapi.auth2.getAuthInstance().signOut().then(() => {
      setSignedIn(false);  // משתמש התנתק בהצלחה
      console.log("התנתקת בהצלחה!");
    }).catch((error) => {
      setError(error);  // עדכון שגיאה אם יש
      console.log("שגיאה בהתנתקות:", error);
    });
  };

  // פונקציה לשמירת התוצאה בגוגל שיט
  const saveToSheet = (data) => {
    if (!signedIn) {
      console.log("התחבר קודם ל-Google");
      return;
    }

    const sheetId = '1iQNsYbU3hpmKiXOAqo1C5wuj03zABQgS_G07waf2Cis';  // מזהה הגיליון שלך
    const range = 'Atempts!W2';  // עמודה בה תעדכן את התוצאה
    const valueRange = {
      values: [
        [data],  // כאן נכנסת התוצאה שלך, לדוגמה אם זו תוצאה של מתחרה
      ],
    };

    window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: valueRange,
    }).then((response) => {
      console.log('תוצאה נשמרה בהצלחה:', response);
    }).catch((error) => {
      setError(error);  // עדכון שגיאה אם יש
      console.log('שגיאה בשמירת התוצאה:', error);
    });
  };

  return (
    <div>
      <h1>ברוך הבא לאפליקציה</h1>
      {error && <p style={{ color: 'red' }}>שגיאה: {error.message}</p>}  {/* הצגת שגיאות */}
      
      {/* אם לא הושלמה ההתחברות */}
      {!authLoaded ? (
        <p>טוען את ההתחברות...</p>
      ) : (
        <div>
          {!signedIn ? (
            <button onClick={signIn}>התחבר עם Google</button>
          ) : (
            <div>
              <button onClick={() => saveToSheet("תוצאה מוצלחת")}>שמור תוצאה</button>
              <button onClick={signOut}>התנתק</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
