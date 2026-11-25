/**
 * Call reminders + bounce alerts. One 15-minute trigger runs both.
 *
 * Reminders (free replacement for Calendly's paid ones): looks in this Google account's calendar
 * for "Cortexity Intro Call" events and emails each guest ~24 hours and ~1 hour before, with the
 * time shown in the lead's own time zone (from their WhatsApp country code). Each reminder is sent
 * once per event (tracked with event tags).
 *
 * Bounce alerts: when one of our automated emails to a lead bounces (address doesn't exist, inbox
 * full), marks "Email status" on their sheet row and emails you a one-tap WhatsApp link with a
 * ready-made message (call time in their time zone + Google Meet link). One alert per address.
 *
 * Setup (once):
 *   1. Paste this file into the same Apps Script project as apps-script.gs (+ → Script → "reminders").
 *   2. Optional, for the real meet.google.com link in WhatsApp messages: Services (+) → Google Calendar API → Add.
 *      Without it the message uses Calendly's Google Meet link, which opens the same meeting.
 *   3. Select the function `installReminderTrigger` in the toolbar and click Run. Approve the
 *      Calendar + Gmail + Sheets permissions. Re-running it never creates a second trigger.
 *   4. To test without waiting, run `testReminderScan` (logs what it would send, sends nothing).
 */

var REMINDER_TITLE = "Cortexity Intro Call"; // Calendly event type name, matched in the title or description (case-insensitive)
var REMINDER_FROM_NAME = "Joseph at Cortexity";
var REMINDER_WINDOWS = [
  { tag: "cx_rem_24h", label: "tomorrow" },
  { tag: "cx_rem_1h", label: "in 1 hour" },
];

function installReminderTrigger() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === "sendReminders") ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger("sendReminders").timeBased().everyMinutes(15).create();
  sendReminders();
}

function sendReminders() {
  var lock = LockService.getUserLock();
  if (!lock.tryLock(1000)) return; // another run is still going (e.g. a duplicate trigger)
  try {
    scan_(false);
    checkBounces_(false);
    bookingAlerts_(false);
  } finally {
    lock.releaseLock();
  }
}
function testReminderScan() { scan_(true); checkBounces_(true); bookingAlerts_(true); }

/** Logs every trigger in this project, so duplicates are easy to spot. */
function listTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    Logger.log(t.getHandlerFunction() + " — " + t.getEventType() + " — id " + t.getUniqueId());
  });
}

function scan_(dryRun) {
  var now = new Date();
  var until = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  var me = Session.getEffectiveUser().getEmail().toLowerCase();
  var events = CalendarApp.getDefaultCalendar().getEvents(now, until);

  events.forEach(function (ev) {
    // Calendly titles the event "<Guest> and Joseph Selwan"; the event type name is in the description.
    var text = (ev.getTitle() + "\n" + (ev.getDescription() || "")).toLowerCase();
    if (text.indexOf(REMINDER_TITLE.toLowerCase()) === -1) return;
    var minsAway = (ev.getStartTime().getTime() - now.getTime()) / 60000;
    if (dryRun) Logger.log("[dry run] found: " + ev.getTitle() + " at " + ev.getStartTime() + " (" + Math.round(minsAway) + " min away)");

    // 1h reminder: call starts within the next hour. 24h reminder: call starts 23–24h from now
    // (calls booked less than 23h ahead skip it; they only just got the invite).
    var win = null;
    if (minsAway > 0 && minsAway <= 60) win = REMINDER_WINDOWS[1];
    else if (minsAway > 23 * 60 && minsAway <= 24 * 60) win = REMINDER_WINDOWS[0];
    if (!win || ev.getTag(win.tag)) return;

    var guests = ev.getGuestList().map(function (g) { return g.getEmail(); })
      .filter(function (e) { return e && e.toLowerCase() !== me && e.toLowerCase().indexOf("cortexity.studio") === -1; });
    if (!guests.length) return;

    var when = leadTime_(ev.getStartTime(), whatsappDigits_(ev.getDescription() || ""));
    var subject = win.tag === "cx_rem_1h"
      ? "Starting in 1 hour: your Cortexity call"
      : "Tomorrow: your Cortexity call";
    var body =
      "Hi,\n\n" +
      "A quick reminder that our call about your app is " + win.label + ":\n" +
      when + "\n\n" +
      "Join with the Google Meet link in your calendar invite.\n\n" +
      "Can't make it? Reply to this email and we'll find another time.\n\n" +
      "Joseph\nCortexity";

    guests.forEach(function (to) {
      if (dryRun) Logger.log("[dry run] " + subject + " → " + to + ": " + when);
      else GmailApp.sendEmail(to, subject, body, { name: REMINDER_FROM_NAME });
    });
    if (!dryRun) ev.setTag(win.tag, new Date().toISOString());
  });
}

