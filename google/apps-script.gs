/**
 * Cortexity — application intake.
 *
 * Deployed as a Google Apps Script "Web app" bound to a Google Sheet.
 * The website's server action POSTs JSON here (server-to-server, so no
 * CORS headers are needed). Each valid request:
 *   1. checks the shared secret,
 *   2. appends one row to the active sheet (creating the header row if missing),
 *   3. emails NOTIFY_EMAIL (Script Property) with every answer, reply-to set to the applicant,
 *   4. sends the applicant a short confirmation (reply-to NOTIFY_EMAIL),
 *   5. answers {"ok":true}.
 *
 * Setup: google/SETUP.md.
 */

// SECRET and NOTIFY_EMAIL live in Script Properties (Project Settings → Script Properties),
// not in this file, so re-pasting the script never overwrites them. See google/SETUP.md.
//   SECRET        same value as APPS_SCRIPT_SECRET on the website
//   NOTIFY_EMAIL  where new applications are sent

/** Reads SECRET and NOTIFY_EMAIL from Script Properties; null if either is missing. */
function config_() {
  var props = PropertiesService.getScriptProperties();
  var secret = String(props.getProperty("SECRET") || "").trim();
  var notifyEmail = String(props.getProperty("NOTIFY_EMAIL") || "").trim();
  if (!secret || !notifyEmail) return null;
  return { secret: secret, notifyEmail: notifyEmail };
}

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
  // Tracking (Meta Pixel + Conversions API); sent by lib/apply.ts
  ["Qualified", "qualified"],
  ["Event ID", "eventId"],
  ["fbp", "fbp"],
  ["fbc", "fbc"],
  ["UTM Source", "utmSource"],
  ["UTM Campaign", "utmCampaign"],
  ["UTM Content", "utmContent"],
  ["Landing URL", "landingUrl"],
  ["Device", "device"],
];

/** Keys left out of the notification email (tracking noise). */
var EMAIL_SKIP = ["submittedAt", "eventId", "fbp", "fbc", "landingUrl"];

function doPost(e) {
  try {
    var cfg = config_();
    if (!cfg) return json_({ ok: false, error: "not-configured" });
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!data.secret || data.secret !== cfg.secret) return json_({ ok: false, error: "unauthorised" });

    var row = COLUMNS.map(function (c) {
      var v = data[c[1]];
      if (c[1] === "submittedAt") return v ? new Date(v) : new Date();
      return asText_(v);
    });

    appendRow_(row);
    sendEmail_(data, cfg.notifyEmail);
    sendConfirmation_(data, cfg.notifyEmail);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/**
 * Sheets treats a leading "=", "+", "-" or "@" as a formula: "+96171234567" would lose its "+",
 * and a free-text answer starting with "=" would run as a formula. A leading apostrophe makes
 * Sheets store the value as literal text (the apostrophe itself is not shown in the cell).
 */
function asText_(v) {
  if (v == null) return "";
  var s = String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/** Appends the row, adding the header row first if the sheet is empty. */
function appendRow_(row) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var headers = COLUMNS.map(function (c) { return c[0]; });
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
      sheet.setFrozenRows(1);
    } else if (sheet.getLastColumn() < COLUMNS.length) {
      // Existing sheet from before the tracking columns: extend the header row in place.
      sheet.getRange(1, 1, 1, COLUMNS.length).setValues([headers]).setFontWeight("bold");
    }
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function sendEmail_(d, notifyEmail) {
  var lines = COLUMNS.filter(function (c) { return EMAIL_SKIP.indexOf(c[1]) === -1; }).map(function (c) {
    var v = d[c[1]];
    return c[0].toUpperCase() + "\n" + (v ? String(v) : "(not answered)") + "\n";
  });
  var subject = "New Cortexity application — " + (d.name || "Unknown") + " (" + (d.platforms || "platform not chosen") + ")";
  var body = "New application received " + new Date().toLocaleString() + "\n\n" + lines.join("\n");
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = d.email;
  GmailApp.sendEmail(notifyEmail, subject, body, opts);
}

/** Short acknowledgement to the applicant; replies go to notifyEmail. */
function sendConfirmation_(d, notifyEmail) {
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return;
  var first = String(d.name || "").trim().split(/\s+/)[0] || "there";
  var body =
    "Hi " + first + ",\n\n" +
    "Thanks for telling me about your app.\n\n" +
    "I read every application myself. You’ll hear from me within 48 hours.\n\n" +
    "Joseph\nCortexity";
  GmailApp.sendEmail(d.email, "Got your application — Cortexity", body, { name: "Joseph at Cortexity", replyTo: notifyEmail });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once from the editor to check the sheet + email work (asks for permissions). */
function test_() {
  var cfg = config_();
  if (!cfg) {
    throw new Error("Not configured: add the Script Properties SECRET and NOTIFY_EMAIL (Project Settings → Script Properties). See google/SETUP.md.");
  }
  var fake = {
    secret: cfg.secret,
    submittedAt: new Date().toISOString(),
    name: "Test Person",
    email: cfg.notifyEmail,
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
    qualified: "Yes",
    eventId: "test-" + new Date().getTime(),
    fbp: "",
    fbc: "",
    utmSource: "",
    utmCampaign: "",
    utmContent: "",
    landingUrl: "",
    device: "desktop",
  };
  var out = doPost({ postData: { contents: JSON.stringify(fake) } });
  Logger.log(out.getContent());
}
