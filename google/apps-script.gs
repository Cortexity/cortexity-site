/**
 * Cortexity — application intake.
 *
 * Deployed as a Google Apps Script "Web app" bound to a Google Sheet.
 * The website's server action POSTs JSON here (server-to-server, so no
 * CORS headers are needed). Three kinds of request, all checked against the shared secret:
 *
 *   version 2 application (current multi-step form) →
 *     1. appends one row to the "Applications v2" tab (created, with headers, on first use),
 *     2. emails NOTIFY_EMAIL (Script Property) with every answer, reply-to set to the applicant,
 *     3. sends the applicant a short confirmation with the Calendly link (reply-to NOTIFY_EMAIL).
 *   action "booked" (the applicant booked in the embedded Calendly) →
 *     sets Booked = Yes and Booked at on the row with that Event ID.
 *   legacy application (the old one-page form, no "version") →
 *     same as before: appends to the original tab with the original columns. Kept so the live
 *     site keeps working between redeploying this script and the new form going live.
 *
 * Answers {"ok":true} on success.
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

/* ---------- v2: multi-step form ---------- */

var V2_TAB = "Applications v2";

var V2_COLUMNS = [
  ["Timestamp", "submittedAt"],
  ["First name", "firstName"],
  ["Last name", "lastName"],
  ["Email", "email"],
  ["WhatsApp", "whatsapp"],
  ["Idea", "idea"],
  ["Occupation", "occupation"],
  ["Avatar", "avatar"],
  ["Booked", "booked"],
  ["Booked at", "bookedAt"],
  // Tracking (Meta Pixel + Conversions API); sent by lib/apply.ts
  ["Event ID", "eventId"],
  ["fbp", "fbp"],
  ["fbc", "fbc"],
  ["UTM Source", "utmSource"],
  ["UTM Campaign", "utmCampaign"],
  ["UTM Content", "utmContent"],
  ["Landing URL", "landingUrl"],
  ["Device", "device"],
];

/** Keys left out of the v2 notification email (tracking noise / not known yet). */
var V2_EMAIL_SKIP = ["submittedAt", "eventId", "fbp", "fbc", "landingUrl", "bookedAt"];

/* ---------- legacy: one-page form ---------- */

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

    if (data.action === "booked") return json_(markBooked_(String(data.eventId || ""), data.bookedAt, cfg.notifyEmail));

    if (Number(data.version) === 2) {
      data.booked = "No";
      data.bookedAt = "";
      appendV2Row_(data);
      sendEmailV2_(data, cfg.notifyEmail);
      sendConfirmationV2_(data, cfg.notifyEmail);
      return json_({ ok: true });
    }

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
    var sheet = legacySheet_();
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

/** The original applications tab: the first tab that isn't the v2 one. */
function legacySheet_() {
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i = 0; i < sheets.length; i++) if (sheets[i].getName() !== V2_TAB) return sheets[i];
  return SpreadsheetApp.getActiveSpreadsheet().insertSheet("Applications", 0);
}