/* ---------- Lead's local time, from the WhatsApp country code ---------- */

// Calling code → [IANA time zone, label shown in the email]. Countries with one time zone only;
// anything else (US/Canada, Australia, unknown) falls back to the script's time zone.
var PHONE_TZ = {
  "961": ["Asia/Beirut", "Lebanon time"],
  "966": ["Asia/Riyadh", "Saudi time"],
  "971": ["Asia/Dubai", "UAE time"],
  "974": ["Asia/Qatar", "Qatar time"],
  "965": ["Asia/Kuwait", "Kuwait time"],
  "973": ["Asia/Bahrain", "Bahrain time"],
  "968": ["Asia/Muscat", "Oman time"],
  "962": ["Asia/Amman", "Jordan time"],
  "963": ["Asia/Damascus", "Syria time"],
  "964": ["Asia/Baghdad", "Iraq time"],
  "970": ["Asia/Gaza", "Palestine time"],
  "972": ["Asia/Jerusalem", "local time"],
  "20": ["Africa/Cairo", "Egypt time"],
  "212": ["Africa/Casablanca", "Morocco time"],
  "213": ["Africa/Algiers", "Algeria time"],
  "216": ["Africa/Tunis", "Tunisia time"],
  "218": ["Africa/Tripoli", "Libya time"],
  "249": ["Africa/Khartoum", "Sudan time"],
  "90": ["Europe/Istanbul", "Turkey time"],
  "44": ["Europe/London", "UK time"],
  "33": ["Europe/Paris", "France time"],
  "49": ["Europe/Berlin", "Germany time"],
  "39": ["Europe/Rome", "Italy time"],
  "34": ["Europe/Madrid", "Spain time"],
  "31": ["Europe/Amsterdam", "Netherlands time"],
  "32": ["Europe/Brussels", "Belgium time"],
  "41": ["Europe/Zurich", "Switzerland time"],
  "30": ["Europe/Athens", "Greece time"],
  "357": ["Asia/Nicosia", "Cyprus time"],
  "91": ["Asia/Kolkata", "India time"],
  "92": ["Asia/Karachi", "Pakistan time"],
  "880": ["Asia/Dhaka", "Bangladesh time"],
  "94": ["Asia/Colombo", "Sri Lanka time"],
  "977": ["Asia/Kathmandu", "Nepal time"],
  "63": ["Asia/Manila", "Philippines time"],
  "65": ["Asia/Singapore", "Singapore time"],
  "60": ["Asia/Kuala_Lumpur", "Malaysia time"],
  "234": ["Africa/Lagos", "Nigeria time"],
  "233": ["Africa/Accra", "Ghana time"],
  "254": ["Africa/Nairobi", "Kenya time"],
  "251": ["Africa/Addis_Ababa", "Ethiopia time"],
  "256": ["Africa/Kampala", "Uganda time"],
  "255": ["Africa/Dar_es_Salaam", "Tanzania time"],
  "27": ["Africa/Johannesburg", "South Africa time"],
};

