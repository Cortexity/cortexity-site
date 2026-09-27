/**
 * Cortexity — application intake.
 *
 * Deployed as a Google Apps Script "Web app" bound to a Google Sheet.
 * The website's server action POSTs JSON here (server-to-server, so no
 * CORS headers are needed). Each valid request:
 *   1. checks the shared secret,
 *   2. appends one row to the active sheet (creating the header row if missing),
 *   3. emails NOTIFY_EMAIL with every answer, reply-to set to the applicant,
 *   4. sends the applicant a short confirmation (reply-to NOTIFY_EMAIL),
 *   5. answers {"ok":true}.
 *
 * Setup: google/SETUP.md.
 */

// ── Fill these two in ───────────────────────────────────────────────────────
var SECRET = "change-me-to-a-long-random-string"; // same value as APPS_SCRIPT_SECRET on the website
var NOTIFY_EMAIL = "you@gmail.com"; // where new applications are sent
// ────────────────────────────────────────────────────────────────────────────

var COLUMNS = [
  ["Timestamp", "submittedAt"],
  ["Name", "name"],
  ["Email", "email"],
  ["WhatsApp", "whatsapp"],
  ["Idea", "idea"],
  ["Why", "why"],
  ["Users", "users"],
  ["Top 3", "top3"],
  ["Similar apps", "similar"],
  ["Stage", "stage"],
  ["Platforms", "platforms"],
  ["Start", "start"],
  ["Budget", "budget"],
  ["Anything else", "anything"],
];

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!data.secret || data.secret !== SECRET) return json_({ ok: false, error: "unauthorised" });

    var row = COLUMNS.map(function (c) {
      var v = data[c[1]];
      if (c[1] === "submittedAt") v = v ? new Date(v) : new Date();
      return v == null ? "" : v;
    });

    appendRow_(row);
    sendEmail_(data);
    sendConfirmation_(data);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Appends the row, adding the header row first if the sheet is empty. */
function appendRow_(row) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS.map(function (c) { return c[0]; }));
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function sendEmail_(d) {
  var lines = COLUMNS.filter(function (c) { return c[1] !== "submittedAt"; }).map(function (c) {
    var v = d[c[1]];
    return c[0].toUpperCase() + "\n" + (v ? String(v) : "(not answered)") + "\n";
  });
  var subject = "New Cortexity application — " + (d.name || "Unknown") + " (" + (d.platforms || "platform not chosen") + ")";
  var body = "New application received " + new Date().toLocaleString() + "\n\n" + lines.join("\n");
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = d.email;
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body, opts);
}

/** Short acknowledgement to the applicant; replies go to NOTIFY_EMAIL. */
function sendConfirmation_(d) {
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return;
  var first = String(d.name || "").trim().split(/\s+/)[0] || "there";
  var body =
    "Hi " + first + ",\n\n" +
    "Thanks for telling me about your app.\n\n" +
    "I read every application myself. You’ll hear from me within 48 hours.\n\n" +
    "Joseph\nCortexity";
  GmailApp.sendEmail(d.email, "Got your application — Cortexity", body, { name: "Joseph at Cortexity", replyTo: NOTIFY_EMAIL });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to check the sheet + email work (asks for permissions). */
function test_() {
  var fake = {
    secret: SECRET,
    submittedAt: new Date().toISOString(),
    name: "Test Person",
    email: NOTIFY_EMAIL,
    whatsapp: "+961 00 000 000",
    idea: "A test application from the Apps Script editor.",
    why: "To check the setup.",
    users: "Me.",
    top3: "1, 2, 3",
    similar: "",
    stage: "It’s mostly an idea",
    platforms: "iPhone ($5,000)",
    start: "As soon as possible",
    budget: "Yes",
    anything: "",
  };
  var out = doPost({ postData: { contents: JSON.stringify(fake) } });
  Logger.log(out.getContent());
}