/** The v2 tab, created at the end with a bold, frozen header row the first time it's needed. */
function v2Sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(V2_TAB);
  if (!sheet) {
    sheet = ss.insertSheet(V2_TAB, ss.getSheets().length);
    sheet.appendRow(V2_COLUMNS.map(function (c) { return c[0]; }));
    sheet.getRange(1, 1, 1, V2_COLUMNS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendV2Row_(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var row = V2_COLUMNS.map(function (c) {
      var v = data[c[1]];
      if (c[1] === "submittedAt") return v ? new Date(v) : new Date();
      return asText_(v);
    });
    v2Sheet_().appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

/** Booked = Yes on the row whose Event ID matches. */
function markBooked_(eventId, bookedAt, notifyEmail) {
  if (!eventId) return { ok: false, error: "no-event-id" };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = v2Sheet_();
    var keys = V2_COLUMNS.map(function (c) { return c[1]; });
    var idCol = keys.indexOf("eventId") + 1;
    var last = sheet.getLastRow();
    if (last < 2) return { ok: false, error: "not-found" };
    var hit = sheet.getRange(2, idCol, last - 1, 1).createTextFinder(eventId).matchEntireCell(true).findNext();
    if (!hit) return { ok: false, error: "not-found" };
    var r = hit.getRow();
    var when = bookedAt ? new Date(bookedAt) : new Date();
    sheet.getRange(r, keys.indexOf("booked") + 1).setValue("Yes");
    sheet.getRange(r, keys.indexOf("bookedAt") + 1).setValue(when);
    var values = sheet.getRange(r, 1, 1, keys.length).getValues()[0];
    var d = {};
    keys.forEach(function (k, i) { d[k] = values[i]; });
  } finally {
    lock.releaseLock();
  }
  sendBookedEmail_(d, when, notifyEmail);
  return { ok: true };
}

/** "Re: <same subject>" so it threads under the application email in Gmail / Outlook. */
function sendBookedEmail_(d, when, notifyEmail) {
  var name = (String(d.firstName || "") + " " + String(d.lastName || "")).trim() || "Unknown";
  var body =
    name + " booked a call.\n\n" +
    "BOOKED\nYes\n\n" +
    "BOOKED AT\n" + when.toLocaleString() + "\n\n" +
    "EMAIL\n" + (d.email || "") + "\n\n" +
    "WHATSAPP\n" + (d.whatsapp || "") + "\n\n" +
    "Calendly has the call time and invite.";
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = String(d.email);
  GmailApp.sendEmail(notifyEmail, "Re: " + v2Subject_(d), body, opts);
}

function v2Subject_(d) {
  var name = (String(d.firstName || "") + " " + String(d.lastName || "")).trim() || "Unknown";
  return "New Cortexity application — " + name + " (" + (d.occupation || "?") + ", " + (d.avatar || "(direct)") + ")";
}

function sendEmailV2_(d, notifyEmail) {
  var lines = V2_COLUMNS.filter(function (c) { return V2_EMAIL_SKIP.indexOf(c[1]) === -1; }).map(function (c) {
    var v = c[1] === "booked" ? "Not yet (you'll get a follow-up email when they book)" : d[c[1]];
    return c[0].toUpperCase() + "\n" + (v ? String(v) : "(not answered)") + "\n";
  });
  var subject = v2Subject_(d);
  var body = "New application received " + new Date().toLocaleString() + "\n\n" + lines.join("\n");
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = d.email;
  GmailApp.sendEmail(notifyEmail, subject, body, opts);
}

/** Short acknowledgement to the applicant with the booking link; replies go to notifyEmail. */
function sendConfirmationV2_(d, notifyEmail) {
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return;
  var first = String(d.firstName || "").trim() || "there";
  var link = String(d.calendlyUrl || "").trim();
  var body =
    "Hi " + first + ",\n\n" +
    "Thanks for telling me about your app.\n\n" +
    (link ? "If you didn’t get to book a call, pick a time here: " + link + "\n\n" : "") +
    "Joseph\nCortexity";
  GmailApp.sendEmail(d.email, "Got your application — Cortexity", body, { name: "Joseph at Cortexity", replyTo: notifyEmail });
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

/**
 * Run this from the editor to check the v2 tab + both emails + the booking update
 * (asks for permissions the first time). Adds one test row, marked Booked = Yes.
 */
function testV2_() {
  var cfg = config_();
  if (!cfg) {
    throw new Error("Not configured: add the Script Properties SECRET and NOTIFY_EMAIL (Project Settings → Script Properties). See google/SETUP.md.");
  }
  var eventId = "test-" + new Date().getTime();
  var fake = {
    secret: cfg.secret,
    version: 2,
    submittedAt: new Date().toISOString(),
    firstName: "Test",
    lastName: "Person",
    email: cfg.notifyEmail,
    whatsapp: "+966500000000",
    idea: "A test application from the Apps Script editor.",
    occupation: "Fitness coach",
    avatar: "/fitness",
    eventId: eventId,
    fbp: "",
    fbc: "",
    utmSource: "",
    utmCampaign: "",
    utmContent: "",
    landingUrl: "",
    device: "desktop",
    calendlyUrl: "https://calendly.com/josephselwan/intro-call",
  };
  Logger.log(doPost({ postData: { contents: JSON.stringify(fake) } }).getContent());
  Logger.log(doPost({ postData: { contents: JSON.stringify({ secret: cfg.secret, action: "booked", eventId: eventId }) } }).getContent());
}

/** Legacy one-page form check (original tab). */
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