/** The WhatsApp number Calendly puts in the event description ("WhatsApp Number: +961 81 630 351"), digits only. */
function whatsappDigits_(description) {
  var m = /whats\s*app[^:\n]*:\s*(\+?[\d\s\-().]{6,})/i.exec(description);
  if (!m || m[1].trim().charAt(0) !== "+") return "";
  return m[1].replace(/\D/g, "");
}

/** [time zone, label] for a number, matching the longest calling code (3, 2, then 1 digits); null if unknown. */
function phoneTz_(digits) {
  for (var n = 3; n >= 1; n--) {
    var hit = PHONE_TZ[digits.slice(0, n)];
    if (hit) return hit;
  }
  return null;
}

/** "Tuesday 17 November, 19:00 (Lebanon time)" for a WhatsApp number (digits); the script's time zone when the country is unknown. */
function leadTime_(start, digits) {
  var hit = phoneTz_(digits || "");
  var tz = hit ? hit[0] : Session.getScriptTimeZone();
  var label = hit ? hit[1] : tz;
  return Utilities.formatDate(start, tz, "EEEE d MMMM, HH:mm") + " (" + label + ")";
}

/* ---------- Bounce alerts ---------- */

var BOUNCE_LABEL = "cx-bounce-alerted";
// Only bounces of our own automated emails (confirmation + reminders), not Gmail's duplicate "Delivery Status Notification" threads.
var BOUNCE_SUBJECTS = ["got your application", "your cortexity call"];
var BOUNCE_TABS = ["Applications v3", "Applications v2"];
var STATUS_HEADER = "Email status";

function checkBounces_(dryRun) {
  var cfg = config_(); // apps-script.gs (same project)
  if (!cfg) return;
  var label = GmailApp.getUserLabelByName(BOUNCE_LABEL) || (dryRun ? null : GmailApp.createLabel(BOUNCE_LABEL));
  var props = PropertiesService.getScriptProperties();
  var threads = GmailApp.search("from:mailer-daemon newer_than:3d -label:" + BOUNCE_LABEL, 0, 50);

  threads.forEach(function (th) {
    var subject = th.getFirstMessageSubject().toLowerCase();
    var ours = BOUNCE_SUBJECTS.some(function (x) { return subject.indexOf(x) !== -1; });
    var bounce = th.getMessages().filter(function (m) { return /mailer-daemon/i.test(m.getFrom()); }).pop();
    var to = ours && bounce ? failedRecipient_(bounce) : "";
    if (!to) { if (!dryRun && label) th.addLabel(label); return; }

    var key = "cx_bounced_" + to;
    if (props.getProperty(key)) { if (!dryRun) th.addLabel(label); return; } // already alerted for this address

    var reason = bounceReason_(bounce.getPlainBody());
    var lead = findLead_(to);
    var digits = lead ? String(lead.whatsapp).replace(/\D/g, "") : "";
    var call = findCall_(to, digits);
    if (!digits && call) digits = whatsappDigits_(call.getDescription() || "");
    var first = lead ? String(lead.first || "").trim() : "";

    var msg = waMessage_(first, call, digits);
    var waLink = digits ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(msg) : "";

    if (dryRun) {
      Logger.log("[dry run] bounce: " + to + " (" + reason + ")" + (lead ? " → " + lead.tab + " row " + lead.row : " → not in sheet") +
        (call ? ", call " + call.getStartTime() : ", no call booked") + "\n  WhatsApp: " + (waLink || "(no number)") + "\n  Message: " + msg);
      return;
    }
    if (lead) markStatus_(lead, "Bounced: " + reason);
    sendBounceAlert_(cfg.notifyEmail, to, reason, lead, call, msg, waLink);
    props.setProperty(key, new Date().toISOString());
    th.addLabel(label);
  });
}

