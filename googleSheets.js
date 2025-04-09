const readGoogleSheet = async () => {
  if (!spreadsheetLink) {
    alert('אנא הזן לינק לקובץ Google Sheets');
    return;
  }

  const spreadsheetId = spreadsheetLink.split('/')[5]; // חילוץ ה-ID
  const sheetName = 'Competitors';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A2:A?alt=json&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.values && data.values.length) {
      const names = data.values.map(row => row[0]);
      setCompetitors(names);
    } else {
      alert('לא נמצאו מתחרים בקובץ');
    }
  } catch (error) {
    console.error('שגיאה בקריאת Google Sheets:', error);
    alert('שגיאה בקריאת קובץ Google Sheets');
  }
};
