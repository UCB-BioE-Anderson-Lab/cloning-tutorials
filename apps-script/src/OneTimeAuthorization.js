function setupSpreadsheet() {
  GradesRecorder.configureSpreadsheet('1lORUCvokN_M6IYGwadpgE4jb4JoBCYGQty0fKjdC8xo');
  Logger.log('Set GRADES_SPREADSHEET_ID');
}

function testRecord() {
  GradesRecorder.recordResult({
    email: "jcanderson@berkeley.edu",
    first_name: "Test",
    last_name: "User",
    submitted_at: new Date().toISOString(),
    quizzes_passed_new: ["lab_safety"]
  });
}

function forceAuth() {
  // Force explicit spreadsheets scope prompt
  var ss = SpreadsheetApp.openById('1lORUCvokN_M6IYGwadpgE4jb4JoBCYGQty0fKjdC8xo');
  ss.getName(); // touch the sheet to ensure scope is needed
}