/** The address that bounced: Gmail's X-Failed-Recipients header, else read from the bounce text. */
function failedRecipient_(m) {
  var h = "";
  try { h = String(m.getHeader("X-Failed-Recipients") || ""); } catch (e) {}
  var addr = h.split(",")[0].trim();
  if (!addr) {
    var hit = /(?:delivered to|delivering your message to)\s+(\S+@\S+?)(?=\.\s|\s|$)/i.exec(m.getPlainBody());
    addr = hit ? hit[1] : "";
  }
  return addr.toLowerCase();
}

function bounceReason_(body) {
  if (/out of storage|inbox is full|inbox full/i.test(body)) return "their inbox is full";
  if (/does not exist|NoSuchUser|address not found|couldn't be found|domain .* couldn't be found/i.test(body)) return "the address doesn't exist (typo or fake)";
  return "delivery failed";
}

/** The lead's row in the v3 tab, else v2: { tab, sheet, row, first, whatsapp }. */
function findLead_(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var t = 0; t < BOUNCE_TABS.length; t++) {
    var sh = ss.getSheetByName(BOUNCE_TABS[t]);
    if (!sh || sh.getLastRow() < 2) continue;
    var values = sh.getDataRange().getValues();
    var head = values[0];
    var e = head.indexOf("Email"), f = head.indexOf("First name"), w = head.indexOf("WhatsApp");
    for (var r = values.length - 1; r >= 1; r--) { // newest first
      if (String(values[r][e]).trim().toLowerCase() === email) {
        return { tab: BOUNCE_TABS[t], sheet: sh, row: r + 1, first: values[r][f], whatsapp: values[r][w] };
      }
    }
  }
  return null;
}

/** Writes the status in an "Email status" column at the end of the tab (added the first time). */
function markStatus_(lead, text) {
  var sh = lead.sheet;
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var col = head.indexOf(STATUS_HEADER) + 1;
  if (!col) {
    col = sh.getLastColumn() + 1;
    sh.getRange(1, col).setValue(STATUS_HEADER).setFontWeight("bold");
  }
  sh.getRange(lead.row, col).setValue(text);
}

/**
 * The lead's next Cortexity call (from 1 hour ago to 30 days ahead), matched by guest email or by
 * the WhatsApp number in the description (catches leads who fixed their email in Calendly).
 */
