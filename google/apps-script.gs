/**
 * Cortexity — application intake.
 *
 * Deployed as a Google Apps Script "Web app" bound to a Google Sheet.
 * The website's server action POSTs JSON here (server-to-server, so no
 * CORS headers are needed). Three kinds of request, all checked against the shared secret:
 *
 *   version 3 application (current form: app type, similar apps, stage, platforms, start, budget,
 *   occupation, contact) → same as version 2 below, on the "Applications v3" tab, plus a Qualified column.
 *   version 2 application (previous three-question form) →
 *     1. appends one row to the "Applications v2" tab (created, with headers, on first use),
 *     2. emails NOTIFY_EMAIL (Script Property) with every answer, reply-to set to the applicant,
 *     3. sends the applicant a short confirmation with the Calendly link (reply-to NOTIFY_EMAIL).
 *   action "booked" (the applicant booked in the embedded Calendly) →
 *     sets Booked = Yes and Booked at on the row with that Event ID, then (about a minute later,
 *     once Calendly has put the call in the calendar) emails you the call time in your time and
 *     theirs, plus their answer to Calendly's "Anything you'd like me to know" question.
 *   "Less than $5,000" applications are saved and emailed to you like any other, but the
 *   applicant gets no confirmation email (they see a message on the site instead of the calendar).
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

/**
 * "Your time" in the emails to you: London until 14 December 2026, 06:00 Beirut time
 * (04:00 UTC), Beirut from then on. Returns [IANA time zone, label].
 */
var MY_TZ_SWITCH_AT = Date.UTC(2026, 11, 14, 4, 0);
function myTz_() {
  return Date.now() < MY_TZ_SWITCH_AT ? ["Europe/London", "London time"] : ["Asia/Beirut", "Beirut time"];
}

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

/* ---------- v3: one question per screen, with screening ---------- */

var V3_TAB = "Applications v3";