function findCall_(email, digits) {
  var now = new Date();
  var events = CalendarApp.getDefaultCalendar().getEvents(new Date(now.getTime() - 60 * 60 * 1000), new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  for (var i = 0; i < events.length; i++) {
    var ev = events[i];
    var desc = ev.getDescription() || "";
    if ((ev.getTitle() + "\n" + desc).toLowerCase().indexOf(REMINDER_TITLE.toLowerCase()) === -1) continue;
    var guests = ev.getGuestList().map(function (g) { return String(g.getEmail()).toLowerCase(); });
    if (guests.indexOf(email) !== -1) return ev;
    if (digits && whatsappDigits_(desc) === digits) return ev;
  }
  return null;
}

/** The meet.google.com link (needs the Google Calendar API service), else Calendly's Google Meet link from the description. */
function meetLink_(ev) {
  try {
    var items = Calendar.Events.list("primary", { iCalUID: ev.getId() }).items || [];
    if (items.length && items[0].hangoutLink) return items[0].hangoutLink;
  } catch (e) {} // service not added: fall through
  var desc = ev.getDescription() || "";
  var m = /https:\/\/meet\.google\.com\/[a-z0-9\-]+/i.exec(desc) || /https:\/\/calendly\.com\/events\/\S+?\/google_meet/i.exec(desc);
  return m ? m[0] : "";
}

/** The ready-made WhatsApp message. */
function waMessage_(first, call, digits) {
  var hi = "Hi" + (first ? " " + first : "") + ", this is Joseph from Cortexity 👋 ";
  if (!call) return hi + "My email didn't reach you, so here's the link to book our call about your app: " + CALENDLY_LINK;
  var link = meetLink_(call);
  return hi + "Just confirming our call about your app on " + leadTime_(call.getStartTime(), digits) +
    (link ? ", here's the Google Meet link: " + link : ".");
}

var CALENDLY_LINK = "https://calendly.com/josephselwan/intro-call";

function sendBounceAlert_(notifyEmail, to, reason, lead, call, msg, waLink) {
  var name = lead ? (String(lead.first || "") ).trim() : to;
  var tz = myTz_()[0]; // "your time" (apps-script.gs)
  var callLine = call ? "Call: " + Utilities.formatDate(call.getStartTime(), tz, "EEE d MMM, HH:mm") + " (your time)" : "No call booked yet";
  var inviteOk = call && call.getGuestList().some(function (g) { return String(g.getEmail()).toLowerCase() !== to && String(g.getEmail()).toLowerCase().indexOf("@") !== -1; });
  var note = inviteOk ? "They used a different email in Calendly, so the invite and reminders do reach them. WhatsApp is optional." :
    (call ? "The Calendly invite and reminders go to the same address, so they have nothing. WhatsApp them." : "");
  var subject = "⚠️ Email bounced: " + name + (call ? " (" + Utilities.formatDate(call.getStartTime(), tz, "EEE d MMM HH:mm") + ")" : "");
  var where = lead ? lead.tab + ", row " + lead.row : "not found in the sheet";

  var text = name + "'s email didn't arrive: " + to + " — " + reason + ".\n" + callLine + "\n" + (note ? note + "\n" : "") +
    "\n" + (waLink ? "Send on WhatsApp (message is ready, just press send):\n" + waLink : "No WhatsApp number found.") +
    "\n\nMessage:\n" + msg + "\n\nSheet: " + where;
  var esc = function (x) { return String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) { return "&#" + c.codePointAt(0) + ";"; }); };
  var html =
    "<p><b>" + esc(name) + "</b>'s email didn't arrive: " + esc(to) + " — " + esc(reason) + ".<br>" + esc(callLine) + "</p>" +
    (note ? "<p>" + esc(note) + "</p>" : "") +
    (waLink ? '<p><a href="' + waLink + '" style="display:inline-block;background:#25D366;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Send on WhatsApp</a></p>' : "<p>No WhatsApp number found.</p>") +
    '<p style="color:#555">Message:<br>' + esc(msg) + "</p><p style=\"color:#888\">Sheet: " + esc(where) + "</p>";
  GmailApp.sendEmail(notifyEmail, subject, text, { name: "Cortexity applications", htmlBody: html });
}

/* ---------- WhatsApp confirm link for every booked call ---------- */

// One email to you per booked call, as soon as it shows up in the calendar, with a one-tap
// WhatsApp link asking the lead to confirm (tagged cx_wa_booked so it is sent once).