var V3_COLUMNS = [
  ["Timestamp", "submittedAt"],
  ["First name", "firstName"],
  ["Last name", "lastName"],
  ["Email", "email"],
  ["WhatsApp", "whatsapp"],
  ["App", "idea"],
  ["Similar apps", "similar"],
  ["Stage", "stage"],
  ["Platforms", "platforms"],
  ["Start", "start"],
  ["Budget", "budget"],
  ["Qualified", "qualified"],
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
    if (data.action === "budget") return json_({ ok: false, error: "gone" }); // retired "I can stretch my budget"; never falls through to the legacy append

    if (Number(data.version) === 3) {
      data.booked = "No";
      data.bookedAt = "";
      appendTabRow_(V3_TAB, V3_COLUMNS, data);
      sendEmailTab_(V3_COLUMNS, data, cfg.notifyEmail);
      sendConfirmationV2_(data, cfg.notifyEmail);
      return json_({ ok: true });
    }

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
  for (var i = 0; i < sheets.length; i++) if (sheets[i].getName() !== V2_TAB && sheets[i].getName() !== V3_TAB) return sheets[i];
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

/** A tab by name, created at the end with a bold, frozen header row the first time it's needed. */
function tabSheet_(name, columns) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name, ss.getSheets().length);
    sheet.appendRow(columns.map(function (c) { return c[0]; }));
    sheet.getRange(1, 1, 1, columns.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendTabRow_(name, columns, data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var row = columns.map(function (c) {
      var v = data[c[1]];
      if (c[1] === "submittedAt") return v ? new Date(v) : new Date();
      return asText_(v);
    });
    tabSheet_(name, columns).appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function sendEmailTab_(columns, d, notifyEmail) {
  var lines = columns.filter(function (c) { return V2_EMAIL_SKIP.indexOf(c[1]) === -1; }).map(function (c) {
    var v = c[1] === "booked" ? "Not yet (you'll get a follow-up email when they book)" : d[c[1]];
    return c[0].toUpperCase() + "\n" + (v ? String(v) : "(not answered)") + "\n";
  });
  var subject = v2Subject_(d);
  var body = "New application received " + new Date().toLocaleString() + "\n\n" + lines.join("\n");
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = d.email;
  GmailApp.sendEmail(notifyEmail, subject, body, opts);
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

/** The row whose Event ID matches (v3 tab first, then v2): { sheet, keys, row } or null. */
function findByEventId_(eventId) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabs = [[V3_TAB, V3_COLUMNS], [V2_TAB, V2_COLUMNS]];
  for (var t = 0; t < tabs.length; t++) {
    var sh = ss.getSheetByName(tabs[t][0]);
    if (!sh || sh.getLastRow() < 2) continue;
    var ks = tabs[t][1].map(function (c) { return c[1]; });
    var found = sh.getRange(2, ks.indexOf("eventId") + 1, sh.getLastRow() - 1, 1).createTextFinder(eventId).matchEntireCell(true).findNext();
    if (found) return { sheet: sh, keys: ks, row: found.getRow() };
  }
  return null;
}

/** The row's values by key. */
function rowData_(hit) {
  var values = hit.sheet.getRange(hit.row, 1, 1, hit.keys.length).getValues()[0];
  var d = {};
  hit.keys.forEach(function (k, i) { d[k] = values[i]; });
  return d;
}

/** Booked = Yes on the row whose Event ID matches; the email to you follows once the call is in the calendar. */
function markBooked_(eventId, bookedAt, notifyEmail) {
  if (!eventId) return { ok: false, error: "no-event-id" };
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var hit = findByEventId_(eventId);
    if (!hit) return { ok: false, error: "not-found" };
    var when = bookedAt ? new Date(bookedAt) : new Date();
    hit.sheet.getRange(hit.row, hit.keys.indexOf("booked") + 1).setValue("Yes");
    hit.sheet.getRange(hit.row, hit.keys.indexOf("bookedAt") + 1).setValue(when);
    queueBooked_(eventId, when);
  } finally {
    lock.releaseLock();
  }
  return { ok: true };
}

/* ---------- booking email: waits for Calendly to put the call in the calendar ---------- */

var PENDING_KEY = "pendingBookedEmails";
var PENDING_HANDLER = "sendPendingBookedEmails";
var PENDING_GIVE_UP_MS = 10 * 60 * 1000; // after 10 minutes, send without the call time

function pending_() {
  try { return JSON.parse(PropertiesService.getScriptProperties().getProperty(PENDING_KEY) || "[]"); } catch (e) { return []; }
}
function savePending_(list) {
  PropertiesService.getScriptProperties().setProperty(PENDING_KEY, JSON.stringify(list));
}

/** Call with the script lock held. */
function queueBooked_(eventId, when) {
  var list = pending_();
  list.push({ eventId: eventId, when: when.toISOString(), queuedAt: Date.now() });
  savePending_(list);
  armPendingTrigger_();
}

/** One-off trigger ~30 seconds from now, unless one is already waiting. */
function armPendingTrigger_() {
  var armed = ScriptApp.getProjectTriggers().some(function (t) { return t.getHandlerFunction() === PENDING_HANDLER; });
  if (!armed) ScriptApp.newTrigger(PENDING_HANDLER).timeBased().after(30 * 1000).create();
}

/** Runs from the one-off trigger: sends each queued booking email once its call is in the calendar. */
function sendPendingBookedEmails() {
  var cfg = config_();
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  var list, ready = [], keep = [];
  try {
    ScriptApp.getProjectTriggers().forEach(function (t) {
      if (t.getHandlerFunction() === PENDING_HANDLER) ScriptApp.deleteTrigger(t);
    });
    list = pending_();
    list.forEach(function (p) {
      var hit = findByEventId_(p.eventId);
      if (!hit) return; // row gone: drop it
      var d = rowData_(hit);
      var call = findCall_(String(d.email || "").trim().toLowerCase(), String(d.whatsapp || "").replace(/\D/g, ""));
      if (call || Date.now() - p.queuedAt > PENDING_GIVE_UP_MS) ready.push({ d: d, when: new Date(p.when), call: call });
      else keep.push(p);
    });
    savePending_(keep);
    if (keep.length) armPendingTrigger_();
  } finally {
    lock.releaseLock();
  }
  if (cfg) ready.forEach(function (r) { sendBookedEmail_(r.d, r.when, r.call, cfg.notifyEmail); });
}

/** Their answer to Calendly's "Anything you'd like me to know before the call?" (in the event description). */
function calendlyNote_(desc) {
  var m = /Anything you.{0,2}d like me to know before the call\??[ \t]*:?\s*([\s\S]*?)\n\s*\n(?:Need to make changes|Powered by Calendly)/i.exec(desc || "");
  return m ? m[1].trim() : "";
}

/** "Re: <same subject>" so it threads under the application email in Gmail / Outlook. */
function sendBookedEmail_(d, when, call, notifyEmail) {
  var name = (String(d.firstName || "") + " " + String(d.lastName || "")).trim() || "Unknown";
  var tz = myTz_();
  var digits = String(d.whatsapp || "").replace(/\D/g, "");
  var note = call ? calendlyNote_(call.getDescription()) : "";
  var budget = d.budget ? String(d.budget) : "";
  var body =
    name + " booked a call.\n\n" +
    "CALL, YOUR TIME\n" + (call ? Utilities.formatDate(call.getStartTime(), tz[0], "EEEE d MMMM, HH:mm") + " (" + tz[1] + ")" : "Not in your calendar yet, check Calendly") + "\n\n" +
    (call ? "CALL, THEIR TIME\n" + leadTime_(call.getStartTime(), digits) + "\n\n" : "") +
    "ANYTHING THEY WANT YOU TO KNOW\n" + (call ? note || "(not answered)" : "(see Calendly)") + "\n\n" +
    "BOOKED\nYes\n\n" +
    "BOOKED AT\n" + Utilities.formatDate(when, tz[0], "EEE d MMM, HH:mm") + " (" + tz[1] + ")\n\n" +
    (budget ? "BUDGET\n" + budget + "\n\n" : "") +
    "EMAIL\n" + (d.email || "") + "\n\n" +
    "WHATSAPP\n" + (d.whatsapp || "");
  var opts = { name: "Cortexity applications" };
  if (d.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) opts.replyTo = String(d.email);
  GmailApp.sendEmail(notifyEmail, "Re: " + v2Subject_(d), body, opts);
}

function v2Subject_(d) {
  var name = (String(d.firstName || "") + " " + String(d.lastName || "")).trim() || "Unknown";
  var extra = d.budget ? ", " + d.budget + (String(d.qualified) === "No" ? ", not qualified" : "") : "";
  return "New Cortexity application — " + name + " (" + (d.occupation || "?") + ", " + (d.avatar || "(direct)") + extra + ")";
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
  if (d.underFloor === true) return; // "Less than $5,000": no email to the applicant
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

/**
 * Run from the editor to check the v3 tab + both emails + the booking update.
 * Adds one test row, marked Booked = Yes.
 */
function testV3_() {
  var cfg = config_();
  if (!cfg) throw new Error("Not configured: add the Script Properties SECRET and NOTIFY_EMAIL. See google/SETUP.md.");
  var eventId = "test-" + new Date().getTime();
  var fake = {
    secret: cfg.secret, version: 3, submittedAt: new Date().toISOString(),
    firstName: "Test", lastName: "Person", email: cfg.notifyEmail, whatsapp: "+966500000000",
    idea: "A test application from the Apps Script editor.", similar: "", stage: "I have designs or wireframes",
    platforms: "iPhone, Android", start: "Within 30 days", budget: "$20,000 to $50,000", qualified: "Yes",
    occupation: "Founder", avatar: "/", eventId: eventId, fbp: "", fbc: "", utmSource: "", utmCampaign: "",
    utmContent: "", landingUrl: "", device: "desktop", calendlyUrl: "https://calendly.com/josephselwan/intro-call",
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