function bookingAlerts_(dryRun) {
  var cfg = config_();
  if (!cfg) return;
  var now = new Date();
  var events = CalendarApp.getDefaultCalendar().getEvents(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
  var me = Session.getEffectiveUser().getEmail().toLowerCase();
  events.forEach(function (ev) {
    var desc = ev.getDescription() || "";
    if ((ev.getTitle() + "\n" + desc).toLowerCase().indexOf(REMINDER_TITLE.toLowerCase()) === -1) return;
    var mins = (ev.getStartTime().getTime() - now.getTime()) / 60000;
    if (mins < 0) return; // already started
    if (ev.getTag("cx_wa_booked")) return; // one email per booked call
    var kind = "booked";

    var guest = ev.getGuestList().map(function (g) { return String(g.getEmail()).toLowerCase(); })
      .filter(function (e) { return e && e !== me; })[0] || "";
    var digits = whatsappDigits_(desc);
    var lead = guest ? findLead_(guest) : null;
    if (!digits && lead) digits = String(lead.whatsapp).replace(/\D/g, "");
    var guestName = ev.getTitle().split(/ and /i)[0].trim();
    var first = (lead && String(lead.first || "").trim()) || guestName.split(/\s+/)[0] || "";
    var link = meetLink_(ev);
    var msg = "Hi" + (first ? " " + first : "") + ", this is Joseph from Cortexity 👋 " +
      (kind === "booked" ? "Looking forward to our call about your app on " + leadTime_(ev.getStartTime(), digits) + ", could you confirm you'll be there?"
                         : "Just checking you're still good for our call today at " + Utilities.formatDate(ev.getStartTime(), phoneTz_(digits || "") ? phoneTz_(digits)[0] : Session.getScriptTimeZone(), "HH:mm") + " (" + (phoneTz_(digits || "") ? phoneTz_(digits)[1] : Session.getScriptTimeZone()) + ")?") +
      (link ? " Here's the Google Meet link: " + link : "");
    var waLink = digits ? "https://wa.me/" + digits + "?text=" + encodeURIComponent(msg) : "";

    if (dryRun) { Logger.log("[dry run] " + kind + ": " + ev.getTitle() + " → " + (waLink || "(no WhatsApp number)") + "\n  " + msg); return; }
    sendWaAlert_(cfg.notifyEmail, kind, guestName, ev, guest, msg, waLink);
    ev.setTag(kind === "booked" ? "cx_wa_booked" : "cx_wa_dayof", new Date().toISOString());
  });
}

function sendWaAlert_(notifyEmail, kind, name, ev, guest, msg, waLink) {
  var tz = myTz_()[0]; // "your time" (apps-script.gs)
  var when = Utilities.formatDate(ev.getStartTime(), tz, "EEE d MMM, HH:mm");
  var subject = (kind === "booked" ? "New call booked: " : "Call today: ") + name + " (" + when + ")";
  var esc = function (x) { return String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) { return "&#" + c.codePointAt(0) + ";"; }); };
  var text = name + " — " + when + " (your time)\n" + guest + "\n\n" +
    (waLink ? "Send on WhatsApp (message is ready, just press send):\n" + waLink : "No WhatsApp number found.") + "\n\nMessage:\n" + msg;
  var html = "<p><b>" + esc(name) + "</b> — " + esc(when) + " (your time)<br>" + esc(guest) + "</p>" +
    (waLink ? '<p><a href="' + waLink + '" style="display:inline-block;background:#25D366;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold">Send on WhatsApp</a></p>' : "<p>No WhatsApp number found.</p>") +
    '<p style="color:#555">Message:<br>' + esc(msg) + "</p>";
  GmailApp.sendEmail(notifyEmail, subject, text, { name: "Cortexity applications", htmlBody: html });
}

/** Sends you one sample "New call booked" alert for your next booked call, to check how it looks. */
function testWhatsAppAlert() {
  var cfg = config_();
  var now = new Date();
  var ev = CalendarApp.getDefaultCalendar().getEvents(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)).filter(function (e) {
    return (e.getTitle() + "\n" + (e.getDescription() || "")).toLowerCase().indexOf(REMINDER_TITLE.toLowerCase()) !== -1;
  })[0];
  if (!ev) throw new Error("No upcoming Cortexity call in the calendar.");
  var digits = whatsappDigits_(ev.getDescription() || "");
  var msg = "Hi Test, this is Joseph from Cortexity 👋 Looking forward to our call about your app on " + leadTime_(ev.getStartTime(), digits) + ", could you confirm you'll be there? Here's the Google Meet link: " + meetLink_(ev);
  sendWaAlert_(cfg.notifyEmail, "booked", "[TEST] " + ev.getTitle().split(/ and /i)[0], ev, "", msg, "https://wa.me/" + (digits || "0") + "?text=" + encodeURIComponent(msg));
}
